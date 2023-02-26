import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(
        () => {
          this.#persist()
        }
      )
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  //search recebe um objeto com {id}
  select(table, search) {
    let data = this.#database[table] ?? []

    //se existir o id
    if (search) {
      //filtra o objeto e retorno chave valor
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true

          return row[key].includes(value)
        })
      })
    }
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      const a = this.#database[table][rowIndex] = { id, ...row, ...data }

      this.#persist()
    }
  }
}