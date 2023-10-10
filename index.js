import express from 'express';  
import cors from  'cors'
import bodyParser from  'body-parser'
import sequelize from  './config/database.js'
import userRoutes from  './app/routes/userRoutes.js'
import authRoutes from  './app/routes/authRoutes.js'
import travelRoutes from  './app/routes/travelRoutes.js'
import bankingRoutes from  './app/routes/bankingRoutes.js'
import creditRoutes from  './app/routes/creditRoutes.js'
import investmentRoutes from  './app/routes/investmentRoutes.js'
const app = express();


const ipAddress = "192.168.0.88"
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/banking', bankingRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/investment', investmentRoutes);

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
