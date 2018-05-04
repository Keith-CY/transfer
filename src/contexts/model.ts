import Sequelize from 'sequelize'

process.env.DATABASE = 'static_dev'
process.env.USERNAME = 'postgres'
process.env.PASSWORD = 'postgres'
process.env.DATABASE_HOST = 'localhost'
process.env.DIALECT = 'postgres'

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorsAliases: false,
  },
)

export const CachedFile = sequelize.define('cached_file', {
  hash: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  url: { type: Sequelize.STRING, allowNull: false },
})

export default sequelize
