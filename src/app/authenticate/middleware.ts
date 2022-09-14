const authenticationMiddleware = (whiteList = []) => (req: any, res: any, next: any) => {
  if (whiteList.some((item) => item == req.url) || req.isAuthenticated()) {
    return next();
  }

  if (req.url == '/login') {
    return next();
  }

  res.redirect('/login');
}

export default authenticationMiddleware;
