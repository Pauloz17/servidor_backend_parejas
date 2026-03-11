
// Modelo de tareas
// Capa de datos para tareas. Solo gestiona el arreglo,
// no sabe nada de HTTP. El controlador lo consume.
// Cada tarea puede tener múltiples usuarios asignados.

// Estados válidos para una tarea.
// Los exportamos para reutilizarlos en el controlador.
const TASK_STATES = {
  PENDING:     "pendiente",
  IN_PROGRESS: "en progreso",
  COMPLETED:   "completada",
};

// Arreglo que simula la "base de datos" de tareas en memoria.
// assignedUsers es un arreglo de ids de usuarios asignados a la tarea.
// Arreglo vacío: las tareas se crean desde el frontend en tiempo de ejecución
let tasks = [];

// Contador para generar ids únicos y crecientes.
// Empieza en 1 porque aún no hay tareas creadas.
let nextId = 1;

// getAllTasks — Retorna todas las tareas del arreglo.
const getAllTasks = () => {
  return tasks;
};

// getTaskById — Busca y retorna UNA tarea según su id.
const getTaskById = (id) => {
  return tasks.find((task) => task.id === id);
};

// createTask — Crea una nueva tarea con estado inicial "pendiente".
// assignedUsers es opcional; si no se envía, arranca como arreglo vacío.
const createTask = (taskData) => {
  const newTask = {
    id: nextId,
    title: taskData.title,
    body: taskData.body,
    status: TASK_STATES.PENDING,                    // Toda tarea nueva inicia en "pendiente"
    assignedUsers: taskData.assignedUsers || [],    // Si no mandan usuarios, arreglo vacío
  };

  nextId++;
  tasks.push(newTask);

  return newTask;
};

// updateTask — Actualiza campos básicos (title, body) de una tarea.
// El estado y los usuarios asignados tienen sus propias funciones.
const updateTask = (id, taskData) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  tasks[index] = {
    ...tasks[index], // Conserva id, status, assignedUsers
    ...taskData,     // Sobreescribe title y/o body
  };

  return tasks[index];
};

// deleteTask — Elimina una tarea del arreglo.
const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  const deleted = tasks.splice(index, 1);
  return deleted[0];
};

// assignUsersToTask — Asigna MÚLTIPLES usuarios a una tarea.
// No duplica: usa un Set para evitar repetidos automáticamente.
const assignUsersToTask = (id, userIds) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  // Unimos los usuarios ya asignados con los nuevos usando Set
  const combined = new Set([...tasks[index].assignedUsers, ...userIds]);

  tasks[index].assignedUsers = Array.from(combined); // Set → arreglo normal

  return tasks[index];
};

// updateTaskStatus — Actualiza el ESTADO de una tarea.
// Valida que el estado sea uno de los permitidos antes de guardar.
const updateTaskStatus = (id, newStatus) => {
  const validStates = Object.values(TASK_STATES); // ["pendiente","en progreso","completada"]

  if (!validStates.includes(newStatus)) {
    // Retornamos objeto con error para que el controlador lo detecte
    return { error: `Estado inválido. Estados permitidos: ${validStates.join(", ")}` };
  }

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  tasks[index].status = newStatus;

  return tasks[index];
};

// getAssignedUsers — Retorna el arreglo de ids de usuarios asignados.
const getAssignedUsers = (id) => {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return null;
  }

  return task.assignedUsers; // Ej: [1, 2, 3]
};

// filterTasks — Filtra tareas por usuario asignado y/o estado.
// Ambos parámetros son opcionales; sin filtros devuelve todo.
const filterTasks = ({ userId, status } = {}) => {
  let result = tasks;

  if (userId) {
    // Solo tareas donde ese userId esté en assignedUsers
    result = result.filter((task) => task.assignedUsers.includes(userId));
  }

  if (status) {
    // Solo tareas con ese estado exacto
    result = result.filter((task) => task.status === status);
  }

  return result;
};

// getDashboardData — Retorna estadísticas generales del proyecto.
const getDashboardData = () => {
  return {
    totalTasks:      tasks.length,
    pendingTasks:    tasks.filter((t) => t.status === TASK_STATES.PENDING).length,
    inProgressTasks: tasks.filter((t) => t.status === TASK_STATES.IN_PROGRESS).length,
    completedTasks:  tasks.filter((t) => t.status === TASK_STATES.COMPLETED).length,
    unassignedTasks: tasks.filter((t) => t.assignedUsers.length === 0).length,
  };
};

// Exportamos todo: funciones y los estados permitidos
export {
  TASK_STATES,
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
};