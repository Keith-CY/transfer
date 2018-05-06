import * as log4js from 'log4js'

const logger = log4js.getLogger()
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'
export default logger
