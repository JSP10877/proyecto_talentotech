<?php
// Configuración de la base de datos
$host = "localhost"; 
$dbname = "sistema_reseñas"; 
$username = "root"; 
$password = ""; 

// Conexión a la base de datos
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Error al conectar con la base de datos: " . $e->getMessage()]));
}

// Obtener todas las reseñas
try {
    $sql = "SELECT id, nombre, correo, comentario, foto FROM reseñas ORDER BY id DESC";
    $stmt = $conn->query($sql);
    $reseñas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "reseñas" => $reseñas]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al obtener las reseñas: " . $e->getMessage()]);
}
?>
