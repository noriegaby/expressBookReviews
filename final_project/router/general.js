//general.js
const express = require('express');
const books = require("./booksdb.js");
const public_users = express.Router();

// Ruta para obtener la lista de libros disponibles
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Ruta para obtener detalles de un libro por su ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn]; // Accede al libro usando su clave ISBN
  if (book) {
      return res.status(200).json(book);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});


// Ruta para obtener detalles de libros por autor
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "Books by author not found" });
    }
});

// Ruta para obtener libros por título
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "Books by title not found" });
    }
});

// Ruta para obtener detalles de un libro por su ISBN
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn]; // Accede al libro usando su clave ISBN
  if (book && book.reviews) {
      const review = book.reviews;
      return res.status(200).json({ review });
  } else {
      return res.status(404).json({ message: "Book review not found" });
  }
});

// Ruta para agregar una reseña a un libro por su ISBN
// Ruta para agregar una reseña a un libro por su ISBN
public_users.post("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Obtener el ISBN del parámetro de la URL
  const review = req.body.review; // Obtener la reseña del cuerpo de la solicitud

  // Verificar si se proporcionó una reseña en el cuerpo de la solicitud
  if (!review) {
      return res.status(400).json({ message: "La reseña no fue proporcionada en la solicitud." });
  }

  // Verificar si el libro existe en la base de datos
  if (!books[isbn]) {
      return res.status(404).json({ message: "El libro con el ISBN " + isbn + " no fue encontrado." });
  }

  // Verificar si el libro ya tiene una lista de reseñas
  if (!Array.isArray(books[isbn].reviews)) {
      // Si no es un array, inicialízalo como un array vacío
      books[isbn].reviews = [];
  }

  // Agregar la reseña al libro
  books[isbn].reviews.push(review);

  // Enviar una respuesta de éxito
  res.status(200).json({ message: "The review has been added to the book with the ISBN "  + isbn + "." });
});
// Ruta para actualizar una reseña de un libro por su ISBN
public_users.put("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Obtener el ISBN del parámetro de la URL
  const updatedReview = req.body.review; // Obtener la reseña actualizada del cuerpo de la solicitud

  // Verificar si se proporcionó una reseña actualizada en el cuerpo de la solicitud
  if (!updatedReview) {
      return res.status(400).json({ message: "La reseña actualizada no fue proporcionada en la solicitud." });
  }

  // Verificar si el libro existe en la base de datos
  if (!books[isbn]) {
      return res.status(404).json({ message: "El libro con el ISBN " + isbn + " no fue encontrado." });
  }

  // Verificar si el libro tiene una lista de reseñas
  if (!Array.isArray(books[isbn].reviews)) {
      // Si no es un array, inicialízalo como un array vacío
      books[isbn].reviews = [];
  }

  // Actualizar la reseña del libro
  books[isbn].reviews = updatedReview;

  // Enviar una respuesta de éxito
  res.status(200).json({ message: "The review has been added/updated for the book with the ISBN. " + isbn + "." });
});

// Route to delete a review of a book by its ISBN
public_users.delete("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Obtener el ISBN del parámetro de la URL

  // Verificar si el libro existe en la base de datos
  if (!books[isbn]) {
      return res.status(404).json({ message: "The book with ISBN " + isbn + " was not found." });
  }

  // Check if the book has a list of reviews
  if (!Array.isArray(books[isbn].reviews) || books[isbn].reviews.length === 0) {
      return res.status(404).json({ message: "The review of book" + isbn + " has been deleted" });
  }

  // Delete the review from the book (for example, the first review)
  const deletedReview = books[isbn].reviews.shift(); // Delete the first review (you can adjust this according to your needs)

  // Send a success response with the deleted review
  res.status(200).json({ message: "The review '" + deletedReview + "' has been deleted from the book with ISBN " + isbn + "." });
});



// Exportar el enrutador
module.exports.general = public_users;

