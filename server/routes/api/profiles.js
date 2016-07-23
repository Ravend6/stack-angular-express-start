import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import express from 'express'
import Profile from '../../models/profile'
import multer from 'multer'
import config from '../../config'

const router = express.Router()

const avatarUploadPath = config.avatarUploadPath
const avatarMaxFileSize = 2 * 1024 * 1024

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, avatarUploadPath)
    },
    filename: function (req, file, cb) {
      let token = crypto.randomBytes(8).toString('hex')
      let ext = path.extname(file.originalname)

      cb(null, token + Date.now() + ext)
    },
  }),
  limits: { fileSize: avatarMaxFileSize },
  fileFilter: function (req, file, cb) {
    let filetypes = /jpeg|jpg|png/
    let mime = 'jpeg, jpg, png'
    let ext = path.extname(file.originalname).slice(1)

    if (filetypes.test(ext)) {
      return cb(null, true)
    }
    let error = new Error(
      req.__(
        'multer mimes %s %s',
        req.__('avatar'),
        'jpeg, jpg, png'
      )
    )
    error.name = 'MulterValidationError'
    error.path = 'avatar'
    error.mime = mime

    cb(error)
  }
}).single('avatar')

router.get('/', async (req, res, next) => {
  try {
    let profiles = await Profile.find().exec()
    res.json(profiles)
  } catch (error) {
    next(error)
  }
})

router.post('/', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.maxfilesize = avatarMaxFileSize
        return next(err)
      }
      return next(err)
    }
    let profile = new Profile({ avatar: req.file.filename })
    profile.save().then(function (doc) {
      res.json(doc)
    }, function (err) {
      return next(err)
    })
  })
})

router.delete('/:profileId', async (req, res, next) => {
  try {
    let err = new Error('Profile Not Found')
    err.status = 404
    if (!req.params.profileId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(err)
    }
    let profile = await Profile.findById(req.params.profileId).exec()
    if (profile === null) {
      return next(err)
    }
    await fs.unlink(avatarUploadPath + '/' + profile.avatar)
    profile.remove()
    res.status(200).json({status: 200, message: 'Profile success deleted.'})
  } catch (err) {
    next(err)
  }
})

export default router
