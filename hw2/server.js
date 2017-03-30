let fs = require('fs');
let path = require('path');
let Promise = require('bluebird');
Promise.promisifyAll(fs);

let TicTacToeGame = require('./src/tic-tac-toe-game');

function loopFiles(list) {
  let arr = [];

  list.forEach(function(list){
    if (path.extname('./sandwhich/' + list) === '.json') { //don't read .DS_STORE
      arr.push( fs.readFileAsync('./sandwhich/' + list, 'utf8') ); //read each file
    }
  });
  return Promise.all(arr);
}

//function final() {
  //return fs.readdirAsync('./sandwhich')
fs.readdirAsync('./sandwhich')
  .then( listOfFiles => loopFiles(listOfFiles) )
  .then( readFilesArr => {
    let arr = [];
    readFilesArr.forEach(function(readFilesArr) {
      arr.push( TicTacToeGame.fromJson(readFilesArr) );
    });
    return arr;
  })
  .then( parsedFiles => console.log(parsedFiles) )
  .catch( err => console.log(err) );
//}

module.exports = function() {
  return final(); //wait until all promises are done then export
}

//meanwhile elsewhere
//let s = require('./server');
//s().then(...).catch(...);
