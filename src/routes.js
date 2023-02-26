import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto'

const database = new Database

export const routes = [

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const task = database.select('tasks')

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description
      }

      database.insert('tasks', task)
      return res.writeHead(201).end()
    }

  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      //testa se o usuario informou o title ou description
      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ messagem: 'Informar title ou description' }))
      }

      //retorna um array de task onde id for igual ao informado
      const [task] = database.select('tasks', { id })


      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ messagem: 'Não existe a tarefa informada' }))
      }

      database.update('tasks', id, {
        title,
        description
      })
      return res.writeHead(204).end()
    }



  },

]