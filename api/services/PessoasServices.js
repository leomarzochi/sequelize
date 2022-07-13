const {Pessoas} = require('../models')
const Services = require('./Services')
const database = require('../models')

class PessoaService extends Services {
  constructor() {
    super('Pessoas');
    this.matriculas = new Services('Matriculas');
  }

  async pegaTodasOsRegistros(where = {}) {
    const todasAsPessoas = await Pessoas.scope('todos').findAll({
      where: { ...where },
    });
    return todasAsPessoas;
  }

  async pegaRegistrosAtivo(where = {}) {
    const registros = await Pessoas.findAll({ where: { ...where } });
    return registros;
  }

  async cancelaPessoaEMatricula(estudanteId) {
    return database.sequelize.transaction(async (t) => {
      await super.atualizaRegistro({ ativo: false }, estudanteId, {
        transaction: t,
      });
      await this.matriculas.atualizaRegistros(
        { status: 'cancelado' },
        {estudante_id: estudanteId},
        { transaction: t }
      );
    });
  }
}

module.exports = PessoaService;