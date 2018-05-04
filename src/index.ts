import * as fs from 'fs'
import * as path from 'path'
import * as Koa from 'koa'
import * as WebSocket from 'ws'
import * as bodyParser from 'koa-body'
import * as log4js from 'log4js'
import router from './routes'
import cacheFile from './utils/cacheFile'

const logger = log4js.getLogger()
logger.level = 'info'

// load config
require('dotenv').config({
  path: path.join(__dirname, '../config/.env'),
})

// set port
const { PORT = 3000 } = process.env

// init app
const app = new Koa()

// enable body parser
app.use(
  bodyParser({
    multipart: true,
    urlencoded: true,
    json: true,
    formidable: {
      keepExtensions: true,
    },
  }),
)

// enable router
app.use(router.routes()).use(router.allowedMethods())

// start app
const server = app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT}`)
})

const wss = new WebSocket.Server({
  server,
})

wss.on('message', msg => {
  console.log(`[Provider]: ${msg}`)
})

wss.on('connection', ws => {
  ws.on('message', async (data: Buffer, flags: { binary?: boolean }) => {
    const result = await cacheFile(`${Math.round(Math.random() * 100)}`, data)
    ws.send(`[Receiver]${JSON.stringify(result)}`)
  })
})
