<?php
require_once 'config.php';
setAPIHeaders();

$device_id = $_GET['device_id'] ?? '';
if (empty($device_id)) {
    jsonResponse(['success' => false, 'error' => 'device_id required'], 400);
}

$conn = getDBConnection();

// Get current usage
$stmt = $conn->prepare("SELECT daily_count, last_reset_date, updated_at FROM subscriber_image_usage WHERE device_id = ?");
$stmt->bind_param("s", $device_id);
$stmt->execute();
$result = $stmt->get_result();

$daily_count = 0;
$should_reset = true;

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $daily_count = (int)$row['daily_count'];
    $last_reset = $row['last_reset_date'];
    $updated_at = $row['updated_at'];
    $today = date('Y-m-d');

    // For testing: reset every 30 seconds instead of 10 hours
    // In production: change this to reset every 10 hours (36000 seconds)
    $last_update_time = strtotime($updated_at);
    $should_reset = (time() - $last_update_time) >= 36000; // 10 hours = 36000 seconds
}

// Auto-reset if needed
if ($should_reset && $daily_count > 0) {
    $stmt = $conn->prepare("UPDATE subscriber_image_usage SET daily_count = 0, last_reset_date = CURRENT_DATE WHERE device_id = ?");
    $stmt->bind_param("s", $device_id);
    $stmt->execute();
    $daily_count = 0;
}

$can_analyze = $daily_count < 10; // 10 analyses every 10 hours
$remaining = max(0, 10 - $daily_count); // 10 analyses every 10 hours

// Calculate time until next reset
$time_until_reset = 0;
if ($daily_count > 0 && isset($updated_at)) {
    $last_update_time = strtotime($updated_at);
    $time_until_reset = max(0, 36000 - (time() - $last_update_time)); // 10 hours = 36000 seconds
}

$hours = floor($time_until_reset / 3600);
$minutes = floor(($time_until_reset % 3600) / 60);

jsonResponse([
    'success' => true,
    'can_analyze' => $can_analyze,
    'daily_count' => $daily_count,
    'remaining' => $remaining,
    'limit' => 10, // 10 analyses every 10 hours
    'time_until_reset' => $time_until_reset,
    'hours_until_reset' => round($time_until_reset / 3600, 1),
    'time_remaining_text' => $hours . 'h ' . $minutes . 'm'
]);

$conn->close();
?>