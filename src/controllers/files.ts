import * as fs from 'fs'
import * as path from 'path'
import * as WebSocket from 'ws'
import * as FormData from 'form-data'
import axios from 'axios'
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
    } = await fileService.getFileName(hash)

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
    const { hash, filename } = ctx.request.body.fields
    const file = ctx.request.body.fields.file || ctx.request.body.files.file
    const result = await cacheFile(hash, filename, file)
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

    // get file name
    const result: {
    data?: string
    error?: FileError
    } = await fileService.getFileName(hash)

    if (result.error) {
      return (ctx.body = result.error)
    }

    if (result.data) {
      const file = fs.readFileSync(
        path.join(__dirname, '../public/files/', result.data),
      )

      const formData = new FormData()
      formData.append('hash', `${hash}test`)
      formData.append('filename', result.data)
      formData.append('file', file)

      axios
        .post('http://127.0.0.1:3000/files/create', formData, {
          headers: formData.getHeaders(),
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err.message))

      return (ctx.body = {
        data: 'File sent',
      })
    }
    return (ctx.body = {
      error: {
        code: -1,
        message: 'File Not Found',
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
