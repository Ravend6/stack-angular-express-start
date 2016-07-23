module.exports = (err, req, res, next) => {
  if (err.name === 'MulterValidationError') {
    let error = {
      error: err.name,
      message: err.message,
      path: err.path,
      mime: err.mime,
    }
    return res.status(400).json(error)
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    // console.log('err', JSON.stringify(err))
    let error = {
      error: 'MulterValidationError',
      message: req.__('multer maxfilesize %s %s', req.__(err.field), err.maxfilesize),
      path: err.field,
      maxfilesize: err.maxfilesize
    }
    return res.status(400).json(error)
  }
  next(err)
}
