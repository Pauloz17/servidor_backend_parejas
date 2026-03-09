const getUsers = (req, res) => {
  res
    .status(200)
    .json({ msn: "Lista de usuarios" })
}

const createUsers = (req, res) => {
  const { name, email, document } = req.body;
  res
    .status(201)
    .json({
      msn: "Usuario creado correctamente",
      data: {
        name, email, document
      }
    })
}

const updateUsers = (req, res) => {
  const { id } = req.params;
  const { name, email, document } = req.body;
  res
    .status(200)
    .json({
      msn: `Usuario con id: ${id} actualizado correctamente`,
      data: {
        name, email, document
      }
    })
}

const deleteUsers = (req, res) => {
  const { id } = req.params;
  res
    .status(204)
    .json({
      msn: `Usuario con id: ${id} eliminado correctamente`
    })
}

export {
  getUsers,
  createUsers,
  updateUsers,
  deleteUsers
}