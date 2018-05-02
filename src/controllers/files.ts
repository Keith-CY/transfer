import * as fs from 'fs'
import { Context } from 'koa'
import fileService from '../contexts/file'
import authService from '../contexts/auth'

interface FileError {
  error: { code: number; message: string }
}

const readRemoteFile = async (
  hash: string,
  signature: string,
  ctx: Context,
) => {
  const data = await fileService
    .readRemoteFile(hash, signature)
    .then(res => res.data)
  return (ctx.body = data)
}
class Files {
  /**
   * @function index
   * @description show file list
   * @param {Context} ctx
   * @param {Function} next
   * @returns
   * @memberof Files
   */
  public static async index (ctx: Context, next: Function) {
    const files = await ['file1', 'file2']
    return files
  }

  /**
   * @function show
   * @description request single file
   * @param {Context} ctx
   * @param {Function} next
   * @memberof Files
   */
  public static async show (ctx: Context, next: Function) {
    const { signature } = ctx.request.query
    const { hash } = ctx.params
    // check required params {signature, hash}
    if (!hash || !signature) {
      return (ctx.body = {
        error: {
          code: -1,
          message: 'Hash or Signature Missed',
        },
      })
    }
    // extract pubkey
    const pubkey = signature

    const permitted = (await authService.isLocalReq(pubkey))
      ? true
      : await authService.isPermitted(pubkey)

    if (!permitted) {
      // not permitted
      return (ctx.body = {
        error: {
          code: -1,
          message: 'No Permission',
        },
      })
    }
    // permitted
    const isCached = fileService.isCached(hash)

    if (isCached) {
      // cached
      const fileStream = fileService.readCachedFile(hash)
      const { error } = fileStream as FileError
      if (error) {
        return readRemoteFile(hash, signature, ctx)
      }
      return (ctx.body = fileStream)
    }
    // not cached
    return readRemoteFile(hash, signature, ctx)

    // return ctx.body = fileService.readRemoteFile(hash, signature).then(.pipe(ctx.body)
  }
}

export default Files
