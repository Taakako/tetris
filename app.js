document.addEventListener('DOMContentLoaded',() =>{
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');
const quitBtn = document.querySelector('#quit-button');
const width = 10;
let nextRandom = 0;
let random = 0;
let timerId;
let score = 0;
let nextCurrent;
const colors =[
    'orange',
    'red',
    'purple',
    'green',
    'blue'
]
let color;
let nextColor;

//The Tetrominoues
const lTetromino = [
    [1,width+1,width*2+1,2],
    [width,width+1,width+2,width*2+2],
    [1,width+1,width*2+1,width*2],
    [width,width*2,width*2+1,width*2+2],
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
] 

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1],
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
]

const iTetromino =[
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
]

const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];

let currentPosition = 4;
let currentRotation = 0;

console.log(theTetrominoes[0][0]);

//randamly select a Tetromino and its first rotation

let current = theTetrominoes[random][currentRotation];


//draw the tetromino
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[color]
    })
}

//undraw the Tetromino
function undraw(){
    current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor ='';
    })
}


//asign funcions to keycodes
function control(e){
    if(e.keyCode === 37){
        moveLeft();
    }else if(e.keyCode === 38) {
        rotate();        
    }else if(e.keyCode === 39) {
        moveRight();
    }else if (e. keyCode === 40){
        moveDown();
    }
} 





//move down function
function moveDown(){
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

//freeze function
function freeze(){
    if(
        current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
        || current.some(index => squares[currentPosition + index + width].classList.contains('taken1'))
       ) {
           current.forEach(index => squares[currentPosition + index].classList.add('taken'))  
            //start a new tetromino fallinf  
           color = nextColor
           random = nextRandom
           nextRandom = Math.floor(Math.random() * theTetrominoes.length);
           nextColor = Math.floor(Math.random()*colors.length);
           current = theTetrominoes[random][currentRotation];
           currentPosition = 4;
           currentRotation = 0;
           draw();
           displayShape();
           addScore();
           gameOver();
         //if(!current.some(index => squares[currentPosition + index].classList.contains('tetromino'))){
          //  current.forEach(index => squares[currentPosition + index].classList.add('tetromino'))
           // current.forEach(index => squares[currentPosition + index].style.backgroundColor = colors[color])

        }   

}

//move the tetromino left, unless is at the edge or there is a blockage
function moveLeft(){
    undraw();
    const isAtLeftEdge = current.some(index => ( currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -= 1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1;
    }
    draw();
}

//move the tetromino right, unless is at the edge or there is a blockage
function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge)currentPosition +=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken',))){
        currentPosition -=1;
    }
    draw();
}


///FIX ROTATION OF TETROMINOS A THE EDGE
function isAtRight(){
    return current.some( index => (currentPosition + index + 1) % width === 0 )
}

function isAtLeft(){
    return current.some(index => (currentPosition + index) % width ===0)
}

function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
        checkRotatedPosition(P);
      }
    }
  }


//rotate the tetromino
function rotate(){
    undraw();
    nextCurrent = current.concat();
    nextCurrentRotaion = currentRotation + 1
    if(nextCurrentRotaion === nextCurrent.length){
        nextCurrentRotaion = 0
    }
    nextCurrent = theTetrominoes[random][nextCurrentRotaion]    
    
    if(!nextCurrent.some( index => squares[currentPosition + index].classList.contains('taken'))
    &&!nextCurrent.some( index => squares[currentPosition + index].classList.contains('taken1'))
    &&!nextCurrent.some( index => squares[currentPosition + index + width].classList.contains('taken'))
    &&!nextCurrent.some( index => squares[currentPosition + index + width].classList.contains('taken1'))){
        currentRotation ++
        if(currentRotation ===current.length){ //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
    }
    current = theTetrominoes[random][currentRotation]      
    checkRotatedPosition();
    draw();
}       

  
   
/////



//show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4;
let displayIndex;
let miniGridWidth;


//the Tetrominos without rotations
const upNextTetrominoes = [
    [1,displayWidth+1,displayWidth*2+1,2], // Ltetromino
    [0,displayWidth,displayWidth+1,displayWidth*2+1],//Ztetromino
    [1,displayWidth,displayWidth+1,displayWidth+2],//Ttetromino
    [0,1,displayWidth,displayWidth+1],//Otetoromino
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]//itetoromino
]

//display the shape in the mini grid display
function displayShape(){
    displayIndex = 0;
    miniGridWidth = 0;
    //remove any trace of a tetromino form  the entire grid
    displaySquares.forEach(square =>{
        square.classList.remove('tetromino');
        square.style.backgroundColor= ''
    })
    if(nextRandom==1||nextRandom==3 ){
        displayIndex = 1
    }

    if(nextRandom==2||nextRandom==3 ){
        miniGridWidth = 4
    }     
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index +miniGridWidth].classList.add('tetromino');
        displaySquares[displayIndex + index + miniGridWidth].style.backgroundColor = colors[nextColor]
    })
}

//add functionarity to the button
startBtn.addEventListener('click',() =>{
    if (timerId){
        clearInterval(timerId)
        timerId = null
        document.removeEventListener('keyup',control)
    }else if(!random && !nextRandom){
            color = Math.floor(Math.random()*colors.length);
            random = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation]
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            nextColor = Math.floor(Math.random()*colors.length);
            draw()
            displayShape()
            timerId = setInterval(moveDown,1000); 
            document.addEventListener('keyup',control);  
   }else{
        timerId = setInterval(moveDown,1000); 
        document.addEventListener('keyup',control);  
        draw()
        displayShape()
        
    }    
})

//add functionarity to the quit-button
quitBtn.addEventListener('click',() =>{
    clearInterval(timerId)
    timerId = null
    nextRandom = null
    currentPosition = 4
    random = null
    scoreDisplay.innerHTML = 0;
    color = null
    nextColor = null
    //currentRotation = null
    
    squares.forEach(square => {
        square.classList.remove('tetromino')
        square.classList.remove('taken')
        square.style.backgroundColor=''
    })
    displaySquares.forEach(square =>{
        square.classList.remove('tetromino')
        square.style.backgroundColor=''
    })
})
    
    



//add score
function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
}



//game over
function gameOver(){
    if(current.some(index => squares[ currentPosition+ index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
        document.removeEventListener('keyup',control);
    }
}

})

