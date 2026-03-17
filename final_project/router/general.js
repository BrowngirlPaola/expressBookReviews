const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User registered successfully!" });
});

public_users.get('/', async (req, res) => {
  try {
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) { resolve(books); }
        else { reject(new Error("No books found")); }
      });
    };
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const getByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) { resolve(book); }
        else { reject(new Error("Book not found for ISBN: " + isbn)); }
      });
    };
    const book = await getByISBN(req.params.isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const getByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const result = [];
        Object.keys(books).forEach((key) => {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push({ isbn: key, ...books[key] });
          }
        });
        if (result.length > 0) { resolve(result); }
        else { reject(new Error("No books found for author: " + author)); }
      });
    };
    const result = await getByAuthor(req.params.author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const getByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const result = [];
        Object.keys(books).forEach((key) => {
          if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            result.push({ isbn: key, ...books[key] });
          }
        });
        if (result.length > 0) { resolve(result); }
        else { reject(new Error("No books found with title: " + title)); }
      });
    };
    const result = await getByTitle(req.params.title);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
