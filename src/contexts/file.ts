import * as fs from 'fs'
import * as path from 'path'
import Sequelize from 'sequelize'
import axios from 'axios'
import * as log4js from 'log4js'
import service, { CachedFile } from './model'
import { FileErrors, ForceFlag } from './../enums'
import log from '../utils/log'

const logger = log('file-context')

declare class process {
  static env: {
    UPLOAD_DIR: string
  }
}

class FileService {
  /**
   * @method cacheFile
   * @description insert to db
   * @param {string} key
   * @param {string} filename
   */
  public static cacheFile (key: string, filename: string, forceFlag: ForceFlag) {
    logger.debug(`caching file with flag ${forceFlag}`)
    return service.sync().then(() =>
      CachedFile.create({
        key,
        filename,
        force_flag: forceFlag,
      })
        .then(() => {
          logger.debug('creating file success')
          return {
            data: true,
          }
        })
        .catch(err => {
          logger.error('creating file failed')
          return {
            error: {
              code: -1,
              message: err.errors
                ? err.errors
                  .map((dbError: { message: string }) => dbError.message)
                  .join()
                : JSON.stringify(err),
            },
          }
        }),
    )
  }
  /**
   * @method updateFile
   * @description update record
   * @param {string} key
   * @param {string} filename
   */
  public static updateFile (
    key: string,
    filename: string,
    forceFlag: ForceFlag,
  ) {
    logger.debug(`updating file with flag ${forceFlag}`)
    return CachedFile.update(
      {
        filename,
      },
      {
        where: {
          key,
        },
      },
    )
      .then(() => {
        logger.debug('updating file success')
        return { data: true }
      })
      .catch((err: any) => {
        const message = err.errors
          ? err.errors
            .map((dbError: { message: string }) => dbError.message)
            .join()
          : JSON.stringify(err)
        logger.error('updating file failed')
        logger.error(message)
        return {
          error: {
            code: -1,
            message,
          },
        }
      })
  }
  /**
   * @method getFile
   * @description query file name
   * @param {string} key
   */
  public static getFile (key: string) {
    logger.debug('getting filename')
    return CachedFile.findOne({
      where: {
        key,
      },
    })
      .then((file: { filename: string; force_flag: ForceFlag }) => {
        if (file && file.filename) {
          logger.debug(
            `getting filename success, key: ${key}, filename: ${file.filename}`,
          )
          return {
            data: { filename: file.filename, forceFlag: file.force_flag },
          }
        }
        return {
          error: {
            code: -1,
            message: FileErrors.NotFound,
          },
        }
      })
      .catch(err => {
        logger.error(`get filename failed`)
        return {
          error: { code: -1, message: JSON.stringify(err) },
        }
      })
  }

  public static loadCachedFile (filename: string) {
    logger.debug('loading cached file')
    const filePath = path.join(
      __dirname,
      '../',
      process.env.UPLOAD_DIR,
      filename,
    )
    // check if file exists
    try {
      logger.debug('Verifying file accessibility')
      fs.accessSync(filePath, fs.constants.R_OK)
      const fileStream = fs.createReadStream(filePath)
      logger.debug('Loading Success')
      return fileStream
    } catch (err) {
      logger.error(FileErrors.NotFound)
      return {
        error: {
          code: -1,
          message: FileErrors.NotFound,
        },
      }
    }
  }
}

export default FileService
