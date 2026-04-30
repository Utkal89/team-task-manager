const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

class Task {
  static async create({ projectId, title, description, status, priority, assignedTo, assignedBy, dueDate }) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, assigned_by, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, projectId, title, description, status, priority, assignedTo, assignedBy, dueDate]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByProjectId(projectId, filters = {}, limit = 50, offset = 0) {
    let query = 'SELECT * FROM tasks WHERE project_id = $1';
    const params = [projectId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters.assignedTo) {
      query += ` AND assigned_to = $${paramIndex}`;
      params.push(filters.assignedTo);
      paramIndex++;
    }

    if (filters.overdue) {
      query += ` AND due_date < CURRENT_DATE AND status != 'DONE'`;
    }

    query += ` ORDER BY due_date ASC, priority DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findByAssignedTo(userId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE assigned_to = $1 
       ORDER BY due_date ASC, priority DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['title', 'description', 'status', 'priority', 'assigned_to', 'due_date'];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      [...values]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }
}

module.exports = Task;
