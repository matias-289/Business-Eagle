const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND contraseña = $2',
      [correo, contraseña]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Acceso concedido' });
    } else {
      res.json({ success: false, message: 'Correo o contraseña inválidos' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
