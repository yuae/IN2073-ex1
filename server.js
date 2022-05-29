// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');
const BooksModel = require('./models/books');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get All books information'},
      // TODO: Write other API end-points description here like above
      {method: 'POST', path:'/api/books/', description: 'add new book entry'},
      {method: 'PUT', path: '/api/books/:id', description: 'update book info'},
      {method: 'POST', path: '/api/books/:id', description: 'delete book entry'}
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'YY',
    'homeCountry': 'C',
    'degreeProgram': 'CS',//informatics or CSE.. etc
    'email': '',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': '',
    'hobbies': []
  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  const nbook = new BooksModel ({
    title: req.body.title, // title of the book
    author: req.body.author, // name of the first author
    releaseDate: req.body.releaseDate, // release date of the book
    genre: req.body.genre, //like fiction or non fiction
    rating: req.body.tating, // rating if you have read it out of 5
    language: req.body.language // language in which the book is released
  });
  db.books.create(nbook, function (err, newBooks) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(newBooks);
  });
  /*
   * return the new book information object as json
   */
  /*
  var newBook = {};
  res.json(newBook);
  */
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  const updates = {
    title: req.body.title, // title of the book
    author: req.body.author, // name of the first author
    releaseDate: req.body.releaseDate, // release date of the book
    genre: req.body.genre, //like fiction or non fiction
    rating: req.body.tating, // rating if you have read it out of 5
    language: req.body.language // language in which the book is released
  };
  db.books.findOneAndUpdate({_id: bookId}, updates, function (err, updatedBookInfo) {
    if (err) throw err;
    /*
     * return the object as json values
     */
    res.json(updatedBookInfo);
  });
  /*
   * Send the updated book information as a JSON object
   */
  /*
  var updatedBookInfo = {};
  res.json(updatedBookInfo);
  */
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  db.books.findOneAndDelete({ _id: bookId}, function (err, deletedBook) {
    if (err) throw err;
    /*
     * return the object as json values
     */
    res.json(deletedBook);
  });
  /*
   * Send the deleted book information as a JSON object
   */
  /*
  var deletedBook = {};
  res.json(deletedBook);
  */
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
