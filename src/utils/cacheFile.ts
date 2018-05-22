import * as path from 'path'
import * as fs from 'fs'
import fileService from '../contexts/file'
import { FileErrors, FileAction } from './../enums'
import log from '../utils/log'

const logger = log('utils')
declare class process {
  static env: {
    UPLOAD_DIR: string
  }
}

/**
 * @function CachedFile
 * @description
 * @param {string} key - unique index
 * @param {stream | string} content - user info
 * @param {boolean} force - overwritten or not
 */
export default async (key: string, file: any, force: boolean) => {
  let action = FileAction.CREATE
  // verify params, key and file are required
  if (!key || !file) {
    return {
      error: {
        code: -1,
        message: 'Key or Content Missed',
      },
    }
  }

  logger.debug(`cache file with: key: ${key}, force: ${force}`)

  // query file name from db
  const cached = await fileService.getFileName(key)

  if ((cached as { data: string }).data) {
    if (!force) {
      // overwritten is not allowed
      return {
        error: {
          code: -1,
          message: FileErrors.Exist,
        },
      }
    }
    action = FileAction.UPDATE
  }

  // use key as filename
  const filename = key

  if (file.path) {
    const reader = fs.createReadStream(file.path)
    const writer = fs.createWriteStream(
      path.join(__dirname, '../', process.env.UPLOAD_DIR, filename),
    )
    reader.pipe(writer)
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../', process.env.UPLOAD_DIR, filename),
      file,
    )
  }

  const res =
    action === FileAction.CREATE
      ? await fileService.cacheFile(key, filename)
      : await fileService.updateFile(key, filename)
  if (!(res as { data: boolean }).data) {
    return res
  }
  return {
    data: true,
    message: `File ${key} ${
      action === FileAction.UPDATE ? 'Updated' : 'Uploaded'
    } successlly`,
  }
}
