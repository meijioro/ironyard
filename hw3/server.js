let TicTacToeGame = require('./src/tic-tac-toe-game');
let fs = require('fs');
let path = require('path');
let bodyparser = require('body-parser');
let Promise = require('bluebird');
let expressFactoryFunc = require('express');
let nunjucks = require('nunjucks');
let app = expressFactoryFunc();

nunjucks.configure('templates', { //tells nunjucks to look in the templates folder
  autoescape: true,
  watch: true,
  express: app
});

Promise.promisifyAll(fs); //make all fs into promises

/*
  Note: the board on the template doesn't go back to original state on refresh 
  unless server is restarted
*/

//3 params is request handler
app.use(function(req, res, next) { //a middleware since it has an extra param
  console.log('request went by', req.path);
  next(); // go to next middleware
  //next(err); //got to error middleware
});

//4 params is error handler
app.use(function(err, req, res, next) {
  console.error('something bad happened', req.path, err);
  next(err);
});

app.use(bodyparser.urlencoded({ extended: true}));

app.get('/', function(req, res) {
  res.render('index.html', {
    name: 'Luke Skywalker?',
    games: globalGames
  });
});


app.use(function(req, res, next){
  //if the x-http-method key exists in the request body, then set the
  //method property of the request obj to that value all uppercased
  if (req.body && req.body['X-HTTP-METHOD'] === 'Delete') { //take `name` from input and if value of input is Delete
    req.method = 'DELETE'; //change method on form to DELETE then use `app.delete`
  } 
  next();
});

//VIEW GAME
app.get('/:gameIndex', function(req, res) {
  let gameIndex = req.params.gameIndex - 0;

  if ( Number.isNaN(gameIndex) || !globalGames[gameIndex]) {
    return res.redirect('/'); 
  }

  //this is where all your data you want to send to template
  res.render('game.html', {
    index: globalGames[gameIndex],
    gameIndex: gameIndex,
    saved: req.query.saved //reads from url param `saved`
  });

});


//MARK MOVE
app.post('/:gameIndex', function(req, res) {
  let gameIndex = req.params.gameIndex;
  let {row, col} = req.body;
  globalGames[gameIndex].play( Number.parseInt(row), Number.parseInt(col) );
  res.redirect(`/${gameIndex}`);
});


//SAVE GAME
app.post('/:gameIndex/save', function(req, res){
  let gameIndex = req.params.gameIndex;
  let currentGame = globalGames[gameIndex]; //get current game position from arr 
  let currentGameToJson = currentGame.toJson();

  //since `writeFile` is a promise it needs to have a `.then` 
  fs.writeFileAsync(`./sandwich/TryToFindTheCorrectFilename.json`, currentGameToJson) //find file and insert json data
    .then( () => {
      res.redirect(`/${gameIndex}?saved=true`);
    })
    .catch( error => {
      console.log(error);
      res.status(501).end(); //stop app from hanging, needed cause of promises 
    }); //then when done redirect
});


//CREATE NEW GAME
app.post('/', function(req, res) { //the form on the create btn action='/' 
  let game = new TicTacToeGame(); //create new game
  globalGames.push(game); // `globalGames` is accessable so push the game to the arr list
  let gameIndex = globalGames.length - 1; //create `gameIndex` by taking the length of arr and additional
  res.redirect(`/${gameIndex}`); //new blank gameIndex page
});


//DELETE GAME
app.delete('/:gameIndex', function(req, res) {
  res.redirect('/');

  //method to use is fs.unlink
});





/* err => response.status(500).json(err)
  LOOP THROUGH LIST OF FILES THAT EXIST IN FOLDER AND
  EXTRACT AND PUT INTO ARRAY FOR EXPRESS TO ACCESS DATA
*/
let globalGames = [];

function loopFiles(list) {
  let listOfGamesArr = [];
  let obj = {};

  list.forEach(function(list){
    if (path.extname('./sandwhich/' + list) === '.json') { //don't read .DS_STORE
      obj = {
        filename: list,
        infoArr: fs.readFileAsync('./sandwhich/' + list, 'utf8') 
      }
      listOfGamesArr.push(Promise.props(obj)); //unpackage the obj promise before nesting into array
    }
  });
  return Promise.all(listOfGamesArr); //unpackage the entire parent array
}

fs.readdirAsync('./sandwhich')
  .then( listOfFiles => loopFiles(listOfFiles) )
  .then( listOfGamesArr => {
    let arr = [];
    listOfGamesArr.forEach(function(game) {
      //arr.push( TicTacToeGame.fromJson() )
    }); 
   })
  //.then( readFilesArr => {
    /*let arr = [];
    readFilesArr.forEach(function(readFilesArr) {
      arr.push( TicTacToeGame.fromJson(readFilesArr) );
    });
    return arr;
  })*/
  //.then( parsedFiles => {
    //globalGames = parsedFiles;

    //now app is called
    //app.listen(8080, () => console.log('listening to port 8080')); //app.listen(8080, callback);

    //let port = process.env.PORT || 8080;
    //app.listen(port, () => console.log('listening to port 8080'));

    //console.log(parsedFiles);
  //})
  .catch( err => console.log(err) );
