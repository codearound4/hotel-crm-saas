const db = require('../db');

// listar todas as reservas (com join para exibir nome do cliente e número do quarto)
exports.getAllReservations = (req, res) => {
  const sql = `
    SELECT
      r.id, r.client_id, c.full_name AS client_name,
      r.room_id, rooms.number AS room_number,
      r.check_in, r.check_out, r.status, r.created_at
    FROM reservations r
    LEFT JOIN clients c ON r.client_id = c.id
    LEFT JOIN rooms   ON r.room_id   = rooms.id
    ORDER BY r.created_at DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar reservas:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
};

// buscar reserva por ID
exports.getReservationById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM reservations WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar reserva:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Reserva não encontrada' });
    res.json(results[0]);
  });
};

// criar nova reserva
exports.createReservation = (req, res) => {
  const { client_id, room_id, check_in, check_out, status } = req.body;
  const sql = `
    INSERT INTO reservations
      (client_id, room_id, check_in, check_out, status)
    VALUES (?, ?, ?, ?, ?);
  `;
  db.query(sql, [client_id, room_id, check_in, check_out, status], (err, result) => {
    if (err) {
      console.error('Erro ao criar reserva:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.status(201).json({ reservationId: result.insertId });
  });
};

// atualizar reserva
exports.updateReservation = (req, res) => {
  console.log(`>> PUT /api/reservations/${req.params.id}`, 'body:', req.body);
  const { id } = req.params;
  const { client_id, room_id, check_in, check_out, status } = req.body;
  const sql = `
    UPDATE reservations SET
      client_id = ?, room_id = ?,
      check_in = ?, check_out = ?, status = ?
    WHERE id = ?;
  `;
  db.query(sql, [client_id, room_id, check_in, check_out, status, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar reserva:', err);
      return res.status(500).json({ error: 'Erro ao atualizar reserva' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva não encontrada' });
    res.json({ message: 'Reserva atualizada com sucesso' });
  });
};

// deletar reserva
exports.deleteReservation = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reservations WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar reserva:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva não encontrada' });
    res.json({ message: 'Reserva deletada com sucesso' });
  });
};
