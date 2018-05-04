import * as fs from 'fs'
import * as path from 'path'
import * as WebSocket from 'ws'
import { Context } from 'koa'
import fileService from '../contexts/file'
import authService from '../contexts/auth'
import cacheFile from '../utils/cacheFile'

interface FileError {
  error: { code: number; message: string }
}

class Files {
  /**
   * @function show
   * @description load local file
   */
  public static async show (ctx: Context, next: Function) {
    const { hash } = ctx.params
    const result: {
    data?: string
    error?: FileError
    } = await fileService.getFileUrl(hash)

    if (result.error) {
      return (ctx.body = result.error)
    }

    if (result.data) {
      // cached
      const fileStream = await fileService.readCachedFile(result.data)
      const { error } = fileStream as FileError
      if (error) {
        return (ctx.body = error)
      }
      return (ctx.body = fileStream)
    }
    return (ctx.body = {
      error: {
        code: -1,
        message: 'File Loading Failed',
      },
    })
  }

  /**
   * @function create
   * @description upload file
   */
  public static async create (ctx: Context, next: Function) {
    const { hash } = ctx.request.body.fields
    const { file } = ctx.request.body.files
    const result = await cacheFile(hash, file)
    return (ctx.body = result)
  }

  /**
   * @function send
   * @description send file to remote
   */
  public static async send (ctx: Context, next: Function) {
    const { hash, remote } = ctx.request.query
    // verify params
    if (!hash || !remote) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'hash or remote requried',
        },
      })
    }

    // get file url
    const result: {
    data?: string
    error?: FileError
    } = await fileService.getFileUrl(hash)

    if (result.error) {
      return (ctx.body = result.error)
    }

    if (result.data) {
      const file = fs.readFileSync(
        path.join(__dirname, '../public/files/', result.data),
      )

      const ws = new WebSocket(remote.toString())
      ws.on('open', () => {
        ws.send(file, { binary: true }, err => {
          if (err) {
            console.error(err)
          }
        })
      })
      return (ctx.body = {
        data: 'File sent',
      })
    }
    return (ctx.body = {
      error: {
        code: -1,
        message: 'File load failed',
      },
    })
  }
}

const verifyParams = (requireds: string[], params: any) => {
  const errors = requireds
    .map(required => (params[required] === 'undefined' ? required : false))
    .filter(err => err)
  return errors
}

export default Files
