const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // 1️⃣ Get ISBN from route params
  const review = req.query.review; // 2️⃣ Get review text from query
  const username = req.session.authorization.username;
 // 3️⃣ Get logged-in username from session

  // 4️⃣ Check if the user is logged in
  if (!username) {
    return res
      .status(401)
      .json({ message: "You must be logged in to post a review." });
  }

  // 5️⃣ Check if review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  // 6️⃣ Check if the ISBN exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // 7️⃣ Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully!",
    reviews: books[isbn].reviews,
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL
  const username = req.session.username; // Get the logged-in user's username from session

  // 1️⃣ Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to delete a review." });
  }

  // 2️⃣ Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // 3️⃣ Check if the user has a review for this book
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; // Delete that user's review
    return res.status(200).json({
      message: "Your review has been deleted successfully.",
      reviews: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "You have not posted a review for this book." });
  }
});


module.exports = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
