import * as path from 'path'
import Sequelize from 'sequelize'

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
require('dotenv').config({
  path: path.join(
    __dirname,
    '../../config/',
    process.env.NODE_ENV === 'development' ? '.env' : '.env.prod',
  ),
})

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
