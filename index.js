const express = require("express");

//database
const database = require("./database");

//initialise
const booky = express();

/*
Route                /
Description         Get all the books
Access              public
Parameter           NONE
Methods             GET
*/
booky.get("/", (req,res) => {
  return res.json({books: database.books});
});

/*
Route                /is
Description         Get specific book on isbn
Access              public
Parameter           isbn
Methods             GET
*/
booky.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No Book found for the ISBN of ${req.params.isbn}`})
  }

  return res.json({book: getSpecificBook});
});

/*
Route                /c
Description         Get specific book on category
Access              public
Parameter           category
Methods             GET
*/
booky.get("/c/:category",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No Book found for the category of ${req.params.category}`})
  }

  return res.json({book: getSpecificBook});
});

/*
Route                /l
Description         Get specific book on language
Access              public
Parameter           language
Methods             GET
*/
booky.get("/l/:language",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No Book found for the language of ${req.params.language}`})
  }

  return res.json({book: getSpecificBook});
});

/*
Route               /authhor
Description         Get all authors
Access              public
Parameter           NONE
Methods             GET
*/
booky.get("/author",(req,res) => {
  return res.json({authors: database.author})
});

/*
Route                /author
Description         Get specific author
Access              public
Parameter           isbn
Methods             GET
*/
booky.get("/author/:id",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id == req.params.id
  );

  if(getSpecificAuthor.length === 0) {
    return res.json({error: `No Author found for the Id of ${req.params.id}`})
  }

  return res.json({book: getSpecificAuthor});
});

/*
Route                /author/book/:isbn
Description         Get specific author on isbn
Access              public
Parameter           isbn
Methods             GET
*/
booky.get("/author/book/:isbn",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0) {
    return res.json({error: `No Author found for the book of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificAuthor});
});

/*
Route               /publication
Description         Get all publication
Access              public
Parameter           NONE
Methods             GET
*/
booky.get("/publication",(req,res) => {
  return res.json({publications: database.publication})
});

/*
Route                /publication/:id
Description         Get specific publication
Access              public
Parameter           id
Methods             GET
*/
booky.get("/publication/:id",(req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.id == req.params.id
  );

  if(getSpecificPublication.length === 0) {
    return res.json({error: `No Publication found for the Id of ${req.params.id}`})
  }

  return res.json({book: getSpecificPublication});
});

/*
Route                /publication/book/:isbn
Description         Get list of publication from isbn
Access              public
Parameter           isbn
Methods             GET
*/
booky.get("/publication/book/:isbn",(req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );

  if(getSpecificPublication.length === 0) {
    return res.json({error: `No Publication found for the book of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificPublication});
});


booky.listen(3000, () => {
  console.log("Server is up and running");
});
