module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    let errors = translateValidation(err, req)
    return res.status(400).json(errors)
  }
  next(err)
}

function translateValidation(e, req) {
  const translateErrors = {
    status: 400,
    error: e.name,
    message: e.message,
    errors: {},
  }

  for (let field in e.errors) {
    // console.log(e.errors[field].message)
    // console.log(e.errors[field].name)
    // console.log(e.errors[field].properties)
    switch (e.errors[field].properties.type) {
      case 'required':
        translateErrors.errors[field] = {
          message: req.__('mongoose required %s', req.__(field)),
          kind: e.errors[field].kind,
          path: e.errors[field].path,
        }
        break
      case 'minlength':
        translateErrors.errors[field] = {
          message: req.__(
            'mongoose minlength %s %s',
            req.__(field),
            e.errors[field].properties.minlength
          ),
          kind: e.errors[field].kind,
          path: e.errors[field].path,
          minlength: e.errors[field].properties.minlength,
          value: e.errors[field].properties.value,
        }
        break
      case 'maxlength':
        translateErrors.errors[field] = {
          message: req.__(
            'mongoose maxlength %s %s',
            req.__(field),
            e.errors[field].properties.maxlength
          ),
          kind: e.errors[field].kind,
          path: e.errors[field].path,
          maxlength: e.errors[field].properties.maxlength,
          value: e.errors[field].properties.value,
        }
        break
      case 'min':
        translateErrors.errors[field] = {
          message: req.__(
            'mongoose min %s %s',
            req.__(field),
            e.errors[field].properties.min
          ),
          kind: e.errors[field].kind,
          path: e.errors[field].path,
          min: e.errors[field].properties.min,
          value: e.errors[field].properties.value,
        }
        break
      case 'max':
        translateErrors.errors[field] = {
          message: req.__(
            'mongoose max %s %s',
            req.__(field),
            e.errors[field].properties.max
          ),
          kind: e.errors[field].kind,
          path: e.errors[field].path,
          max: e.errors[field].properties.max,
          value: e.errors[field].properties.value,
        }
        break
      case 'enum':
        translateErrors.errors[field] = {
          message: req.__(
            'mongoose enum %s %s',
            e.errors[field].properties.value,
            req.__(field),
          ),
          kind: e.errors[field].kind,
          path: e.errors[field].path,
          enumValues: e.errors[field].properties.enumValues,
          value: e.errors[field].properties.value,
        }
        break

      default:
        switch (e.errors[field].properties.message) {
          case '{VALUE} is not a valid {PATH} number.':
            translateErrors.errors[field] = {
              message: req.__(
                'mongoose phone %s %s',
                e.errors[field].properties.value,
                req.__(field),
              ),
              kind: e.errors[field].kind,
              path: e.errors[field].path,
              value: e.errors[field].properties.value,
            }
            break
          case '{PATH} must be a valid email address.':
            translateErrors.errors[field] = {
              message: req.__(
                'mongoose email %s',
                req.__(field),
              ),
              kind: e.errors[field].kind,
              path: e.errors[field].path,
              value: e.errors[field].properties.value,
            }
            break
          case 'The {PATH} has already been taken.':
            translateErrors.errors[field] = {
              message: req.__(
                'mongoose unique %s',
                req.__(field),
              ),
              kind: e.errors[field].kind,
              path: e.errors[field].path,
              value: e.errors[field].properties.value,
            }
            break
          default:
            break
        }
    }
  }

  return translateErrors
}
