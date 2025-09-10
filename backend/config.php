<?php
// config.php - Configuración de base de datos para VoiceList

// Configuración de la base de datos
define('DB_HOST', 'owoxogis.mysql.db.internal');
define('DB_NAME', 'owoxogis_voicelist');
define('DB_USER', 'owoxogis_voice');
define('DB_PASS', 'TU_PASSWORD_AQUI'); // Debes poner tu password real aquí

// Función para conectar a la base de datos
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception('Connection failed: ' . $conn->connect_error);
        }
        
        // Establecer charset UTF-8
        $conn->set_charset("utf8");
        
        return $conn;
        
    } catch (Exception $e) {
        http_response_code(500);
        die(json_encode([
            'success' => false,
            'error' => 'Database connection failed',
            'message' => $e->getMessage()
        ]));
    }
}

// Headers comunes para la API
function setAPIHeaders() {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Función para respuesta JSON estandarizada
function jsonResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Función para validar entrada
function validateInput($data, $required_fields = []) {
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            jsonResponse([
                'success' => false,
                'error' => "Campo requerido: {$field}"
            ], 400);
        }
    }
}
?>