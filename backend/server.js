// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const roomsRoutes = require('./routes/rooms');
const clientsRoutes = require('./routes/clients');
const reservationsRoutes = require('./routes/reservations'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Log de todas as requisições que não casarem em rota
app.use((req, res, next) => {
  console.log(`Request recebida: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/clients', clientsRoutes);
app.use('/api/rooms',   roomsRoutes);
app.use('/api/reservations', reservationsRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});