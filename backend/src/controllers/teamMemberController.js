const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

const teamMemberController = {
  addMember: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const { userId, role } = req.body;
      const currentUserId = req.user.id;

      // Check if current user is admin
      const isAdmin = await TeamMember.isAdmin(projectId, currentUserId);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can add members' });
      }

      // Check if user to add exists
      const userToAdd = await User.findById(userId);
      if (!userToAdd) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Add member
      const member = await TeamMember.addMember({
        projectId,
        userId,
        role: role || 'MEMBER',
      });

      res.status(201).json({
        message: 'Member added successfully',
        member,
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'User is already a member' });
      }
      next(error);
    }
  },

  getProjectMembers: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user is member
      const isMember = await TeamMember.isMember(projectId, userId);
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const members = await TeamMember.findByProjectId(projectId);

      res.json({ members });
    } catch (error) {
      next(error);
    }
  },

  updateRole: async (req, res, next) => {
    try {
      const { projectId, userId } = req.params;
      const { role } = req.body;
      const currentUserId = req.user.id;

      // Check if current user is admin
      const isAdmin = await TeamMember.isAdmin(projectId, currentUserId);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can update roles' });
      }

      const member = await TeamMember.updateRole(projectId, userId, role);

      res.json({
        message: 'Role updated successfully',
        member,
      });
    } catch (error) {
      next(error);
    }
  },

  removeMember: async (req, res, next) => {
    try {
      const { projectId, userId } = req.params;
      const currentUserId = req.user.id;

      // Check if current user is admin
      const isAdmin = await TeamMember.isAdmin(projectId, currentUserId);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can remove members' });
      }

      await TeamMember.removeMember(projectId, userId);

      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = teamMemberController;
