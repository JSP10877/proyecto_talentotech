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
    die("Error al conectar con la base de datos: " . $e->getMessage());
}

// Verificar si los datos llegaron mediante POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtener los datos del formulario
    $nombre = htmlspecialchars(trim($_POST["nombre"]));
    $correo = htmlspecialchars(trim($_POST["correo"]));
    $comentario = htmlspecialchars(trim($_POST["comentario"]));
    $foto = null;

    // Manejar la subida de la foto (si se envió)
    if (isset($_FILES["foto"]) && $_FILES["foto"]["error"] === UPLOAD_ERR_OK) {
        $fotoTmp = $_FILES["foto"]["tmp_name"];
        $fotoNombre = uniqid() . "_" . basename($_FILES["foto"]["name"]);
        $fotoRuta = "uploads/" . $fotoNombre;

        // Crear la carpeta "uploads" si no existe
        if (!file_exists("uploads")) {
            mkdir("uploads", 0777, true);
        }

        // Mover el archivo a la carpeta "uploads"
        if (move_uploaded_file($fotoTmp, $fotoRuta)) {
            $foto = $fotoRuta;
        } else {
            die("Error al subir la foto.");
        }
    }

    // Insertar los datos en la base de datos
    try {
        $sql = "INSERT INTO reseñas (nombre, correo, comentario, foto) VALUES (:nombre, :correo, :comentario, :foto)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":correo", $correo);
        $stmt->bindParam(":comentario", $comentario);
        $stmt->bindParam(":foto", $foto);

        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Reseña guardada con éxito."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error al guardar la reseña: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
}
?>
