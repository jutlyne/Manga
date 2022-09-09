import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import authenticationMiddleware from './middleware';

const saltRounds = 10
const myPlaintextPassword = 'password'
const salt = bcrypt.genSaltSync(saltRounds)
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

const user = {
  username: 'username',
  passwordHash,
  id: 1
}

function findUser (username: any, callback: any) {
  if (username === user.username) {
    return callback(null, user)
  }
  return callback(null)
}

passport.serializeUser(function (user: any, cb) {
  cb(null, user?.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

function initPassport () {
  passport.use(new Strategy(
    (username, password, done) => {
      findUser(username, (err: any, user: any) => {
        if (err) {
          return done(err)
        }

        if (!user) {
          console.log('User not found')
          return done(null, false)
        }

        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
    }
  ))

  passport.authenticate = authenticationMiddleware
}

export default initPassport;
