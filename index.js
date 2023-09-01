require('dotenv').config(); // Carregar variáveis de ambiente do .env

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./app/routes/userRoutes');
const authRoutes = require('./app/routes/authRoutes');

const app = express();


const ipAddress = "192.168.0.88"
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
    app.listen(port, ipAddress, () => {
      console.log(`Server is listening on ${ipAddress}:${port}`);
    });
})
.catch((error) => {
  console.error('Error syncing database:', error);
});
