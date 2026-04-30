const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

class TeamMember {
  static async addMember({ projectId, userId, role = 'MEMBER' }) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO team_members (id, project_id, user_id, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, projectId, userId, role]
    );
    return result.rows[0];
  }

  static async findByProjectId(projectId) {
    const result = await pool.query(
      `SELECT tm.*, u.email, u.first_name, u.last_name, u.avatar_url
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.project_id = $1
       ORDER BY tm.joined_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  static async findMemberRole(projectId, userId) {
    const result = await pool.query(
      'SELECT role FROM team_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    return result.rows[0];
  }

  static async isMember(projectId, userId) {
    const result = await pool.query(
      'SELECT id FROM team_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    return result.rows.length > 0;
  }

  static async isAdmin(projectId, userId) {
    const result = await pool.query(
      'SELECT role FROM team_members WHERE project_id = $1 AND user_id = $2 AND role = $3',
      [projectId, userId, 'ADMIN']
    );
    return result.rows.length > 0;
  }

  static async updateRole(projectId, userId, newRole) {
    const result = await pool.query(
      `UPDATE team_members 
       SET role = $3
       WHERE project_id = $1 AND user_id = $2
       RETURNING *`,
      [projectId, userId, newRole]
    );
    return result.rows[0];
  }

  static async removeMember(projectId, userId) {
    await pool.query(
      'DELETE FROM team_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
  }
}

module.exports = TeamMember;
