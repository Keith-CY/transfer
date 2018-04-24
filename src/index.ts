import * as path from 'path'
import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import * as log4js from 'log4js'
import router from './routes'

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
  koaBody({
    formidable: {
      uploadDir: path.join(__dirname, './public/files'),
      keepExtensions: true,
    },
  }),
)

// enable router
app.use(router.routes()).use(router.allowedMethods())

// start app
app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT}`)
})
