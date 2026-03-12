// MÓDULO: routes/userRoutes.js
// CAPA: Rutas (conecta URLs con controladores)

// Responsabilidad única: definir qué función del controlador
// maneja cada combinación de método HTTP + ruta.

// Se importa Router de Express para crear un enrutador independiente
// El enrutador es como una mini-aplicación que solo conoce su fragmento de URL
import { Router } from 'express';

// Se importan las funciones del controlador de usuarios
// IMPORTANTE: estos nombres deben coincidir exactamente con los exports de Sebastián
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserTasks
} from '../controller/users.controller.js';

// Se crea la instancia del router
const router = Router();

// GET /api/users
// Karol llama este endpoint desde obtenerTodosLosUsuarios() en usuariosApi.js
// Retorna el arreglo completo de usuarios: [{ id, documento, name, email }, ...]
router.get('/', getUsers);

// GET /api/users/:id
// Retorna un usuario específico por su id numérico
// El parámetro :id llega como string en req.params; el controlador lo convierte a número
router.get('/:id', getUserById);

// POST /api/users
// Karol llama este endpoint desde crearUsuario() en usuariosApi.js
// El cuerpo de la petición llega como: { documento, name, email }
router.post('/', createUser);

// PUT /api/users/:id
// Actualiza los datos de un usuario existente
// El cuerpo puede traer cualquier combinación de { documento, name, email }
router.put('/:id', updateUser);

// DELETE /api/users/:id
// Karol llama este endpoint desde eliminarUsuario() en usuariosApi.js
// El parámetro :id identifica al usuario que se va a eliminar
router.delete('/:id', deleteUser);

// GET /api/users/:userId/tasks
// Retorna todas las tareas asignadas a un usuario específico
// El parámetro se llama :userId (no :id) para diferenciarlo del de usuario
router.get('/:userId/tasks', getUserTasks);

// Se exporta el router para que Karol lo registre en app.js con:
// app.use('/api/users', usersRouter)
export default router;