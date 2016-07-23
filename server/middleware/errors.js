import chalk from 'chalk'

if (process.env.NODE_ENV === 'development') {
  module.exports = (err, req, res, next) => {
    console.log(chalk.magenta(`${err.stack}`))
    res.status(err.status || 500)
    if (err.message === 'Cannot enqueue Query after fatal error.') {
      return res.send('I can not connect to database mysql.')
    }
    // res.json({ error: err.message, status: err.status, stack: err.stack })
    res.json({ error: err.message, status: err.status })
  }
} else {
  module.exports = (err, req, res, next) => {
    res.status(err.status || 500)
    if (err.message === 'Cannot enqueue Query after fatal error.') {
      return res.send('Сайт временно не работает.')
    }
    res.json({ error: err.message, status: err.status })
  }
}
