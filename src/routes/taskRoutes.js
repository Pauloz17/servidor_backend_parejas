// MÓDULO: routes/taskRoutes.js
// CAPA: Rutas (conecta URLs con controladores)

// Responsabilidad única: definir qué función del controlador
// maneja cada combinación de método HTTP + ruta de tareas.

// REGLA CRÍTICA DE ORDEN:
// Express evalúa las rutas en el orden en que están definidas.
// Las rutas /filter y /dashboard deben ir ANTES de /:id.
// Si /:id estuviera primero, Express capturaría "filter" y "dashboard"
// como valores del parámetro id y nunca llegaría a esas rutas específicas.

import { Router } from 'express';

// Se importan las funciones del controlador de tareas
// IMPORTANTE: estos nombres deben coincidir exactamente con los exports de Sebastián
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    assignUsersToTask,
    getAssignedUsers,
    removeUserFromTask,
    filterTasks,
    getDashboard
} from '../controller/tasks.controller.js';

const router = Router();

// ── RUTAS SIN PARÁMETRO DINÁMICO ──
// Estas rutas deben ir PRIMERO para que Express no las confunda con /:id

// GET /api/tasks/filter
// Filtra tareas por estado y/o usuario
// Query params: ?status=pendiente   ?userId=1   ?status=completada&userId=2
// Karol podría usar este endpoint en el futuro para filtrar tareas en el panel admin
router.get('/filter', filterTasks);

// GET /api/tasks/dashboard
// Retorna estadísticas: total, pendientes, enProgreso, completadas
router.get('/dashboard', getDashboard);

// ── RUTAS PRINCIPALES DE TAREAS ──

// GET /api/tasks
// Karol llama este endpoint desde adminPanel.js para mostrar todas las tareas
// También lo llama buscarUsuario.js para obtener las tareas y filtrarlas en el frontend
// Retorna: [{ id, title, description, status, assignedUsers: [1,2,3], createdAt }, ...]
router.get('/', getTasks);

// POST /api/tasks
// Crea una tarea nueva
// Cuerpo: { title, description, status, assignedUsers }
router.post('/', createTask);

// GET /api/tasks/:id
// Retorna una tarea específica
// NOTA: Esta ruta va DESPUÉS de /filter y /dashboard por la regla de orden
router.get('/:id', getTaskById);

// PUT /api/tasks/:id
// Actualiza todos los campos de una tarea
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
// Elimina una tarea
router.delete('/:id', deleteTask);

// ── RUTAS DE ESTADO ──

// PATCH /api/tasks/:id/status
// Cambia solo el estado de una tarea
// Cuerpo: { status: 'pendiente' | 'en_progreso' | 'completada' }
router.patch('/:id/status', updateTaskStatus);

// ── RUTAS DE ASIGNACIÓN DE USUARIOS ──

// POST /api/tasks/:taskId/assign
// Asigna uno o varios usuarios a una tarea
// Cuerpo: { userIds: [1, 2, 3] }
router.post('/:taskId/assign', assignUsersToTask);

// GET /api/tasks/:taskId/users
// Retorna los ids de usuarios asignados a una tarea
router.get('/:taskId/users', getAssignedUsers);

// DELETE /api/tasks/:taskId/users/:userId
// Quita un usuario específico de una tarea
// :taskId es el id de la tarea, :userId es el id del usuario a quitar
router.delete('/:taskId/users/:userId', removeUserFromTask);

// Se exporta el router para que Karol lo registre en app.js con:
// app.use('/api/tasks', tasksRouter)
export default router;