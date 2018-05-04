import * as fs from 'fs'
import * as path from 'path'
import fileService from '../contexts/file'

export default async (hash: string, file: any) => {
  if (!hash || !file) {
    return {
      error: {
        code: -1,
        message: 'Hash or File Requried',
      },
    }
  }

  const cached = await fileService.getFileUrl(hash)
  if ((cached as { data: string }).data) {
    return {
      error: {
        code: -1,
        message: 'File Exist',
      },
    }
  }
  let url = ''

  if (file.path) {
    // get file path
    const pathSegs = file.path.split('/')
    url = pathSegs[pathSegs.length - 1]

    // write file to public/files
    const reader = fs.createReadStream(file.path)
    const writer = fs.createWriteStream(
      path.join(__dirname, '../public/files/', url),
    )
    reader.pipe(writer)
  } else {
    console.log('buffer')
    url = `${Math.round(Math.random() * 1000)}`
    fs.writeFileSync(path.join(__dirname, '../public/files/', url), file)
  }

  const res = await fileService.cacheFile(hash, url)
  if (!(res as { data: boolean }).data) {
    return res
  }
  return {
    data: true,
    message: `File ${hash} Upload successlly`,
  }
}
