<?php
// device.php - API para manejo de dispositivos VoiceList
require_once 'config.php';

setAPIHeaders();

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            getDeviceUsage($conn);
            break;
        case 'POST':
            createOrUpdateDevice($conn);
            break;
        case 'PUT':
            resetDevice($conn);
            break;
        default:
            jsonResponse([
                'success' => false,
                'error' => 'Método no permitido'
            ], 405);
    }
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Error interno del servidor',
        'message' => $e->getMessage()
    ], 500);
} finally {
    $conn->close();
}

function getDeviceUsage($conn) {
    $device_id = $_GET['device_id'] ?? '';
    
    if (empty($device_id)) {
        jsonResponse([
            'success' => false,
            'error' => 'device_id es requerido'
        ], 400);
    }
    
    $stmt = $conn->prepare("SELECT * FROM device_usage WHERE device_id = ?");
    $stmt->bind_param("s", $device_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        jsonResponse([
            'success' => true,
            'data' => [
                'device_id' => $row['device_id'],
                'voice_count' => (int)$row['voice_count'],
                'first_use' => $row['first_use'],
                'last_use' => $row['last_use'],
                'device_model' => $row['device_model'],
                'os_version' => $row['os_version']
            ]
        ]);
    } else {
        jsonResponse([
            'success' => true,
            'data' => [
                'device_id' => $device_id,
                'voice_count' => 0,
                'is_new' => true
            ]
        ]);
    }
}

function createOrUpdateDevice($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    validateInput($input, ['device_id']);
    
    $device_id = trim($input['device_id']);
    $device_model = trim($input['device_model'] ?? '');
    $os_version = trim($input['os_version'] ?? '');
    $app_version = trim($input['app_version'] ?? '');
    $increment = $input['increment'] ?? false;
    
    if ($increment) {
        // Incrementar contador de uso de voz
        $stmt = $conn->prepare("
            INSERT INTO device_usage (device_id, voice_count, device_model, os_version, app_version) 
            VALUES (?, 1, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            voice_count = voice_count + 1,
            last_use = CURRENT_TIMESTAMP,
            device_model = COALESCE(NULLIF(VALUES(device_model), ''), device_model),
            os_version = COALESCE(NULLIF(VALUES(os_version), ''), os_version),
            app_version = COALESCE(NULLIF(VALUES(app_version), ''), app_version)
        ");
        $stmt->bind_param("ssss", $device_id, $device_model, $os_version, $app_version);
    } else {
        // Solo registrar/actualizar dispositivo sin incrementar
        $stmt = $conn->prepare("
            INSERT INTO device_usage (device_id, voice_count, device_model, os_version, app_version) 
            VALUES (?, 0, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            device_model = COALESCE(NULLIF(VALUES(device_model), ''), device_model),
            os_version = COALESCE(NULLIF(VALUES(os_version), ''), os_version),
            app_version = COALESCE(NULLIF(VALUES(app_version), ''), app_version)
        ");
        $stmt->bind_param("ssss", $device_id, $device_model, $os_version, $app_version);
    }
    
    if (!$stmt->execute()) {
        jsonResponse([
            'success' => false,
            'error' => 'Error al actualizar base de datos'
        ], 500);
    }
    
    // Obtener el contador actualizado
    $stmt2 = $conn->prepare("SELECT voice_count, first_use, last_use FROM device_usage WHERE device_id = ?");
    $stmt2->bind_param("s", $device_id);
    $stmt2->execute();
    $result = $stmt2->get_result();
    $row = $result->fetch_assoc();
    
    jsonResponse([
        'success' => true,
        'data' => [
            'device_id' => $device_id,
            'voice_count' => (int)$row['voice_count'],
            'first_use' => $row['first_use'],
            'last_use' => $row['last_use']
        ]
    ]);
}

function resetDevice($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    validateInput($input, ['device_id']);
    
    $device_id = trim($input['device_id']);
    
    $stmt = $conn->prepare("UPDATE device_usage SET voice_count = 0 WHERE device_id = ?");
    $stmt->bind_param("s", $device_id);
    
    if ($stmt->execute()) {
        jsonResponse([
            'success' => true,
            'message' => 'Dispositivo reseteado correctamente'
        ]);
    } else {
        jsonResponse([
            'success' => false,
            'error' => 'Error al resetear dispositivo'
        ], 500);
    }
}
?>