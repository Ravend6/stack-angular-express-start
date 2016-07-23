import mongoose from 'mongoose'
const debug = require('debug')('app:server')

function connect() {
  mongoose.connect(process.env.MONGO_URI)
  let db = mongoose.connection
  db.on('error', console.error.bind(console, 'Connection error:'))

  db.once('open', function (callback) {
    debug('Success connect for MongoDB.')
  })

  return db
}

export default function () {
  return connect()
}
