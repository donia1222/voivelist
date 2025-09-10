// services/DeviceService.js
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://web.lweb.ch/voice';

class DeviceService {
  constructor() {
    this.deviceId = null;
    this.deviceInfo = null;
    this.voiceCount = 0;
  }

  // Obtener ID único del dispositivo
  async getDeviceId() {
    if (this.deviceId) return this.deviceId;
    
    try {
      this.deviceId = await DeviceInfo.getUniqueId();
      console.log('Device ID obtenido:', this.deviceId);
      return this.deviceId;
    } catch (error) {
      console.error('Error obteniendo device ID:', error);
      // Fallback: generar ID único y guardarlo
      const fallbackId = await this.getFallbackDeviceId();
      this.deviceId = fallbackId;
      return fallbackId;
    }
  }

  // ID de respaldo si falla DeviceInfo
  async getFallbackDeviceId() {
    try {
      let storedId = await AsyncStorage.getItem('@device_unique_id');
      if (!storedId) {
        storedId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('@device_unique_id', storedId);
      }
      console.log('Fallback Device ID:', storedId);
      return storedId;
    } catch (error) {
      console.error('Error con fallback ID:', error);
      return `temp_${Date.now()}`;
    }
  }

  // Obtener información completa del dispositivo
  async getDeviceInfo() {
    if (this.deviceInfo) return this.deviceInfo;

    try {
      const [
        deviceId,
        model,
        systemVersion,
        appVersion,
        brand,
        systemName
      ] = await Promise.all([
        this.getDeviceId(),
        DeviceInfo.getModel(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getVersion(),
        DeviceInfo.getBrand(),
        DeviceInfo.getSystemName()
      ]);

      this.deviceInfo = {
        device_id: deviceId,
        device_model: `${brand} ${model}`,
        os_version: `${systemName} ${systemVersion}`,
        app_version: appVersion
      };

      console.log('Device Info:', this.deviceInfo);
      return this.deviceInfo;
    } catch (error) {
      console.error('Error obteniendo info del dispositivo:', error);
      return {
        device_id: await this.getDeviceId(),
        device_model: 'Unknown',
        os_version: 'Unknown',
        app_version: '1.0.0'
      };
    }
  }

  // Obtener contador de uso actual del servidor
  async getVoiceCount() {
    try {
      const deviceId = await this.getDeviceId();
      const response = await fetch(`${API_BASE}/device.php?device_id=${deviceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.success) {
        this.voiceCount = data.data.voice_count || 0;
        
        // Guardar en caché local
        await AsyncStorage.setItem('@voice_count_cache', JSON.stringify({
          count: this.voiceCount,
          timestamp: Date.now(),
          device_id: deviceId
        }));
        
        return this.voiceCount;
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error obteniendo contador de voz:', error);
      
      // Usar caché local como fallback
      const cached = await this.getCachedVoiceCount();
      return cached;
    }
  }

  // Obtener contador desde caché local
  async getCachedVoiceCount() {
    try {
      const cached = await AsyncStorage.getItem('@voice_count_cache');
      if (cached) {
        const data = JSON.parse(cached);
        const deviceId = await this.getDeviceId();
        
        // Verificar que el caché sea del mismo dispositivo y no muy antiguo (24h)
        const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
        const isSameDevice = data.device_id === deviceId;
        
        if (!isExpired && isSameDevice) {
          this.voiceCount = data.count;
          return data.count;
        }
      }
    } catch (error) {
      console.error('Error leyendo caché:', error);
    }
    
    return 0; // Si no hay caché válido, asumir 0 usos
  }

  // Registrar dispositivo sin incrementar contador
  async registerDevice() {
    try {
      const deviceInfo = await this.getDeviceInfo();
      console.log('Registrando dispositivo:', deviceInfo);
      
      const response = await fetch(`${API_BASE}/device.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...deviceInfo,
          increment: false
        })
      });

      const data = await response.json();
      console.log('Respuesta registro:', data);
      
      if (data.success) {
        this.voiceCount = data.data.voice_count || 0;
        return true;
      } else {
        console.error('Error registrando dispositivo:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error en registerDevice:', error);
      return false;
    }
  }

  // Incrementar contador de uso de voz
  async incrementVoiceCount() {
    try {
      const deviceInfo = await this.getDeviceInfo();
      console.log('Incrementando contador para:', deviceInfo.device_id);
      
      const response = await fetch(`${API_BASE}/device.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...deviceInfo,
          increment: true
        })
      });

      const data = await response.json();
      console.log('Respuesta incremento:', data);
      
      if (data.success) {
        this.voiceCount = data.data.voice_count || 0;
        
        // Actualizar caché local
        await AsyncStorage.setItem('@voice_count_cache', JSON.stringify({
          count: this.voiceCount,
          timestamp: Date.now(),
          device_id: deviceInfo.device_id
        }));
        
        return {
          success: true,
          voice_count: this.voiceCount,
          has_reached_limit: this.voiceCount >= 3
        };
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error incrementando contador:', error);
      return {
        success: false,
        error: error.message,
        voice_count: this.voiceCount
      };
    }
  }

  // Verificar si puede usar la función de voz
  async canUseVoiceFeature(isSubscribed = false) {
    if (isSubscribed) return { canUse: true, reason: 'subscribed' };
    
    const count = await this.getVoiceCount();
    const canUse = count < 3;
    
    return {
      canUse,
      voice_count: count,
      remaining: Math.max(0, 3 - count),
      reason: canUse ? 'within_limit' : 'limit_reached'
    };
  }
}

// Exportar instancia singleton
export default new DeviceService();