import path from 'path'

const config = {}

if (process.env.NODE_ENV === 'development') {
  config.avatarUploadPath = path.resolve(__dirname, '../client/src/uploads/avatars')
} else {
  config.avatarUploadPath = path.resolve(__dirname, '../client/build/uploads/avatars')
}

export default config
