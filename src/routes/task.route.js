import { Router } from 'express'
import { verifyJWT } from '../middelwares/auth.middelware.js'
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from '../controllers/task.controller.js'

const router = Router()

router.use(verifyJWT)

router
  .route('/')
  .get(getAllTasks)
  .post(createTask)
  .delete(deleteTask)
  .put(updateTask)

export default router
