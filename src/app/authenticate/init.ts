import bcrypt from 'bcrypt';
import passport from 'passport';
import { collections } from '../../';
import { Strategy } from 'passport-local';
import { User } from 'src/database';

async function findUser (username: any, callback: any) {
  const userExits = (await collections?.user?.findOne({
    username: username
  })) as User | undefined;

  if (userExits) {
    return callback(null, userExits)
  }

  return callback(null)
}

passport.serializeUser(function (user: any, done) {
  done(null, user?.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

function initPassport () {
  passport.use(new Strategy({
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      findUser(username, (err: any, user: any) => {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, { message: 'User not found' })
        }

        bcrypt.compare(password, user.password, (err, isValid) => {
          if (err) {
            return done(err)
          }

          if (!isValid) {
            return done(null, false, { message: 'Incorrect password' })
          }

          return done(null, user)
        })
      })
    }
  ))
}

export default initPassport;
