//設置Start Game按鈕的事件監聽，按下後隱藏背景並開始遊戲
let snakeRun;
let startBtn = document.querySelector("a.start_game");
startBtn.addEventListener("click", e => {
    if(gameMode != 0){
        let home = document.querySelector("section.home");
        home.style.display = "none";
        // 設定一個非同步(Aynchronous)的函式，讓animation每200ms執行一次。
        /*serInterval() 
        return value = 0:暫停, 
        return value = 1:停止, 
        return value >= 2:執行遊戲*/
        console.log("snake status: " + snakeRun);
        snakeRun = setInterval(animation, 200);
        console.log("snake status: " + snakeRun);
    }else{
        alert("please select game mode");
    }
});

//設置Select Mode按鈕的事件監聽，按下後選擇遊戲模式
//game mode value 0 = default, 1 = Normal, 2 = Hell
let gameMode = 0;
let selectMode = document.querySelector("a#select_mode_in_home");
let selectItems = document.querySelector("ul#select_items_in_home");

selectMode.addEventListener("click", e => {
    selectItems.style.display = "inline-block";
});

selectItems.addEventListener("click", e => {
    if(e.target.innerHTML == "Normal Mode"){
        gameMode = 1;
        selectItems.style.display = "none";
        selectMode.innerHTML = e.target.innerHTML;
    }
    else if(e.target.innerHTML == "Hell Mode"){
        gameMode = 2;
        selectItems.style.display = "none";
        selectMode.innerHTML = e.target.innerHTML;
    }
});

//getContext() method 會回傳一個canvas的drawing context
//drawing context可以用來在canvas內畫圖
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;   // 24
const col = canvas.width / unit;    // 24
let direction = "ArrowRight";
let scoreBar = document.getElementById("score");
let highestScoreBar = document.getElementById("highestScore");

class scoreStorage{
    static score = 0;
    static highestScore = 6;

    static initScore(){
        
        if(localStorage.getItem("highestScore") == null){
            this.highestScore = 0;
        }
        else{
            this.highestScore = Number(localStorage.getItem("highestScore"));
        }
        this.score = 0;
    }
}

function printScore(){
    scoreBar.innerHTML = "Score：" +scoreStorage.score;
    highestScoreBar.innerHTML = "Highest Score：" +scoreStorage.highestScore;
}

scoreStorage.initScore();
printScore();

//定義畫面一開始蛇的位置：創建一個代表蛇的array 
//且其中的每個元素，都是一個物件，且這物件儲存蛇的每一節x,y座標
let snake = [];
creatSnake();
function creatSnake(){
    snake[0] = {
        x: 80,
        y: 0
    }

    snake[1] = {
        x: 60,
        y: 0
    }

    snake[2] = {
        x: 40,
        y: 0
    }

    snake[3] = {
        x: 20,
        y: 0
    }
}

// 創建果實的類別，並建立物件
class Fruit {
    constructor(){
        this.fruitX = Math.floor(Math.random() * col)*unit;
        this.fruitY = Math.floor(Math.random() * row)*unit;
        // this.fruitX = 0;
        // this.fruitY = 460;
    }

    drawFruit(){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.fruitX+10, this.fruitY+10, 10, 0, 360);
        ctx.fill();
        ctx.closePath();
    }

    checkOverlap(){
        let isOverlap = false;
        do{
            for(let i = 0; i < snake.length; i++){
                if(this.fruitX == snake[i].x && this.fruitY == snake[i].y){
                    isOverlap = true;
                    console.log("is overlapping");
                    console.log("蛇座標:(" + snake[i].x + ", " + snake[0].y + ")");
                    console.log("重複的果實座標:(" + this.fruitX + ", " + this.fruitY + ")");
                    break;
                }
                else{
                    console.log("is not overlapping");
                    isOverlap = false;
                }
            }
            if(isOverlap){
                this.fruitX = Math.floor(Math.random() * col)*unit;
                this.fruitY = Math.floor(Math.random() * row)*unit;
                // this.fruitX = 0;
                // this.fruitY = 0;
            }
        }
        while(isOverlap)
    }
}
let initFruit = new Fruit();
createFruit();
function createFruit(){
    initFruit = new Fruit();
    initFruit.checkOverlap();
    // initFruit.drawFruit();
}

