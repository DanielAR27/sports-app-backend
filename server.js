const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes'); // Importar las rutas de partidos

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación de Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging detallado para cada solicitud
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Conexión a MongoDB con mejor manejo de errores y opciones avanzadas
const connectDB = async () => {
  try {
    // Opciones avanzadas para mejorar la confiabilidad
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout después de 10 segundos
      socketTimeoutMS: 45000, // Cierra sockets después de 45 segundos de inactividad
      family: 4 // Usa IPv4, omite IPv6
    };

    console.log('Intentando conectar a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    // No detengas el proceso, deja que el servidor siga ejecutándose
    // Las rutas manejarán los errores de la base de datos de forma adecuada
  }
};

// Conectar a MongoDB
connectDB();

// Ruta básica para pruebas
app.get('/', (req, res) => {
  res.send('Sports App API está funcionando');
});

// Agregar un endpoint de verificación de estado
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? 'Ocurrió un error' : err.message
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});