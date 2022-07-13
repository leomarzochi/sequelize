const database = require('../models');

class Services {
  constructor(nomeDoModelo) {
    this.nomeDoModelo = nomeDoModelo
  }

  async buscaTodosOsRegistros() {
    const todos = await database[this.nomeDoModelo].findAll()
    return todos
  }

  async atualizaRegistro(dadosAtualizados, id, transacao = {}) {
    return database[this.nomeDoModelo]
      .update(dadosAtualizados, {where: {id}}, transacao)
  }

  async atualizaRegistros(dadosAtualizados, where, transacao = {}) {
    return database[this.nomeDoModelo]
      .update(dadosAtualizados, {where: {...where}}, transacao)
  }

  // todos os casos de crud... 
}

module.exports = Services