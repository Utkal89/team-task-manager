const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

class Project {
  static async create({ name, description, ownerId }) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO projects (id, name, description, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, owner_id, is_active, created_at`,
      [id, name, description, ownerId]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT p.* FROM projects p
       LEFT JOIN team_members tm ON p.id = tm.project_id
       WHERE p.owner_id = $1 OR tm.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async update(id, { name, description }) {
    const result = await pool.query(
      `UPDATE projects 
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, name, description]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  }

  static async getStats(projectId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'TODO' THEN 1 ELSE 0 END) as todo_tasks,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'IN_REVIEW' THEN 1 ELSE 0 END) as in_review_tasks,
        SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END) as done_tasks,
        SUM(CASE WHEN due_date < CURRENT_DATE AND status != 'DONE' THEN 1 ELSE 0 END) as overdue_tasks
       FROM tasks WHERE project_id = $1`,
      [projectId]
    );
    return result.rows[0];
  }
}

module.exports = Project;
