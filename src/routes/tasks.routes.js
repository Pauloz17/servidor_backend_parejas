import express from 'express';
import { getTasks, createTasks, updateTasks } from '../controller/tasks.controller.js';

const tasksRouter = express.Router();

tasksRouter.get('/', getTasks);

tasksRouter.post('/', createTasks)

tasksRouter.put('/:id', updateTasks)

export default tasksRouter;