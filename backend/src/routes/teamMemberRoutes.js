const express = require('express');
const teamMemberController = require('../controllers/teamMemberController');
const { validateAddTeamMember } = require('../validators');

const router = express.Router();

router.post('/:projectId/members', validateAddTeamMember, teamMemberController.addMember);
router.get('/:projectId/members', teamMemberController.getProjectMembers);
router.put('/:projectId/members/:userId', teamMemberController.updateRole);
router.delete('/:projectId/members/:userId', teamMemberController.removeMember);

module.exports = router;
