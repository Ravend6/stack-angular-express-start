import express from 'express'
import Todo from '../../models/todo'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    let todos = await Todo.find().exec()
    res.json(todos)
  } catch (error) {
    next(error)
  }
})

router.get('/create', (req, res, next) => {
  let todo = new Todo({ title: 'dtjj', isDOne: false, count: 6, phone: '555-23-25', email: 'r2@gmail.com' })
  todo.save().then(function (doc) {
    res.json(doc)
  }, function (err) {
    return next(err)
  })
  // todo.save(function (err) {
  //   if (err) {
  //     return next(err)
  //     // return res.json(err)
  //   }
  //   res.json(todo)
  // })
})

export default router
