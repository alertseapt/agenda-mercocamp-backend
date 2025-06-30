require('dotenv').config();
const express = require('express');
const cors = require('cors');
const agendamentosRoutes = require('./routes/agendamentosRoutes');
const clientesRoutes = require('./routes/clientesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração mais específica do CORS se necessário
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*"
}));

app.use(express.json());

app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/clientes', clientesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 