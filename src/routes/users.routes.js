import express from 'express';

const usersRouter = express.Router()

usersRouter.get('/', (req, res) => {
    res
        .status(200)
        .json({message: "Lista de tusuarios"})
})

usersRouter.post('/', (req, res) => {
    res
        .status(201)
        .json({message: "Usuario creado"})
})

usersRouter.put('/', (req, res) => {
    res
        .status(201)
        .json({message: "Usuario actualizado"})
})

usersRouter.delete('/', (req, res) => {
    res
        .status(201)
        .json({message: "Usuario eliminado"})
})

export default usersRouter;