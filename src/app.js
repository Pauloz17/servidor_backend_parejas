import express from 'express';
import cors from 'cors';
import usersRouter from './src/routes/users.routes.js';
import tasksRouter from './src/routes/tasks.routes.js';


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = 3000

app.get('/', (req, res) => {
  res
  .status(200)
  .json({
    message: 'Hola, Bienvenido a mi servidor'
  })
});

app.use('/tasks', tasksRouter)
app.use('/users', usersRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})