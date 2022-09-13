import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ error: { message: errors.array()[0].msg } });
  } else next();
};

const login = [
  body('username', 'The username invalid value')
    .isString()
    .isAlpha(),
  body('password', 'The password must be 5+ chars long and contain a number')
    .isString()
    .isLength({ min: 5 }),
  checkErrors
];

export { login };
