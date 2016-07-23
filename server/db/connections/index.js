import mongoConnection from './mongo'

export function mongo() {
  return mongoConnection()
}
