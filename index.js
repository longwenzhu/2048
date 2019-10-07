"use strict";

var squareBGC = { 0: '#cccob3', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b170', 16: '#f59563', 32: '#67e5f2', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 1024: '#33b5e5', 2048: '#09c' },
  my2048 = document.getElementsByClassName('my2048')[0],
  squareWidth = 100,
  cols = 5,
  rows = 3,
  squareSet = [],
  valueSet = [],
  lock ,
  isChange = true,
  spacing = 15;

init();

function init() {
  initBoard();
  randGenerateSquare();
  randGenerateSquare();
  addEvent();
}

function initBoard() {
  my2048.style.width = squareWidth * cols + spacing * (cols + 1) + 'px';
  my2048.style.height = squareWidth * rows + spacing * (rows + 1) + 'px';
  for (var i = 0; i < rows; i++) {
    squareSet[i] = [];
    valueSet[i] = [];
    for (var j = 0; j < cols; j++) {
      squareSet[i][j] = null;
      valueSet[i][j] = 0;
      createSquare(i, j, 0);
    }
  }
}
function createSquare(i, j, num) {
  var div = document.createElement('div');
  div.style.left = squareWidth * j + spacing * (j + 1) + 'px';
  div.style.top = squareWidth * i + spacing * (i + 1) + 'px';
  div.style.width = squareWidth + 'px';
  div.style.height = squareWidth + 'px';
  div.style.fontSize = squareWidth * 0.4 + 'px';
  div.style.lineHeight = squareWidth + 'px';
  div.style.backgroundColor = squareBGC[num];
  div.num = num;
  if (num != 0) {
    div.style.transform = 'scale(0)';
    setTimeout(function () {
      div.style.transform = 'scale(1)';
    }, 20);
    div.innerHTML = num;
  }
  my2048.appendChild(div);

  return div;
}

function randGenerateSquare() {
  for (; ;) {
    var row = Math.floor(Math.random() * rows);
    var col = Math.floor(Math.random() * cols);
    if (!squareSet[row][col]) {
      var temp = createSquare(row, col, randGenerateNum());
      squareSet[row][col] = temp;
      valueSet[row][col] = temp.num;
      return;
    }
  }
}
function randGenerateNum() {
  return Math.random() > 0.5 ? 2 : 4;
}
function addEvent() {
  document.onkeydown = function (e) {
   if(lock){
     return;
   }
     lock = true;
     move(e.keyCode);
  }
}
function move(direction) {
  var newSquareSet = analysisActions(direction);
 setTimeout(function(){
    refresh(newSquareSet);
    lock = false;
    if(isOver()){
      setTimeout(function(){
        alert('over');
      },200);
    }
 }, 500);
}
function analysisActions(direction) {
  var newSquareSet = createNullArr();
  if (direction == 37) {
    //'left'
    for (var i = 0; i < rows; i++) {
      var temp = [];
      for (var j = 0; j < cols; j++) {
        if (squareSet[i][j]) {
          temp.push(squareSet[i][j]);

        }
      }
      temp = getNewLocation(temp);
      for(var k = 0; k < temp.length; k++){
        newSquareSet[i][k] = temp[k];
      }
    }

  }else if(direction == 38){
    //up
    for (var i = 0; i < cols; i++) {
      var temp = [];
      for (var j = 0; j < rows; j++) {
        if (squareSet[j][i]) {
          temp.push(squareSet[j][i]);
        }
      }
      temp = getNewLocation(temp);
      for(var k = 0; k < temp.length; k++){
        newSquareSet[k][i] = temp[k];
      }
    }
  }else if(direction == 39){
    //right
    for (var i = 0; i < rows; i++) {
      var temp = [];
      for (var j = 0; j < cols; j++) {
        if (squareSet[i][j]) {
          temp.unshift(squareSet[i][j]);

        }
      }
      temp = getNewLocation(temp);
      for(var k = 0; k < cols; k++){
       if(temp[k]){
        newSquareSet[i][cols - k - 1] = temp[k];
       }
      }
    }
 
  }else if(direction == 40){
    //bottom
    for (var i = 0; i < cols; i++) {
      var temp = [];
      for (var j = 0; j < rows; j++) {
        if (squareSet[j][i]) {
          temp.unshift(squareSet[j][i]);
        }
      }
      temp = getNewLocation(temp);
      for(var k = 0; k < rows; k++){
       if(temp[k]){
        newSquareSet[rows - k - 1][i] = temp[k];
       }
      }
    }
  }
  for(var i = 0; i < newSquareSet.length; i++){
    for(var j = 0; j < newSquareSet[i].length; j++){
      if(newSquareSet[i][j]){
        newSquareSet[i][j].style.left = j * squareWidth + (j + 1) * spacing + 'px';
        newSquareSet[i][j].style.top = i * squareWidth + (i + 1) * spacing + 'px';
        if(newSquareSet[i][j].nextSquare){
          newSquareSet[i][j].nextSquare.style.left = j * squareWidth + (j + 1) * spacing + 'px';
          newSquareSet[i][j].nextSquare.style.top = i * squareWidth + (i + 1) * spacing + 'px';
        }
      }
    }
  }
  return newSquareSet;
}

function getNewLocation(arr) {
  var temp = [];
  if (arr.length == 0) {
    return [];
  } else {
    temp[0] = arr[0];
    for (var i = 1; i < arr.length; i++) {
      if (temp[temp.length - 1].num == arr[i].num && !temp[temp.length - 1].nextSquare) {
        temp[temp.length - 1].nextSquare = arr[i];
      } else {
        temp.push(arr[i]);
      }
    }
  }
  return temp;
}
function createNullArr() {
  var temp = [];
  for (var i = 0; i < rows; i++) {
    temp[i] = [];
    for (var j = 0; j < cols; j++) {
      temp[i][j] = null;
    }
  }
  return temp;
}

function refresh(newSquareSet){
  squareSet = createNullArr();
  var newValueMap = createNullArr();
  isChange = false;
  for(var i = 0; i < newSquareSet.length; i++){
    for(var j = 0; j < newSquareSet[i].length; j++){
      if(newSquareSet[i][j]){
        if(newSquareSet[i][j].nextSquare){
           var div = createSquare(i, j, newSquareSet[i][j].num * 2);
           squareSet[i][j] = div;
           newValueMap[i][j] = div.num;
          my2048.removeChild(newSquareSet[i][j].nextSquare);
          my2048.removeChild(newSquareSet[i][j]);

        }else{
          squareSet[i][j] = newSquareSet[i][j];
          newValueMap[i][j] = newSquareSet[i][j].num;
        }
      }else{
        newValueMap[i][j] = 0;
      }
      if(newValueMap[i][j] != valueSet[i][j]){
        isChange = true;
      }
    }
  }
  valueSet = newValueMap;
  if(isChange){
    randGenerateSquare();
  }
}

function isOver(){
  for(var i = 0; i < valueSet.length; i++){
    for(var j = 0; j < valueSet[i].length; j++){
      if(valueSet[i][j] == 0){
        return false;
      }else{
        if(valueSet[i][j] == valueSet[i][j + 1] || valueSet[j + 1] && valueSet[j][i] == valueSet[j + 1][i]){
          return false;
        }
      }
    }
  }
  return true;
}
