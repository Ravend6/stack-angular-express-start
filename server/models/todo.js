import mongoose from 'mongoose'

const Schema = mongoose.Schema

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6,
  },
  isDone: {
    type: Boolean,
  },
  count: {
    type: Number,
    min: 6,
    max: 12,
    required: true,
  },
  drink: {
    type: String,
    enum: ['coffee', 'tea']
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{2}-\d{2}/.test(v)
      },
      message: '{VALUE} is not a valid {PATH} number.'
    },
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(v)
      },
      message: '{PATH} must be a valid email address.'
    },
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  //   password: {
  //     type: String,
  //     // select: false
  //     // required: "Поле `{PATH}` должно быть заполнено.",
  //     // minlength: [6, "Минимальная длина пароля должна быть {MINLENGTH} символов."]
  //   }
  // },

})

const Todo = mongoose.model('Todo', todoSchema)

Todo.schema.path('email').validate(async function (value, next) {
  // Todo.findOne({ email: value }, function (e, todo) {
  //   if (todo) respond(false)
  // })

  let todo = await Todo.findOne({ email: value }).exec()

  if (todo) {
    next(false)
  } else {
    next()
  }
}, 'The {PATH} has already been taken.')

export default Todo
