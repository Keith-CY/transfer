import * as fs from 'fs'
import * as path from 'path'
import * as FormData from 'form-data'
import axios from 'axios'
import { Context } from 'koa'
import fileService from '../contexts/file'
import orgService from '../contexts/org'
import cacheFile from '../utils/cacheFile'
import { FileErrors, ForceFlag } from './../enums'
import { CachedFile } from './../contexts/model'
import log from '../utils/log'

const logger = log('files-controller')

declare class process {
  static env: {
    UPLOAD_DIR: string
  }
}
interface SError {
  code: number
  message: string
}

export interface FileData {
  data?: {
    filename: string
    forceFlag: ForceFlag
  }
  error?: SError
}
/**
 * @class Files
 * @description file controller, including show, create, send mehtods
 */
class Files {
  /**
   * @method show
   * @description load local file
   * @param {string} key - unique index
   * @returns {stream} fileStream
   */
  public static async show (ctx: Context, next: Function) {
    const { key } = ctx.params
    const result: FileData = await fileService.getFile(key)

    if (result.data) {
      const fileStream = await fileService.loadCachedFile(result.data.filename)
      return (ctx.body = fileStream)
    }
    return (ctx.body = result)
  }

  /**
   * @method create
   * @description cache file locally
   * @param {string} key - unique index
   * @param {string | stream} content - the file should be cached
   * @param {enum} forceFlag
   * @returns
   */
  public static async create (ctx: Context, next: Function) {
    if (ctx.request.body.fields) {
      const { key, forceFlag = ForceFlag.NO } = ctx.request.body.fields
      const file =
        ctx.request.body.fields.content || ctx.request.body.files.content
      const result = await cacheFile(key, file, forceFlag)
      return (ctx.body = result)
    }
    const { key, forceFlag = ForceFlag.NO } = ctx.request.body
    const file = ctx.request.body.content || ctx.request.body.files.content
    const result = await cacheFile(key, file, forceFlag)
    return (ctx.body = result)
  }

  /**
   * @function send
   * @description send file to remote
   */
  public static async send (ctx: Context, next: Function) {
    const { key, orgId } = ctx.request.query
    // verify params
    if (key === undefined || orgId === undefined) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'key or orgId requried',
        },
      })
    }

    const org: { data?: string; error?: any } = await orgService.getOrgAddr(
      orgId,
    )
    if (org.error) {
      return (ctx.body = {
        error: org.error,
      })
    }
    if (!org.data) {
      return (ctx.body = {
        error: {
          code: -1,
          message: `Org doesn't have remote address`,
        },
      })
    }
    logger.debug(`Sending file: key: ${key}`)

    logger.debug('getting filename')
    const result: FileData = await fileService.getFile(key)
    logger.debug(result.toString())

    if (result.data) {
      // let file
      // read file
      try {
        fs.accessSync(
          path.join(
            __dirname,
            '../',
            process.env.UPLOAD_DIR,
            result.data.filename,
          ),
          fs.constants.R_OK,
        )
      } catch (err) {
        return (ctx.body = {
          error: { code: -1, message: FileErrors.NotFound },
        })
      }

      // form data
      const formData = new FormData()
      formData.append('key', `${key}`)
      formData.append(
        'content',
        fs.createReadStream(
          path.join(
            __dirname,
            '../',
            process.env.UPLOAD_DIR,
            result.data.filename,
          ),
        ),
      )

      const sendResponse = await axios
        .post(org.data, formData, {
          headers: formData.getHeaders(),
        })
        .then(res => res.data)
        .catch(err => logger.error(err.message))

      return (ctx.body = sendResponse)
    }
    return (ctx.body = result)
  }
}

export default Files
