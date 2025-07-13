const express = require('express');
const router = express.Router();
const {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientsController');

// GET todos os clientes
router.get('/', getAllClients);

// POST novo cliente
router.post('/', createClient);

// PUT atualizar cliente
router.put('/:id', updateClient);

// DELETE deletar cliente
router.delete('/:id', deleteClient);

module.exports = router;