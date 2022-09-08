export default function authenticationMiddleware () {
  return function (req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
}
