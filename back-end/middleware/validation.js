import { body, param, validationResult } from 'express-validator';

export const validateUserCreation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  
  body('displayName')
    .trim()
    .optional()
    .isLength({ max: 50 })
    .withMessage('Display name must be max 50 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validatePostCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  
  body('text')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Post text must be at least 10 characters'),
  
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateCommentCreation = [
  body('comment')
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Comment must be 1-250 characters'),
  
  body('postId')
    .isInt()
    .withMessage('Post ID must be a valid integer'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];