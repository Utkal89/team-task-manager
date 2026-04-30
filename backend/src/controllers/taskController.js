const Task = require('../models/Task');
const TeamMember = require('../models/TeamMember');
const Project = require('../models/Project');

const taskController = {
  create: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const { title, description, priority, dueDate, assignedTo } = req.body;
      const userId = req.user.id;

      // Check if user is member
      const isMember = await TeamMember.isMember(projectId, userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Create task
      const task = await Task.create({
        projectId,
        title,
        description,
        status: 'TODO',
        priority: priority || 'MEDIUM',
        assignedTo,
        assignedBy: userId,
        dueDate,
      });

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  },

  getByProject: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user is member
      const isMember = await TeamMember.isMember(projectId, userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        assignedTo: req.query.assignedTo,
        overdue: req.query.overdue === 'true',
      };

      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const tasks = await Task.findByProjectId(projectId, filters, limit, offset);

      res.json({ tasks });
    } catch (error) {
      next(error);
    }
  },

  getMyTasks: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const tasks = await Task.findByAssignedTo(userId, limit, offset);

      res.json({ tasks });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user is member of the project
      const isMember = await TeamMember.isMember(task.project_id, userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ task });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user is member
      const isMember = await TeamMember.isMember(task.project_id, userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedTask = await Task.update(taskId, req.body);

      res.json({
        message: 'Task updated successfully',
        task: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user is admin
      const isAdmin = await TeamMember.isAdmin(task.project_id, userId);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can delete tasks' });
      }

      await Task.delete(taskId);

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = taskController;
