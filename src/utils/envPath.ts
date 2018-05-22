import log from './log'

const logger = log('envPath')
export default (NODE_ENV: string | undefined) => {
  logger.info(`Server running on ${NODE_ENV} env`)
  return NODE_ENV === 'development'
    ? '.env'
    : NODE_ENV === 'test'
      ? '.env.test'
      : '.env.prod'
}
