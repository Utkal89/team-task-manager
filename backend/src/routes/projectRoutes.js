const express = require('express');
const projectController = require('../controllers/projectController');
const { validateCreateProject, validateUpdateProject } = require('../validators');

const router = express.Router();

router.post('/', validateCreateProject, projectController.create);
router.get('/', projectController.getAll);
router.get('/:projectId', projectController.getById);
router.put('/:projectId', validateUpdateProject, projectController.update);
router.delete('/:projectId', projectController.delete);

module.exports = router;
