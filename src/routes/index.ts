import * as Router from 'koa-router'
import fileController from '../controllers/files'
import orgController from '../controllers/orgs'

// File Router
const fileRouter = new Router({
  prefix: '/files',
})

fileRouter.get('/send', fileController.send)
fileRouter.post('/create', fileController.create)
fileRouter.get('/show/:key', fileController.show)

// Org Router
const orgRouter = new Router({
  prefix: '/orgs',
})

orgRouter.get('/index', orgController.index)
orgRouter.post('/create', orgController.create)
orgRouter.post('/update', orgController.update)
orgRouter.post('/delete', orgController.delete)
orgRouter.get('/:orgId', orgController.show)

const router = new Router()
router.use(fileRouter.routes()).use(fileRouter.allowedMethods())
router.use(orgRouter.routes()).use(orgRouter.allowedMethods())

export default router
