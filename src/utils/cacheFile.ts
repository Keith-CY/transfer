import * as fs from 'fs'
import * as path from 'path'
import fileService from '../contexts/file'
import { FileErrors, FileAction } from './../enums'
import logger from '../utils/logger'

declare class process {
  static env: {
    UPLOAD_DIR: string
  }
}

export default async (key: string, file: any, force: boolean) => {
  let action = FileAction.CREATE
  if (!key || !file) {
    return {
      error: {
        code: -1,
        message: 'Key or Content Missed',
      },
    }
  }

  logger.debug(`cache file with: key: ${key}, force: ${force}`)

  const cached = await fileService.getFileName(key)

  if ((cached as { data: string }).data) {
    if (!force) {
      return {
        error: {
          code: -1,
          message: FileErrors.Exist,
        },
      }
    }
    action = FileAction.UPDATE
  }

  // const filename = `${Date.now()}`
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