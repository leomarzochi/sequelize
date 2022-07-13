const database = require('../models')
const {literal} = require('sequelize')
const {PessoaServices} = require('../services');

const pessoaServices = new PessoaServices()

class PessoaController {
  static async pegaTodasAsPessoas(req, res) {
    try {
      const pessoasAtivas = await pessoaServices.pegaTodasOsRegistros()
      return res.status(200).json(pessoasAtivas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaTodosAtivos(req, res) {
    try {
      const todasAsPessoas = await pessoaServices.pegaRegistrosAtivo();
      return res.status(200).json(todasAsPessoas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaUmaPessoa(req, res) {
    const { id } = req.params;
    try {
      const umaPessoa = await database.Pessoas.findOne({
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(umaPessoa);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body;
    try {
      const novaPessoaCriada = await database.Pessoas.create(novaPessoa);
      return res.status(200).json(novaPessoaCriada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizaPessoa(req, res) {
    const { id } = req.params;
    const novasInfos = req.body;
    try {
      await database.Pessoas.update(novasInfos, { where: { id: Number(id) } });
      const pessoaAtualizada = await database.Pessoas.findOne({
        where: { id: Number(id) },
      });
      return res.status(200).json(pessoaAtualizada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params;
    try {
      await database.Pessoas.destroy({ where: { id: Number(id) } });
      return res.status(200).json({ mensagem: `id ${id} deletado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaUmaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    try {
      const umaMatricula = await database.Matriculas.findOne({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        },
      });
      return res.status(200).json(umaMatricula);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params;
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) };
    try {
      const novaMatriculaCriada = await database.Matriculas.create(
        novaMatricula
      );
      return res.status(200).json(novaMatriculaCriada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;
    const novasInfos = req.body;
    try {
      await database.Matriculas.update(novasInfos, {
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId),
        },
      });
      const MatriculaAtualizada = await database.Matriculas.findOne({
        where: { id: Number(matriculaId) },
      });
      return res.status(200).json(MatriculaAtualizada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async apagaMatricula(req, res) {
    const { matriculaId } = req.params;
    try {
      await database.Matriculas.destroy({ where: { id: Number(matriculaId) } });
      return res.status(200).json({ mensagem: `id ${matriculaId} deletado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static restauraPessoa = async (req, res) => {
    const { id } = req.params;

    try {
      await database.Pessoas.restore({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: `Id ${id} restaurado com sucesso!` });
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  static pegaTodasAsMatriculas = async (req, res) => {
    const { id } = req.params;

    try {
      const pessoa = await database.Pessoas.findOne({
        where: {
          id,
        },
      });

      const matriculasAtivas = await pessoa.getAulasMatriculadas();

      res.status(200).json(matriculasAtivas);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  static pegaMatriculasPorTurma = async (req, res) => {
    const { turmaId } = req.params;

    try {
      const matriculas = await database.Matriculas.findAndCountAll({
        where: {
          turma_id: turmaId,
        },
        limit: 5,
        order: [['estudante_id', 'DESC']],
      });
      res.status(200).json(matriculas);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  static pegaTurmasLotadas = async (req, res) => {
    const limiteTurma = 2;
    try {
      const turmasLotada = await database.Matriculas.findAndCountAll({
        where: {
          status: 'confirmado',
        },
        atributes: ['turma_id'],
        group: ['turma_id'],
        having: literal(`count(turma_id) >= ${limiteTurma}`),
      });
      res.status(200).json(turmasLotada.count);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  static cancelaEstudante = async (req, res) => {
    const { estudanteId } = req.params;
    try {
      await pessoaServices.cancelaPessoaEMatricula(Number(estudanteId))
      return res.status(200).json({message: 'Estudante cancelado com sucesso.'})
    } catch (err) {
      res.status(200).json(err.message)
    }
  }
}

module.exports = PessoaController