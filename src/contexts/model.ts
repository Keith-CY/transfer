import * as path from 'path'
import Sequelize from 'sequelize'
import envPath from '../utils/envPath'

declare class process {
  static env: {
    NODE_ENV: string
    DATABASE: string
    USERNAME: string
    PASSWORD: string
    DATABASE_HOST: string
    DIALECT: string
    UPLOAD_DIR: string
  }
}

if (process.env.NODE_ENV === 'development') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: path.join(__dirname, '../../config/', envPath(process.env.NODE_ENV)),
  })
  /* eslint-enable global-require */
}

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
  key: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
})

export default sequelize
