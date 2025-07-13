// routes/rooms.js
const express = require('express');
const router  = express.Router();
const {
  getRoomsWithStatus,
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomsController');

// IMPORTANTE: /status antes de /:id, para não conflitar
router.get(   '/status', getRoomsWithStatus);
router.get(   '/',       getAllRooms);
router.get(   '/:id',    getRoomById);
router.post(  '/',       createRoom);
router.put(   '/:id',    updateRoom);
router.delete('/:id',    deleteRoom);

module.exports = router;