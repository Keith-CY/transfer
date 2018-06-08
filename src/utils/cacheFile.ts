import * as path from 'path'
import * as fs from 'fs'
import fileService from '../contexts/file'
import { FileErrors, FileAction, ForceFlag } from './../enums'
import { FileData } from '../controllers/files'
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
 * @param {enum} force - overwritten or not
 */
export default async (key: string, file: any, force: ForceFlag) => {
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
  const cached = (await fileService.getFile(key)) as FileData

  if (cached.data) {
    if (cached.data.forceFlag === ForceFlag.NO) {
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
      ? await fileService.cacheFile(key, filename, force)
      : await fileService.updateFile(key, filename, force)
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
