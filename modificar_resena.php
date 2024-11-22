<?php
// Conexión a la base de datos
$conn = new mysqli('localhost', 'root', '', 'sistema_reseñas');

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos.']));
}

// Obtener los datos
$id = $_POST['id'];
$comentario = $_POST['comentario'];

$query = "UPDATE reseñas SET comentario = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('si', $comentario, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reseña actualizada correctamente.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Hubo un problema al actualizar la reseña.']);
}

$stmt->close();
$conn->close();
?>
