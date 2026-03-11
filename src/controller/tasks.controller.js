// Controlador de tareas
// Recibe peticiones HTTP, llama al modelo de tareas,
// y responde al cliente con el código correcto.
// Incluye funciones especiales: asignación múltiple,
// filtros, cambio de estado y datos para el dashboard.

// Importamos las funciones del modelo de tareas
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  assignUsersToTask,
  updateTaskStatus,
  getAssignedUsers,
  filterTasks,
  getDashboardData,
} from "../models/tasks.model.js";

// Importamos getUserById del modelo de usuarios para poder devolver
// los datos COMPLETOS de cada usuario asignado, no solo sus ids.
import { getUserById } from "../models/users.model.js";

// getTasks — Maneja GET /tasks
// Obtiene todas las tareas y responde con 200.
const getTasks = (req, res) => {
  try {
    const tasks = getAllTasks();

    res.status(200).json({
      msn: "Lista de tareas obtenida correctamente",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al obtener tareas",
      error: error.message,
    });
  }
};

// getTask — Maneja GET /tasks/:id
// Busca una tarea por id. Responde 404 si no existe.
const getTask = (req, res) => {
  try {
    const id = Number(req.params.id);
    const task = getTaskById(id);

    if (!task) {
      return res.status(404).json({
        msn: `Tarea con id ${id} no encontrada`,
      });
    }

    res.status(200).json({
      msn: "Tarea encontrada",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al buscar tarea",
      error: error.message,
    });
  }
};

// postTask — Maneja POST /tasks
// Crea una nueva tarea. El estado inicial siempre es "pendiente"
// (el modelo se encarga de eso). Responde con 201.
const postTask = (req, res) => {
  try {
    const { title, body, assignedUsers } = req.body;

    // title y body son obligatorios
    if (!title || !body) {
      return res.status(400).json({
        msn: "Los campos title y body son requeridos",
      });
    }

    const newTask = createTask({ title, body, assignedUsers });

    res.status(201).json({
      msn: "Tarea creada correctamente",
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al crear tarea",
      error: error.message,
    });
  }
};

// putTask — Maneja PUT /tasks/:id
// Actualiza campos básicos (title, body). Para estado o usuarios
// asignados existen funciones específicas más abajo.
const putTask = (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, body } = req.body;

    const updatedTask = updateTask(id, { title, body });

    if (!updatedTask) {
      return res.status(404).json({
        msn: `Tarea con id ${id} no encontrada`,
      });
    }

    res.status(200).json({
      msn: `Tarea con id ${id} actualizada correctamente`,
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al actualizar tarea",
      error: error.message,
    });
  }
};

// removeTask — Maneja DELETE /tasks/:id
// Elimina una tarea y devuelve el objeto eliminado.
const removeTask = (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletedTask = deleteTask(id);

    if (!deletedTask) {
      return res.status(404).json({
        msn: `Tarea con id ${id} no encontrada`,
      });
    }

    res.status(200).json({
      msn: `Tarea con id ${id} eliminada correctamente`,
      data: deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al eliminar tarea",
      error: error.message,
    });
  }
};

// assignUsers — Maneja POST /tasks/:id/assign
// Asigna múltiples usuarios a una tarea.
// El body debe enviar: { userIds: [1, 2, 3] }
// El modelo evita duplicados automáticamente con un Set.
const assignUsers = (req, res) => {
  try {
    const id = Number(req.params.id);
    const { userIds } = req.body;

    // Validamos que userIds exista y sea un arreglo
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        msn: "El campo userIds debe ser un arreglo de ids. Ej: { userIds: [1, 2] }",
      });
    }

    const updatedTask = assignUsersToTask(id, userIds);

    if (!updatedTask) {
      return res.status(404).json({
        msn: `Tarea con id ${id} no encontrada`,
      });
    }

    res.status(200).json({
      msn: `Usuarios asignados a la tarea ${id} correctamente`,
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al asignar usuarios",
      error: error.message,
    });
  }
};

// changeStatus — Maneja PATCH /tasks/:id/status
// Cambia el estado de una tarea.
// El body debe enviar: { status: "en progreso" }
// Usamos PATCH (no PUT) porque solo actualizamos UN campo.
// Estados válidos: "pendiente", "en progreso", "completada"
const changeStatus = (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        msn: "El campo status es requerido",
      });
    }

    const result = updateTaskStatus(id, status); // El modelo valida los estados

    if (!result) {
      return res.status(404).json({
        msn: `Tarea con id ${id} no encontrada`,
      });
    }

    // Si el modelo devolvió { error: "..." }, el estado enviado no era válido
    if (result.error) {
      return res.status(400).json({
        msn: result.error,
      });
    }

    res.status(200).json({
      msn: `Estado de tarea ${id} actualizado a "${status}"`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al actualizar estado",
      error: error.message,
    });
  }
};

// getTaskUsers — Maneja GET /tasks/:id/users
// Retorna los datos COMPLETOS de los usuarios asignados.
// Primero obtiene los ids del modelo de tareas,
// luego busca cada usuario en el modelo de usuarios.
const getTaskUsers = (req, res) => {
  try {
    const id = Number(req.params.id);

    const userIds = getAssignedUsers(id); // Obtenemos arreglo de ids: [1, 2]

    if (userIds === null) {
      return res.status(404).json({
        msn: `Tarea con id ${id} no encontrada`,
      });
    }

    // .map() convierte cada id en el objeto completo del usuario
    // .filter(Boolean) elimina los undefined si algún id no existe
    const users = userIds.map((uid) => getUserById(uid)).filter(Boolean);

    res.status(200).json({
      msn: `Usuarios asignados a la tarea ${id}`,
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al obtener usuarios de la tarea",
      error: error.message,
    });
  }
};

// getFilteredTasks — Maneja GET /tasks/filter
// Filtra tareas usando query params en la URL.
// Ejemplo: GET /tasks/filter?userId=1&status=pendiente
// req.query contiene los parámetros después del '?' en la URL.
const getFilteredTasks = (req, res) => {
  try {
    // userId viene como string desde la URL, lo convertimos a número
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const status = req.query.status || undefined;

    const tasks = filterTasks({ userId, status });

    res.status(200).json({
      msn: "Tareas filtradas correctamente",
      filters: { userId, status }, // Mostramos qué filtros se aplicaron
      total: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al filtrar tareas",
      error: error.message,
    });
  }
};

// getDashboard — Maneja GET /tasks/dashboard
// Retorna estadísticas generales: totales por estado y sin asignar.
const getDashboard = (req, res) => {
  try {
    const dashboardData = getDashboardData();

    res.status(200).json({
      msn: "Datos del dashboard obtenidos correctamente",
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      msn: "Error al obtener datos del dashboard",
      error: error.message,
    });
  }
};

// Exportamos todas las funciones para que las rutas las puedan usar
export {
  getTasks,
  getTask,
  postTask,
  putTask,
  removeTask,
  assignUsers,
  changeStatus,
  getTaskUsers,
  getFilteredTasks,
  getDashboard,
};