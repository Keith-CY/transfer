import * as Router from 'koa-router'
import controller from '../controllers/files'

const router = new Router({
  prefix: '/files',
})

router.get('/', controller.index)
router.get('/:hash', controller.show)

export default router
