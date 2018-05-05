import * as fs from 'fs'
import * as path from 'path'
import Sequelize from 'sequelize'

import axios from 'axios'
import * as log4js from 'log4js'
import { ReadStream } from 'tty'
import service, { CachedFile } from './model'

const logger = log4js.getLogger()
logger.level = 'info'

class FileService {
  public static getCachedFile (hash: string) {
    return CachedFile.findOne({
      where: {
        hash,
      },
    })
      .then(filename => ({
        data: filename,
      }))
      .catch(err => ({
        error: {
          code: -1,
          message: err.errors[0].message,
        },
      }))
  }
  public static cacheFile (hash: string, filename: string) {
    return service.sync().then(() =>
      CachedFile.create({
        hash,
        filename,
      })
        .then(() => ({
          data: true,
        }))
        .catch(err => ({
          error: {
            code: -1,
            message: err.errors
              .map((dbError: { message: string }) => dbError.message)
              .join(),
          },
        })),
    )
  }
  public static getFileName (hash: string) {
    return CachedFile.findOne({
      where: {
        hash,
      },
    })
      .then((file: { filename: string }) => ({ data: file.filename }))
      .catch(err => ({ error: err }))
  }

  public static readCachedFile (filename: string) {
    const filePath = path.join(__dirname, '../public/files/', filename)
    // check if file exists
    try {
      fs.accessSync(filePath)
      // read cached file
      const fileStream = fs.createReadStream(filePath)
      return fileStream
    } catch (err) {
      return {
        error: {
          code: -1,
          message: 'File Not Found',
        },
      }
    }
  }
}

export default FileService
