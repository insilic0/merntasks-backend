const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
//Crear el servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({extended: true}));

//Crear puerto App
const PORT = process.env.PORT || 4000;

//Importar Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Correr servidor
app.listen(PORT, ()=>{
    console.log(`El servidor está corriendo en el puerto ${PORT}`);  
});
