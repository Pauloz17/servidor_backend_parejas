const getTasks = (req, res) => {
  res
    .status(200)
    .json({ msn: "Lista de tareas" })
}

const createTasks = (req, res) => {
  const { user_id, title, body } = req.body;
  res
    .status(201)
    .json(
      {
        msn: "tareas creada correctamente",
        data: {
          user_id, title, body
        }
      })
}

const updateTasks = (req, res) => {
  const { id } = req.params;
  console.log(`Actualizamos el recurso por id: ${id}`);
}

export {
  getTasks,
  createTasks,
  updateTasks
}