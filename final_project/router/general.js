const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    // Simulate fetching books from an endpoint (like your own server)
    const response = await axios.get("http://localhost:5000/");

    // You could just send the response, but since this would loop to itself,
    // we’ll directly resolve our local books object as a Promise
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    // Simulate fetching asynchronously (e.g., from a DB)
    const response = await new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      let booksByAuthor = [];

      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
        }
      });

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found for this author");
      }
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// // Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;
//   const keys = Object.keys(books);
//   let booksByAuthor = [];

//   // 4️⃣ Loop through books and check if author matches
//   keys.forEach((key) => {
//     if (books[key].author.toLowerCase() === author.toLowerCase()) {
//       booksByAuthor.push(books[key]);
//     }
//   });

//   if (booksByAuthor.length > 0) {
//     res.status(200).json(booksByAuthor);
//   } else {
//     res.status(404).json({ message: "No books found for this author" });
//   }
// });


public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    // Simulate async operation (like fetching from a database)
    const response = await new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      let booksByTitle = [];

      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      });

      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// // Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   const keys = Object.keys(books);
//   let booksByTitle = [];

//   // Loop through all books
//   keys.forEach((key) => {
//     if (books[key].title.toLowerCase() === title.toLowerCase()) {
//       booksByTitle.push(books[key]);
//     }
//   });

//   // Send response
//   if (booksByTitle.length > 0) {
//     res.status(200).json(booksByTitle);
//   } else {
//     res.status(404).json({ message: "No books found with this title" });
//   }
// });

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    // Simulate fetching from your own backend (or external API)
    // Here, we’ll just mimic it locally:
    const response = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//  Get book review
// public_users.get("/review/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   // 3️⃣ If book exists, send its reviews
//   if (book) {
//     res.status(200).json(book.reviews);
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
// });

module.exports = public_users;
