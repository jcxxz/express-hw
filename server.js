const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');
// const { clog } = require('./middleware/clog');
// const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
// app.use(bodyParser.json());

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  return res.sendFile(path.join(__dirname, '/db.json'))
});

app.post('/api/notes', (req, res) => {
  console.log(req.body);
  let notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db.json')))

  let newNote = {
    title : req.body.title,
    text : req.body.text,
    id : uuid.v4(),
  }

  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, '/db.json'),JSON.stringify(notes))
  return res.send(newNote);
});

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
