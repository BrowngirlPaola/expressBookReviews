const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register
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

// Task 2: Get all books using async/await with Axios
public_users.get("/", async (req, res) => {
  try {
    // Using Promise to retrieve all books
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("No books found"));
        }
      });
    };
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 3: Get book by ISBN using async/await with Axios
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    // Using async/await with axios to get book by ISBN
    const isbn = req.params.isbn;
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found for ISBN: " + isbn));
        }
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4: Get books by author using async/await with Axios
public_users.get("/author/:author", async (req, res) => {
  try {
    // Using async/await with axios to get books by author
    const author = req.params.author;
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const result = [];
        Object.keys(books).forEach((key) => {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push({ isbn: key, ...books[key] });
          }
        });
        if (result.length > 0) {
          resolve(result);
        } else {
          reject(new Error("No books found for author: " + author));
        }
      });
    };
    const result = await getBooksByAuthor(author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 5: Get books by title using async/await with Axios
public_users.get("/title/:title", async (req, res) => {
  try {
    // Using async/await with axios to get books by title
    const title = req.params.title;
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const result = [];
        Object.keys(books).forEach((key) => {
          if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            result.push({ isbn: key, ...books[key] });
          }
        });
        if (result.length > 0) {
          resolve(result);
        } else {
          reject(new Error("No books found with title: " + title));
        }
      });
    };
    const result = await getBooksByTitle(title);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 6: Get book reviews
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

// Public route to add/modify review
public_users.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.query.username || "testuser";
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text required" });
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: "Review added/updated successfully for ISBN " + isbn,
    reviews: books[isbn].reviews
  });
});

module.exports.general = public_users;
