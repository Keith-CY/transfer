import * as fs from 'fs'
import * as path from 'path'
import * as FormData from 'form-data'
import axios from 'axios'
import { Context } from 'koa'
import fileService from '../contexts/file'
import cacheFile from '../utils/cacheFile'
import { FileErrors } from './../enums'
import { CachedFile } from './../contexts/model'
import logger from '../utils/logger'
// import { process } from '../types/index'

declare class process {
  static env: {
    UPLOAD_DIR: string
  }
}
interface SError {
  code: number
  message: string
}

interface FileData {
  data?: string
  error?: SError
}

class Files {
  /**
   * @function show
   * @description load local file
   */
  public static async show (ctx: Context, next: Function) {
    const { key } = ctx.params
    const result: FileData = await fileService.getFileName(key)

    if (result.data) {
      const fileStream = await fileService.loadCachedFile(result.data)
      return (ctx.body = fileStream)
    }
    return (ctx.body = result)
  }

  /**
   * @function create
   * @description upload file
   */
  public static async create (ctx: Context, next: Function) {
    const { key, force = 0 } = ctx.request.body.fields
    const file = ctx.request.body.fields.file || ctx.request.body.files.file
    const result = await cacheFile(key, file, !!+force)
    return (ctx.body = result)
  }

  /**
   * @function send
   * @description send file to remote
   */
  public static async send (ctx: Context, next: Function) {
    const { key, remote } = ctx.request.query
    // verify params
    if (!key || !remote) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'key or remote requried',
        },
      })
    }

    logger.debug(`Sending file: key: ${key}`)

    logger.debug('getting filename')
    const result: FileData = await fileService.getFileName(key)
    logger.debug(result.toString())

    if (result.data) {
      let file
      // read file
      try {
        fs.accessSync(
          path.join(__dirname, '../', process.env.UPLOAD_DIR, result.data),
          fs.constants.R_OK,
        )
      } catch (err) {
        return (ctx.body = {
          error: { code: -1, message: FileErrors.NotFound },
        })
      }

      // form data
      const formData = new FormData()
      formData.append('key', `${key}-test`)
      // formData.append('file', file)
      formData.append(
        'file',
        fs.createReadStream(
          path.join(__dirname, '../', process.env.UPLOAD_DIR, result.data),
        ),
      )

      const sendResponse = await axios
        .post(remote, formData, {
          headers: formData.getHeaders(),
        })
        .then(res => res.data)
        .catch(err => err)

      return (ctx.body = sendResponse)
    }
    return (ctx.body = result)
  }
}

export default Files
