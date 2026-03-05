import express from 'express'

const tasksRouter = express.Router()

tasksRouter.get('/', (req, res) => {
    res
        .status(200)
        .json({message: "Lista de tareas"})
})

tasksRouter.post('/', (req, res) => {
    res
        .status(201)
        .json({message: "Tarea creada"})
})

export default tasksRouter;