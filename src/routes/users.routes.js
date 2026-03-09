import express from 'express';

const usersRouter = express.Router();

usersRouter.get('/', (req, res) => {
    res
        .status(200)
        .json({ message: "Lista de usuarios" })
});

usersRouter.post('/', (req, res) => {
    const { name, email, document } = req.body;
    res
    .status(201)
    .json(
        {
            message: "Usuario creado",
            data: {
            name, email, document
            }
        }
    )
})

usersRouter.put('/', (req, res) => {
    res
        .status(204)
        .json({ message: "Usuario actualizado" })
})

usersRouter.delete('/', (req, res) => {
    res
        .status(204)
        .json({ message: "Usuario eliminado" })
})

export default usersRouter;