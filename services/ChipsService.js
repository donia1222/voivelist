// ========================================
// Servicio para gestionar los chips de características
// ========================================

const { executeQuery } = require('../database/mysql_config');

class ChipsService {

  /**
   * Obtener todos los chips activos para un idioma específico
   * @param {string} languageCode - Código del idioma (es, en, fr, etc.)
   * @returns {Promise<Array>} Lista de chips con sus traducciones
   */
  static async getChipsForLanguage(languageCode = 'en') {
    try {
      const query = `
        SELECT
          fc.id,
          fc.chip_key,
          fc.icon_name,
          fc.icon_color,
          fc.display_order,
          fct.text_content
        FROM feature_chips fc
        LEFT JOIN feature_chip_translations fct ON fc.id = fct.chip_id
        WHERE fc.is_active = TRUE
        AND fct.language_code = ?
        ORDER BY fc.display_order
      `;

      const chips = await executeQuery(query, [languageCode]);

      // Si no hay traducción para el idioma solicitado, usar inglés como fallback
      if (chips.length === 0) {
        return await this.getChipsForLanguage('en');
      }

      return chips;
    } catch (error) {
      console.error('Error obteniendo chips:', error);
      // Retornar datos por defecto en caso de error
      return this.getDefaultChips();
    }
  }

  /**
   * Obtener un chip específico por su clave
   * @param {string} chipKey - Clave del chip
   * @param {string} languageCode - Código del idioma
   * @returns {Promise<Object|null>} Chip encontrado o null
   */
  static async getChipByKey(chipKey, languageCode = 'en') {
    try {
      const query = `
        SELECT
          fc.id,
          fc.chip_key,
          fc.icon_name,
          fc.icon_color,
          fc.display_order,
          fct.text_content
        FROM feature_chips fc
        LEFT JOIN feature_chip_translations fct ON fc.id = fct.chip_id
        WHERE fc.chip_key = ?
        AND fc.is_active = TRUE
        AND fct.language_code = ?
      `;

      const result = await executeQuery(query, [chipKey, languageCode]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error obteniendo chip por clave:', error);
      return null;
    }
  }

  /**
   * Crear un nuevo chip
   * @param {Object} chipData - Datos del chip
   * @param {Object} translations - Traducciones del chip
   * @returns {Promise<number>} ID del chip creado
   */
  static async createChip(chipData, translations = {}) {
    try {
      // Insertar el chip
      const insertChipQuery = `
        INSERT INTO feature_chips (chip_key, icon_name, icon_color, display_order)
        VALUES (?, ?, ?, ?)
      `;

      const result = await executeQuery(insertChipQuery, [
        chipData.chip_key,
        chipData.icon_name,
        chipData.icon_color,
        chipData.display_order || 999
      ]);

      const chipId = result.insertId;

      // Insertar las traducciones
      if (Object.keys(translations).length > 0) {
        await this.addTranslations(chipId, translations);
      }

      return chipId;
    } catch (error) {
      console.error('Error creando chip:', error);
      throw error;
    }
  }

  /**
   * Actualizar un chip existente
   * @param {string} chipKey - Clave del chip
   * @param {Object} chipData - Nuevos datos del chip
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async updateChip(chipKey, chipData) {
    try {
      const query = `
        UPDATE feature_chips
        SET icon_name = ?, icon_color = ?, display_order = ?
        WHERE chip_key = ?
      `;

      await executeQuery(query, [
        chipData.icon_name,
        chipData.icon_color,
        chipData.display_order,
        chipKey
      ]);

      return true;
    } catch (error) {
      console.error('Error actualizando chip:', error);
      return false;
    }
  }

  /**
   * Agregar o actualizar traducciones para un chip
   * @param {number} chipId - ID del chip
   * @param {Object} translations - Objeto con traducciones {languageCode: text}
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async addTranslations(chipId, translations) {
    try {
      const query = `
        INSERT INTO feature_chip_translations (chip_id, language_code, text_content)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE text_content = VALUES(text_content)
      `;

      for (const [languageCode, textContent] of Object.entries(translations)) {
        await executeQuery(query, [chipId, languageCode, textContent]);
      }

      return true;
    } catch (error) {
      console.error('Error agregando traducciones:', error);
      return false;
    }
  }

  /**
   * Activar/desactivar un chip
   * @param {string} chipKey - Clave del chip
   * @param {boolean} isActive - Estado activo
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async setChipStatus(chipKey, isActive = true) {
    try {
      const query = `
        UPDATE feature_chips
        SET is_active = ?
        WHERE chip_key = ?
      `;

      await executeQuery(query, [isActive, chipKey]);
      return true;
    } catch (error) {
      console.error('Error cambiando estado del chip:', error);
      return false;
    }
  }

  /**
   * Reordenar chips
   * @param {Array} chipOrders - Array de {chipKey, displayOrder}
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async reorderChips(chipOrders) {
    try {
      const query = `
        UPDATE feature_chips
        SET display_order = ?
        WHERE chip_key = ?
      `;

      for (const { chipKey, displayOrder } of chipOrders) {
        await executeQuery(query, [displayOrder, chipKey]);
      }

      return true;
    } catch (error) {
      console.error('Error reordenando chips:', error);
      return false;
    }
  }

  /**
   * Eliminar un chip y sus traducciones
   * @param {string} chipKey - Clave del chip
   * @returns {Promise<boolean>} Éxito de la operación
   */
  static async deleteChip(chipKey) {
    try {
      const query = `
        DELETE FROM feature_chips
        WHERE chip_key = ?
      `;

      await executeQuery(query, [chipKey]);
      return true;
    } catch (error) {
      console.error('Error eliminando chip:', error);
      return false;
    }
  }

  /**
   * Datos por defecto en caso de error de conexión
   */
  static getDefaultChips() {
    return [
      {
        id: 1,
        chip_key: 'lightning_fast',
        icon_name: 'flash',
        icon_color: '#10b981',
        display_order: 1,
        text_content: 'Lightning Fast'
      },
      {
        id: 2,
        chip_key: 'ai_powered',
        icon_name: 'shield-checkmark',
        icon_color: '#4a6bff',
        display_order: 2,
        text_content: 'AI Powered'
      },
      {
        id: 3,
        chip_key: 'super_easy',
        icon_name: 'heart',
        icon_color: '#ff00909c',
        display_order: 3,
        text_content: 'Super Easy'
      }
    ];
  }
}

module.exports = ChipsService;