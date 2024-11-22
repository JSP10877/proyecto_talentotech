<?php
// Conexión a la base de datos
$conn = new mysqli('localhost', 'root', '', 'sistema_reseñas');

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos.']));
}

// Obtener el ID de la reseña
$id = $_POST['id'];

$query = "DELETE FROM reseñas WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reseña eliminada correctamente.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Hubo un problema al eliminar la reseña.']);
}

$stmt->close();
$conn->close();
?>
