import * as log4js from 'log4js'

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

log4js.configure({
  appenders: { out: { type: 'stdout', layout: { type: 'basic' } } },
  categories: {
    default: { appenders: ['out'], level },
    context: { appenders: ['out'], level },
    model: { appenders: ['out'], level },
    controller: { appenders: ['out'], level },
    utils: { appenders: ['out'], level },
  },
})

export default (category = 'default') => log4js.getLogger(category)
