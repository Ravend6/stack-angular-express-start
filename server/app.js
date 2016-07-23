import path from 'path'
import http from 'http'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import i18n from 'i18n'
// import favicon from 'serve-favicon'
// import compression from 'compression'
import { mongo } from './db/connections'
import routes from './routes'

mongo()

const app = express()
const debug = require('debug')('app:server')
const port = process.env.APP_PORT

i18n.configure({
  locales: ['en', 'ru'],
  directory: path.join(__dirname, '/locales')
})

i18n.setLocale(process.env.APP_LANGUAGE)

app.set('port', port)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '../client/src')))
} else {
  app.use(express.static(path.join(__dirname, '../client/build')))
}

app.use(i18n.init)

app.use(require('./middleware/locals'))

routes(app)

// Error 404
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(require('./middleware/multer-errors'))
app.use(require('./middleware/mongoose-errors'))
app.use(require('./middleware/errors'))

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

debug('NODE_ENV is ' + process.env.NODE_ENV)

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = this.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
