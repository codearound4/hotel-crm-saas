// controllers/roomsController.js
const db = require('../db');

// 1) Status de ocupação
exports.getRoomsWithStatus = (req, res) => {
  const sql = `
    SELECT
      rooms.id, rooms.number, rooms.type,
      rooms.description, rooms.price_per_night, rooms.is_available,
      r.id   AS reservation_id,
      r.check_in, r.check_out, r.status,
      c.full_name AS client_name
    FROM rooms
    LEFT JOIN reservations r
      ON rooms.id = r.room_id
      AND r.status = 'confirmada'
      AND CURDATE() BETWEEN r.check_in AND r.check_out
    LEFT JOIN clients c ON r.client_id = c.id
    ORDER BY rooms.number;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar status dos quartos:', err);
      return res.status(500).json({ error: 'Erro ao buscar dados' });
    }
    res.json(results);
  });
};

// 2) GET ALL
exports.getAllRooms = (req, res) => {
  db.query('SELECT * FROM rooms', (err, results) => {
    if (err) {
      console.error('Erro ao buscar quartos:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
};

// 3) GET BY ID
exports.getRoomById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM rooms WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar quarto:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    res.json(results[0]);
  });
};

// 4) CREATE
exports.createRoom = (req, res) => {
  const { number, type, description, price_per_night, is_available } = req.body;
  const sql = `
    INSERT INTO rooms
      (number, type, description, price_per_night, is_available)
    VALUES (?, ?, ?, ?, ?);
  `;
  db.query(sql, [number, type, description, price_per_night, is_available], (err, result) => {
    if (err) {
      console.error('Erro ao criar quarto:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.status(201).json({ roomId: result.insertId });
  });
};

// 5) UPDATE
exports.updateRoom = (req, res) => {
  console.log(`>> PUT /api/rooms/${req.params.id}`, 'body:', req.body);
  const { id } = req.params;
  const { number, type, description, price_per_night, is_available } = req.body;
  const sql = `
    UPDATE rooms
    SET number = ?, type = ?, description = ?, price_per_night = ?, is_available = ?
    WHERE id = ?;
  `;
  db.query(sql, [number, type, description, price_per_night, is_available, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar quarto:', err);
      return res.status(500).json({ error: 'Erro ao atualizar quarto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    res.json({ message: 'Quarto atualizado com sucesso' });
  });
};

// 6) DELETE
exports.deleteRoom = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM rooms WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar quarto:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    res.json({ message: 'Quarto deletado com sucesso' });
  });
};