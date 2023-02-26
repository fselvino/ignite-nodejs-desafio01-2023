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

         //testa se o usuario informou o title ou description
         if (!title || !description) {
          return res.writeHead(400).end(JSON.stringify({ messagem: 'Informar title ou description' }))
        }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at : null,
        created_at: new Date(),
        update_at: new Date()

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
        description,
        update_at: new Date()
      })
      return res.writeHead(204).end()
    }



  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
    

      //retorna um array de task onde id for igual ao informado
      const [task] = database.select('tasks', { id })     

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ messagem: 'Não existe a tarefa informada' }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
          

      //retorna um array de task onde id for igual ao informado
      const [task] = database.select('tasks', { id })
  

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ messagem: 'Não existe a tarefa informada' }))
      }

      let {completed_at} = task
     
      //verifica se completed_at é diferente de null se verdadeiro coloca null se falso informa a data da conclusão da tarefa
      if(completed_at !== null){
        completed_at = null
      }else{
        completed_at = new Date()
      }

      database.update('tasks', id, {
        completed_at,
        update_at: new Date()
      })
      return res.writeHead(204).end()
    }



  },

]