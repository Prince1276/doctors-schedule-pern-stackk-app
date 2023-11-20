const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

const db = new Client({
    connectionString: "postgresql://postgres:1234@localhost:5432/postgres",
    ssl: false, // Disable SSL for local testing
  });
  

// Connect to the database
db.connect()
  .then(() => {
    console.log('Connected to the database');
    // Read and execute schema queries from schema.sql
    const schemaQueries = fs.readFileSync('schema.sql', 'utf8');
    return db.query(schemaQueries);
  })
  .then(() => {
    console.log('Tables created or already exist.');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });

// ROUTES
app.get('/getting', (req, res) => {
  const sql = 'SELECT * FROM visits';
  db.query(sql, (err, data) => {
    if (!err) {
      let visitsDb = data.rows;
      res.status(200).json(visitsDb);
    } else {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.get('/doctors', (req, res) => {
    const sql2 = `SELECT * FROM doctors`;
    db.query(sql2, (err, data) => {
        if (!err) {
            let doctorsDb = data.rows;
            res.status(200).json(doctorsDb);
        } else {
            console.log(err.message);
        }
        db.end;
    });
});

// The routes used by Table components
app.post('/posting', (req, res, next) => {
    // Inserting into a database
     const sql = 'INSERT INTO visits (name, surname, phone_number, SSN, day, time) VALUES ($1, $2, $3, $4, $5, $6)';
    db.query(sql, [
        req.body[0],
        req.body[1],
        req.body[2],
        req.body[3],
        req.body[4],
        req.body[5]
    ], function(err) {
        if (err) {
            console.log("Error while inserting into a database: ", err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(201);
        }
    });
});

app.post('/doctors', (req, res, next) => {
     const sql = 'INSERT INTO doctors (surname, name, specialization) VALUES ($1, $2, $3)';
    db.query(sql, [
        req.body[0],
        req.body[1],
        req.body[2]
    ], function(err) {
        if (err) {
            console.log("Error while inserting into a database: ", err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(201);
        }
    });
});

app.put('/change', (req, res, next) => {
    // Updating a database
    const sql = 'UPDATE visits SET name = $1, surname = $2, phone_number = $3, SSN = $4 WHERE day = $5 AND time = $6';
    db.query(sql, [
        req.body[0],
        req.body[1],
        req.body[2],
        req.body[3],
        req.body[4],
        req.body[5]
    ], function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(201);
        }
    });
});

app.delete('/day/:day/time/:time', (req, res) => {
    // Deleting data inside of the database
    const sql = 'DELETE FROM visits WHERE day = $1 AND time = $2';
    db.query(sql, [
        req.params.day,
        req.params.time
    ], function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(204);
        }
    });
});

app.delete('/doctors/:id', (req, res) => {
    console.log(req.params.id);
    // Deleting data inside of the database
    const sql = 'DELETE FROM doctors WHERE id = $1';
    db.query(sql, [
        req.params.id
    ], function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(204);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});