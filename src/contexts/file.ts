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
      .then(url => ({
        data: url,
      }))
      .catch(err => ({
        error: {
          code: -1,
          message: err.errors[0].message,
        },
      }))
  }
  public static cacheFile (hash: string, url: string) {
    return service.sync().then(() => CachedFile.create({
      hash,
      url,
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
      })))
  }
  public static getFileUrl (hash: string) {
    return CachedFile.findOne({
      where: {
        hash,
      },
    })
      .then((file: { url: string }) => ({ data: file.url }))
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

  public static readRemoteFile (
    hash: string,
    // signature: string
  ) {
    logger.info(`Request remote resource with hash: ${hash}, `)
    const resPipe = axios({
      method: 'get',
      // url: 'http://127.0.0.1:8081/cryptape/projects/nervos-web/CNAME',
      url: 'http://47.97.171.140:3000/files/111',
      responseType: 'stream',
    })

    return resPipe
  }
}

export default FileService
