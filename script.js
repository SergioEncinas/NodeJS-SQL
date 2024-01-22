const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Creamos la instancia Express
const app = express();
const upload = multer();

// Configuración para leer JSON y datos de formularios
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload.array());

// Conexión con la base de datos
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejssql',
  multipleStatements: true
});

// Manejo de errores en la conexión a la base de datos
mysqlConnection.connect((err) => {
  if (!err)
    console.log('Conexion bbdd correcta...');
  else
    console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

// Configuración del puerto
const port = process.env.PORT || 8181;

// Conectar y configurar el puerto del servidor
app.listen(port, () => console.log(`Listening on port ${port}..`));

// Rutas para las páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/ejemplo.html'));
});

app.get('/insertar', (req, res) => {
  res.sendFile(path.join(__dirname + '/insertar.html'));
});

// Ruta para agregar contraseñas a la base de datos
app.post('/anadirpassword', (req, res) => {
  const la_password = req.body.password;
  const photo = req.body.photo; // Asegúrate de manejar las imágenes adecuadamente

  const sql = `INSERT INTO passwords (password, imagen) VALUES ('${la_password}', '${photo}')`;

  mysqlConnection.query(sql, (err) => {
    if (!err) {
      console.log("INSERTADA LA NUEVA CONTRASEÑA");
    } else {
      console.log("ERROR AL INSERTAR CONTRASEÑA");
    }
  });
  res.redirect('/');
});

// Ruta para obtener todas las contraseñas desde la base de datos
app.get('/passwords', (req, res) => {
  mysqlConnection.query('SELECT * FROM passwords', (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      console.log("pos no funciona");
    }
  });
});
