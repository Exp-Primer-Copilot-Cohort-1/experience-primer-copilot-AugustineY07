// Create web server
// 1. Create a web server
// 2. Create a route for GET /comments
// 3. Create a route for POST /comments
// 4. Create a route for DELETE /comments/:id
// 5. Create a route for PUT /comments/:id
// 6. Create a route for GET /comments/:id

// Import modules
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');

// Import data
const comments = require('./comments.json');

// Create web server
const app = express();

// Add middleware
app.use(bodyParser.json());

// Create a route for GET /comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// Create a route for POST /comments
app.post('/comments', [
  check('comment').isLength({ min: 5 }),
  check('username').isLength({ min: 3 }),
], (req, res) => {
  // Validate data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  // Create new comment
  const comment = {
    id: Date.now(),
    username: req.body.username,
    comment: req.body.comment,
  };

  // Add new comment to the comments array
  comments.push(comment);

  // Save comments array to the comments.json file
  fs.writeFile('./comments.json', JSON.stringify(comments), () => {
    res.json(comment);
  });
});

// Create a route for DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
  // Find comment by id
  const index = comments.findIndex(comment => comment.id === Number(req.params.id));

  // Delete comment
  comments.splice(index, 1);

  // Save comments array to the comments.json file
  fs.writeFile('./comments.json', JSON.stringify(comments), () => {
    res.json({ success: true });
  });
});

// Create a route for PUT /comments/:id
app.put('/comments/:id', [
  check('comment').isLength({ min: 5 }),
  check('username').isLength({ min: 3 }),
], (req, res) => {
  // Find comment by id
