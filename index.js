require("dotenv").config();


const express = require("express");
const mongoose = require('mongoose');
var bodyParser = require("body-Parser");
//database
const database = require("./database");

//initialise
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(() => console.log("Connection Established"));


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

//post

/*
Route                /book/new
Description         Add new books
Access              public
Parameter           none
Methods             POST
*/

booky.post("/book/new", (req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});

/*
Route                /author/new
Description         Add new author
Access              public
Parameter           none
Methods             POST
*/
booky.post("/author/new", (req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthors: database.author});
});

/*
Route                /publication/new
Description         Add new publication
Access              public
Parameter           none
Methods             POST
*/
//task to check for correct data
booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublications: database.publication});
});

/****PUT****/
/*
Route                /publication/update/book
Description         update or add new publication
Access              public
Parameter           isbn
Methods             PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publication = req.body.pubID;
      return;
    }
  });
  //update the existing pub books to empty or remove // TODO:

  return res.json(
    {
      books : database.books,
      publications: database.publication,
      message: "Succesfully updated publications"
    }
  )
});

/****DELETE****/
/*
Route               /book/delete
Description         delete
Access              public
Parameter           isbn
Methods             DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
  //Whichever book that  doesnot match with the isbn , just send it to an updated database array and rest will be filtered out
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json({books: database.books});
});


/*
Route               /book/author/delete
Description         delete
Access              public
Parameter           id
Methods             DELETE
*/
booky.delete("/book/author/delete/:id", (req,res) => {
  //delete from books
  const updatedBook_authorDatabase = database.author.filter(
    (author) => author.id !== parseInt(req.params.id)
  );
  database.author = updatedBook_authorDatabase;

  return res.json({author: database.author});
});


/*
Route               /book/delete/author/:isbn/:authorId
Description         delete
Access              public
Parameter           isbn, authorId
Methods             DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });

  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json(
    {
      books : database.books,
      author: database.author,
      message: "Succesfully deleted author"
    }
  )
});

booky.listen(3000, () => {
  console.log("Server is up and running");
});
