const Project = require('../models/Project');
const TeamMember = require('../models/TeamMember');

const projectController = {
  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const userId = req.user.id;

      // Create project
      const project = await Project.create({
        name,
        description,
        ownerId: userId,
      });

      // Add owner as admin team member
      await TeamMember.addMember({
        projectId: project.id,
        userId,
        role: 'ADMIN',
      });

      res.status(201).json({
        message: 'Project created successfully',
        project,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const projects = await Project.findByUserId(userId, limit, offset);

      res.json({ projects });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user is member
      const isMember = await TeamMember.isMember(projectId, userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const stats = await Project.getStats(projectId);

      res.json({ project, stats });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user is admin
      const isAdmin = await TeamMember.isAdmin(projectId, userId);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can update projects' });
      }

      const project = await Project.update(projectId, req.body);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({
        message: 'Project updated successfully',
        project,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user is owner
      const project = await Project.findById(projectId);
      if (project.owner_id !== userId) {
        return res.status(403).json({ error: 'Only owner can delete project' });
      }

      await Project.delete(projectId);

      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = projectController;
