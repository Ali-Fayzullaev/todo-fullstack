import express from 'express'
import auth from '../middleware/auth.js'
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todoController.js'

const router = express.Router()

router.use(auth) // все роуты защищены

router.post('/', createTodo)
router.get('/', getTodos)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router