//在window設置一個監聽器，去監聽使用者按上下左右的操作
//事件觸發後，修改變數direction，讓animation()可以依據direction確定當前方向
function changeDirection(e) {
    if(e.key == "ArrowLeft" && direction != "ArrowRight"){
        direction = e.key;
        console.log("catch direction");
    }
    else if(e.key == "ArrowUp" && direction != "ArrowDown"){
        direction = e.key;
        console.log("catch direction");
    }
    else if(e.key == "ArrowRight" && direction != "ArrowLeft"){
        direction = e.key;
        console.log("catch direction");
    }
    else if(e.key == "ArrowDown" && direction != "ArrowUp"){
        direction = e.key;
        console.log("catch direction");
    }

    //避免事件觸發時，再觸發相同事件
    window.removeEventListener("keydown", changeDirection);
}

/* animation 流程：
                    1.  更新地圖大小、顏色
                    2.  畫出果實
                    3.  判斷是否過牆，如果有修改蛇首座標到對向
                    3.5 判斷蛇是否碰到自己，如碰到結束遊戲，結束時如果分數超過最高分則儲存
                    4.  開始執行畫蛇，以蛇座標為圓心，填充顏色並繪製外框
                    5.  定義蛇的下一幀要如何繪製，以direction的方向決定下一幀蛇首座標要往上下左右哪個方向
                    6.  決定方向後，建立下一幀的蛇首座標物件
                    7.  判斷是否吃到果實，如果沒吃到果實刪掉蛇尾座標，吃到果實則，new一個新的果實
                    8.  把下一幀的蛇首物件放到的array[0]的位置(即蛇首) */
                    console.log("地圖寬度: " + canvas.width);
                    console.log("地圖長度: " + canvas.height);
function animation(){
    // 1. 更新地圖大小、顏色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 2. 畫出果實
    initFruit.drawFruit();

    // 設置hell撞牆的結束條件
    if(gameMode == 2){
        if(snake[0].x >= canvas.width || snake[0].x < 0 || snake[0].y >= canvas.height || snake[0].y < 0){
            resetSnake();
            alert("Game Over");
            console.log("over");
            return; 
        }
    }
    
    //3. 判斷是否過牆，如果有修改蛇首座標到對向
    for(let i = 0; i < snake.length; i++){

        if(snake[i].x >= canvas.width){
            snake[i].x = 0; 
        }
        else if(snake[i].x < 0){
            snake[i].x = canvas.width-unit;
        }
        else if(snake[i].y >= canvas.height){
            snake[i].y = 0-20;
        } 
        else if(snake[i].y < 0){
            snake[i].y = canvas.height-unit;
        }

        // 3.5 判斷蛇是否碰到自己，如碰到結束遊戲，結束時如果分數超過最高分則儲存
        for(let i = 3; i < snake.length; i++){
            if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
                resetSnake();
                alert("Game Over");
                console.log("over");
                return;
            }
        }

        //4. 開始執行畫蛇，以蛇座標為圓心，填充顏色並繪製外框
        ctx.beginPath();
        ctx.arc(snake[i].x+10, snake[i].y+10, 10, 0, 360);
        if(i == 0){
            ctx.fillStyle = "lightgreen";
        }else{
            ctx.fillStyle = "lightblue";
        }
        ctx.fill()
        ctx.strokeStyle = "white"; 
        ctx.stroke()
        ctx.closePath();
    }

    window.addEventListener("keydown", changeDirection);

    //5. 定義蛇的下一幀要如何繪製：以direction的方向決定下一幀蛇首座標要往上下左右哪個方向。
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if(direction == "ArrowUp"){
        snakeY -= unit;
    }
    else if(direction == "ArrowDown"){
        snakeY += unit;
    }
    else if(direction == "ArrowLeft"){
        snakeX -= unit;
    }
    else if(direction == "ArrowRight"){
        snakeX += unit;
    }
    
    //6. 決定方向後，建立下一幀的蛇首座標物件
    let newHead = {
        x: snakeX,
        y: snakeY
    }
    
    //7. 判斷是否吃到果實，如果沒吃到果實刪掉蛇尾座標，吃到果實則，new一個新的果實，且分數加一分，如超過最高分則最高分也跟著加
    if(snake[0].x == initFruit.fruitX && snake[0].y == initFruit.fruitY){
        initFruit = new Fruit();
        initFruit.checkOverlap();
        //計算分數
        if(scoreStorage.score >= scoreStorage.highestScore){
            scoreStorage.highestScore +=1;
            localStorage.setItem("highestScore", scoreStorage.highestScore);
        }
        scoreStorage.score += 1;
        printScore();
    }
    else{
        snake.pop();
    }

    //8. 把下一幀的蛇首物件放到的array最前面(即蛇首)
    snake.unshift(newHead);
}

