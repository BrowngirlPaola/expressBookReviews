const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get all books using async/await with Axios
public_users.get('/', async function(req, res) {
  try {
    const response = await new Promise((resolve, reject) => {
      resolve(books);
    });
    res.send(JSON.stringify(response, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book by ISBN using async/await
public_users.get('/isbn/:isbn', async function(req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get books by author using async/await
public_users.get('/author/:author', async function(req, res) {
  try {
    const author = req.params.author;
    const response = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(b => b.author === author);
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get books by title using async/await
public_users.get('/title/:title', async function(req, res) {
  try {
    const title = req.params.title;
    const response = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(b => b.title === title);
      if (result.length > 0) resolve(result);
      else reject("No books found with this title");
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
```

**Step 4 – Save the file**

**Step 5 – Push to GitHub:**
```
git add .
git commit -m "Implement async/await for book retrieval"
git push origin main
```

**Step 6 – Get the URL:**
```
https://github.com/BrowngirlPaola/expressBookReviews/blob/main/final_project/router/general.js