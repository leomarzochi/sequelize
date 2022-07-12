const database = require('../models');

class Services {
  constructor(nomeDoModelo) {
    this.nomeDoModelo = nomeDoModelo
  }

  async buscaTodosOsRegistros() {
    const todos = await database[this.nomeDoModelo].findAll()
    return todos
  }

  // todos os casos de crud... 
}

module.exports = Services