//設置Pause button的點擊事件監聽，按下後暫停
let pause = document.querySelector("button#pause");
pause.addEventListener("click", e =>{
    if(snakeRun >= 2 && !isOpenMenu){
        pauseSnake();
    }
});

//設置Start button的點擊事件監聽，按下後開始
let start = document.querySelector("button#start");
start.addEventListener("click", e => {
    if(snakeRun == 0 && !isOpenMenu){
        startSnake();
    }
});


//設置Reset button的點擊事件監聽，按下後重新開始遊戲
let reset = document.querySelector("button#reset");
reset.addEventListener("click", e => {
    if( snakeRun != undefined && !isOpenMenu){
        resetSnake();
        startSnake();
    }
})

//設置keydown監聽事件
let mainMenu = document.querySelector("section#main_menu");
let isOpenMenu = false;
window.addEventListener("keydown", e => {
    //設置Escape的監聽事件，按下後跳出主菜單
    if(e.key == "Escape"){
        isOpenMenu = openOrCloseMenu();
        if(isOpenMenu && snakeRun >= 2){
            pauseSnake();
        }
        else if(!isOpenMenu && snakeRun == 0){
            startSnake();
        }
        else{
            console.log("snake status: " + snakeRun);
            console.log(isOpenMenu);
        }
    }
    //設置key a的監聽事件，按下後暫停
    else if(snakeRun >= 2 && e.key == "a" && !isOpenMenu){
        pauseSnake();
        console.log("keydown a");
    }
    //設置key s的監聽事件，按下後開始
    else if(snakeRun == 0 && e.key == "s" && !isOpenMenu){
        startSnake();
        console.log("keydown s");
    }

    else if(snakeRun != undefined && e.key == "d" && !isOpenMenu){
        resetSnake();
        startSnake();
        console.log("keydown d");
    }
});

function pauseSnake() {
        clearInterval(snakeRun);
        snakeRun = 0;
        console.log("snake status: " + snakeRun);
        console.log(isOpenMenu);
        
}

function startSnake() {
        snakeRun = setInterval(animation, 200);
        console.log("snake status: " + snakeRun);
        console.log(isOpenMenu);
}

function resetSnake(){
    //清除當前的animation計時器
    clearInterval(snakeRun);
    snakeRun = 1;
    //重置蛇的方向、座標和果實的座標
    direction = "ArrowRight";
    snake = [];
    creatSnake();
    createFruit();
    //更新分數
    scoreStorage.initScore();
    printScore();
    console.log("snake status: " + snakeRun);
    console.log(isOpenMenu);
}
let home = document.querySelector("section.home");
function openOrCloseMenu(){
    let home = document.querySelector("section.home");
    if(home.style.display == "none" && (mainMenu.style.display == "none" || mainMenu.style.display == "")){
        mainMenu.style.display = "flex";
        //設置Normal button & Hell button的當前狀態
        switch(gameMode){
            case 1:
                normalBtn.style.backgroundColor = "rgb(49, 181, 225)";
                hellBtn.style.backgroundColor = "white";
                break;
            case 2:
                hellBtn.style.backgroundColor = "rgb(49, 181, 225)";
                normalBtn.style.backgroundColor = "white";
            break;
        }
        return true;
    }
    else if(home.style.display == "none" && mainMenu.style.display == "flex"){
        mainMenu.style.display = "none";
        return false;
    }
}

//設置Exit button的點擊事件監聽
let backHomeBtn =document.querySelector("button#back_home");
backHomeBtn.addEventListener("click", e => {
    let home = document.querySelector("section.home");
    home.style.display = "block";
    mainMenu.style.display = "none";
    gameMode = 0;
    resetSnake();
    selectMode.innerHTML = "Select Mode";

});

//設置Normal button的點擊事件監聽
let normalBtn = document.querySelector("button#normalBtn");
normalBtn.addEventListener("click", e => {
    e.target.style.backgroundColor = "rgb(49, 181, 225)";
    hellBtn.style.backgroundColor = "white";
    gameMode = 1;
})

//設置Hell button的點擊事件監聽
let hellBtn = document.querySelector("button#hellBtn");
hellBtn.addEventListener("click", e => {
    e.target.style.backgroundColor = "rgb(49, 181, 225)";
    normalBtn.style.backgroundColor = "white";
    gameMode = 2;
})