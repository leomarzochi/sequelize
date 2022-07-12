const {Pessoas} = require('../models')
const Services = require('./Services')

class PessoaService extends Services {
  constructor () {
    super('Pessoas')
  }

  async pegaTodasOsRegistros(where = {}) {
    const todasAsPessoas = await Pessoas
      .scope('todos')
      .findAll({where: { ...where }})
    return todasAsPessoas
  }

  async pegaRegistrosAtivo(where = {}) {
    const registros = await Pessoas
      .findAll({where: { ...where }})
    return registros
  }
}

module.exports = PessoaService;