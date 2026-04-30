const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create({ email, passwordHash, firstName, lastName }) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, is_active, created_at`,
      [id, email, passwordHash, firstName, lastName]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, avatar_url, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async update(id, { firstName, lastName, avatarUrl }) {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, first_name, last_name, avatar_url, is_active, updated_at`,
      [id, firstName, lastName, avatarUrl]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = User;
