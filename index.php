<?php
// AWebServer ke liye Error Reporting ON karein
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Manual Autoload: src folder se classes ko auto-load karega
spl_autoload_register(function ($class) {
    $prefix = 'PHPOffline\\';
    $base_dir = __DIR__ . '/src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

use PHPOffline\PHPOffline;

// Initialize PHPOffline for Vypo
$phpOffline = new PHPOffline([
    'app_name'           => 'Vypo ERP System',
    'database'           => 'vypo_offline.sqlite',
    'auto_localize_cdns' => true,
    'assets_dir'         => __DIR__ . '/assets/'
]);

// Start output buffering for CDNs
$phpOffline->init();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vypo - Offline Environment Test</title>
    <!-- External CDN Test -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 40px 20px; display: flex; justify-content: center; }
        .container { max-width: 600px; width: 100%; }
    </style>
</head>
<body>

<div class="container">
    <h2 style="text-align: center;">Vypo System Setup</h2>
    
    <?php 
    // Render the Offline Settings Card UI
    $templatePath = __DIR__ . '/templates/offline-settings-card.php';
    if (file_exists($templatePath)) {
        include $templatePath; 
    } else {
        echo "<p style='color:red; text-align:center;'>Error: templates/offline-settings-card.php file missing hai!</p>";
    }
    ?>
</div>

</body>
</html>
