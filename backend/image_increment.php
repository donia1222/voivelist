<?php
require_once 'config.php';
setAPIHeaders();

$input = json_decode(file_get_contents('php://input'), true);
$device_id = $input['device_id'] ?? '';

if (empty($device_id)) {
    jsonResponse(['success' => false, 'error' => 'device_id required'], 400);
}

$conn = getDBConnection();

// Insert or increment
$stmt = $conn->prepare("
    INSERT INTO subscriber_image_usage (device_id, daily_count, last_reset_date)
    VALUES (?, 1, CURRENT_DATE)
    ON DUPLICATE KEY UPDATE
    daily_count = daily_count + 1,
    updated_at = CURRENT_TIMESTAMP
");
$stmt->bind_param("s", $device_id);
$stmt->execute();

// Get updated count
$stmt = $conn->prepare("SELECT daily_count FROM subscriber_image_usage WHERE device_id = ?");
$stmt->bind_param("s", $device_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$daily_count = (int)$row['daily_count'];
$can_analyze = $daily_count < 10; // 10 analyses every 10 hours
$remaining = max(0, 10 - $daily_count); // 10 analyses every 10 hours

jsonResponse([
    'success' => true,
    'daily_count' => $daily_count,
    'can_analyze' => $can_analyze,
    'remaining' => $remaining,
    'limit_reached' => $daily_count >= 10 // 10 analyses every 10 hours
]);

$conn->close();
?>