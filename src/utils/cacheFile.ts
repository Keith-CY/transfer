import * as fs from 'fs'
import * as path from 'path'
import fileService from '../contexts/file'

export default async (hash: string, filename: string, file: any) => {
  if (!hash || !file || !filename) {
    return {
      error: {
        code: -1,
        message: 'Hash or Filename or File Missed',
      },
    }
  }

  const cached = await fileService.getFileName(hash)
  if ((cached as { data: string }).data) {
    return {
      error: {
        code: -1,
        message: 'File Exist',
      },
    }
  }

  const uniqueFilename = `${Date.now()}-${filename}`

  if (file.path) {
    const reader = fs.createReadStream(file.path)
    const writer = fs.createWriteStream(
      path.join(__dirname, '../public/files/', uniqueFilename),
    )
    reader.pipe(writer)
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../public/files/', uniqueFilename),
      file,
    )
  }
  // let url = ''

  // console.log('caching')
  // console.log(hash)
  // console.log(file)
  // if (file.path) {
  //   // get file path
  //   const pathSegs = file.path.split('/')
  //   url = pathSegs[pathSegs.length - 1]

  //   // write file to public/files
  //   const reader = fs.createReadStream(file.path)
  //   const writer = fs.createWriteStream(
  //     path.join(__dirname, '../public/files/', url),
  //   )
  //   reader.pipe(writer)
  // } else {
  //   console.log('buffer?')
  //   console.log(file)
  //   url = `${Math.round(Math.random() * 1000)}`
  //   fs.writeFileSync(path.join(__dirname, '../public/files/', url), file)
  // }

  const res = await fileService.cacheFile(hash, uniqueFilename)
  if (!(res as { data: boolean }).data) {
    return res
  }
  return {
    data: true,
    message: `File ${hash} Upload successlly`,
  }
}
