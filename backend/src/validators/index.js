const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

// Auth validators
const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  validateRequest
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

// Project validators
const validateCreateProject = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').trim().optional(),
  validateRequest
];

const validateUpdateProject = [
  body('name').trim().optional(),
  body('description').trim().optional(),
  validateRequest
];

// Task validators
const validateCreateTask = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').trim().optional(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('assignedTo').optional().isUUID().withMessage('Invalid assigned user'),
  validateRequest
];

const validateUpdateTask = [
  body('title').trim().optional(),
  body('description').trim().optional(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).withMessage('Invalid status'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  body('assignedTo').optional().isUUID().withMessage('Invalid assigned user'),
  validateRequest
];

// Team member validators
const validateAddTeamMember = [
  body('userId').isUUID().withMessage('Invalid user ID'),
  body('role').optional().isIn(['ADMIN', 'MEMBER']).withMessage('Invalid role'),
  validateRequest
];

module.exports = {
  validateSignup,
  validateLogin,
  validateCreateProject,
  validateUpdateProject,
  validateCreateTask,
  validateUpdateTask,
  validateAddTeamMember,
};
