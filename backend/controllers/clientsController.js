const db = require('../db');

// Buscar todos os clientes
const getAllClients = (req, res) => {
  db.query('SELECT * FROM clients', (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json(results);
  });
};

// Criar um novo cliente
const createClient = (req, res) => {
  const { fullName, email, birthDate, profession, address, document } = req.body;

  if (!fullName || !email || !document) {
    return res.status(400).json({ error: 'Nome, email e documento são obrigatórios' });
  }

  const sql = `
    INSERT INTO clients (full_name, email, birth_date, profession, address, document)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [fullName, email, birthDate, profession, address, document];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao criar cliente:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.status(201).json({ message: 'Cliente criado com sucesso', clientId: result.insertId });
  });
};



const updateClient = (req, res) => {
  const { id } = req.params;
  const { fullName, email, birthDate, profession, address, document } = req.body;

  const sql = `
    UPDATE clients 
    SET full_name = ?, email = ?, birth_date = ?, profession = ?, address = ?, document = ?
    WHERE id = ?
  `;
  const values = [fullName, email, birthDate, profession, address, document, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar cliente:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json({ message: 'Cliente atualizado com sucesso' });
  });
};


// Deletar um cliente
const deleteClient = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM clients WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar cliente:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    res.json({ message: 'Cliente deletado com sucesso' });
  });
};






module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
};