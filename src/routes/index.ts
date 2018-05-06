import * as Router from 'koa-router'
import controller from '../controllers/files'

const router = new Router({
  prefix: '/files',
})

router.get('/send', controller.send)
router.post('/create', controller.create)
router.get('/show/:key', controller.show)

export default router
