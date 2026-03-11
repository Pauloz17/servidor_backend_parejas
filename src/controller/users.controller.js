// Controlador de usuarios
// Capa de control: recibe la petición HTTP desde la ruta,
// llama al modelo para operar los datos, y responde al cliente
// con el código HTTP correcto.
// NUNCA maneja datos directamente (eso es tarea del modelo).

// Importamos las funciones del modelo de usuarios.
// La ruta '../models/users.model.js' sube una carpeta (controller → src)
// y entra a models para encontrar el archivo.
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../models/users.model.js";

// getUsers — Maneja GET /users
// Obtiene todos los usuarios y responde con código 200.
// 200 = OK: la petición fue exitosa y hay datos para devolver.
const getUsers = (req, res) => {
  try {
    const users = getAllUsers(); // Le pedimos los datos al modelo

    res.status(200).json({
      msn: "Lista de usuarios obtenida correctamente",
      data: users,
    });
  } catch (error) {
    // 500 = Internal Server Error: algo falló inesperadamente en el servidor
    res.status(500).json({
      msn: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// getUser — Maneja GET /users/:id
// Busca un usuario por su id. Si no existe responde con 404.
// req.params.id viene como string desde la URL (/users/2 → "2"),
// lo convertimos a número con Number() porque el modelo usa números.
const getUser = (req, res) => {
  try {
    const id = Number(req.params.id); // ejemplo: "2" → 2
    const user = getUserById(id);

    if (!user) {
      // 404 = Not Found: el recurso pedido no existe
      return res.status(404).json({
        msn: `Usuario con id ${id} no encontrado`,
      });
    }

    res.status(200).json({
      msn: "Usuario encontrado",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al buscar usuario",
      error: error.message,
    });
  }
};

// postUser — Maneja POST /users
// Crea un nuevo usuario con los datos del cuerpo de la petición.
// req.body contiene lo que el cliente envió en formato JSON.
// 201 = Created: se creó un recurso nuevo exitosamente.
const postUser = (req, res) => {
  try {
    const { name, email, document } = req.body; // Extraemos los campos del body

    // Validación: los tres campos son obligatorios
    if (!name || !email || !document) {
      // 400 = Bad Request: el cliente envió datos incompletos
      return res.status(400).json({
        msn: "Los campos name, email y document son requeridos",
      });
    }

    const newUser = createUser({ name, email, document });

    res.status(201).json({
      msn: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al crear usuario",
      error: error.message,
    });
  }
};

// putUser — Maneja PUT /users/:id
// Actualiza un usuario existente con los nuevos datos del body.
// 200 si actualizó, 404 si el id no existe.
const putUser = (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, document } = req.body;

    const updatedUser = updateUser(id, { name, email, document });

    if (!updatedUser) {
      return res.status(404).json({
        msn: `Usuario con id ${id} no encontrado`,
      });
    }

    res.status(200).json({
      msn: `Usuario con id ${id} actualizado correctamente`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

// removeUser — Maneja DELETE /users/:id
// Elimina un usuario y devuelve el objeto eliminado.
// Usamos 200 en vez de 204 para poder incluir mensaje en el JSON.
const removeUser = (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletedUser = deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({
        msn: `Usuario con id ${id} no encontrado`,
      });
    }

    res.status(200).json({
      msn: `Usuario con id ${id} eliminado correctamente`,
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

// Exportamos las funciones para que las rutas las puedan importar
export {
  getUsers,
  getUser,
  postUser,
  putUser,
  removeUser,
};