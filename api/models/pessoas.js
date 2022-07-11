'use strict'
module.exports = (sequelize, DataTypes) => {
  const Pessoas = sequelize.define('Pessoas', {
    nome: { 
      type: DataTypes.STRING,
      validate: {
        validaNome(dado) {
          if(dado.length < 2) {
            throw new Error('Campo nome náo pode ser menor que 2 caracteres')
          }
        }
      }
    },
    ativo: DataTypes.BOOLEAN,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'e-mail inválido'
        }
      }
    },
    role: DataTypes.STRING
  }, { paranoid: true,
    defaultScope: { 
      where: { ativo: true } 
    },
    scopes: { 
      todos: { where: {} } 
    }
  })
  Pessoas.associate = function(models) {
    Pessoas.hasMany(models.Turmas, {
      foreignKey: 'docente_id'
    }) 
    Pessoas.hasMany(models.Matriculas, {
      foreignKey: 'estudante_id',
      scope: { status: 'confirmado'},
      as: 'aulasMatriculadas'
    })

  }
  return Pessoas
}