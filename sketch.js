/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
var gameChar_x;
var gameChar_y;
var floorPosY;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;
var isReached;


var Cloud;
var clouds = [];

var Mountain;
var mountains = [];

var Tree;
var trees = [];

var Canyon;
var canyons = [-920, -470, 250, 940, 1620];

var Carrot;
var carrots = [];

var Platform;
var platforms = [-920, -470, 250, 940, 1620];

var Enemy;
var enemies = [];

var flagpole;
var lives;
var lifeToken;
var gameScore;
var carrotCounter;

var gameEnded;


var jumpSound;
var fallSound;
var collectSound;
var gameOverSound;
var winSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    fallSound = loadSound('assets/fall.mp3');
    fallSound.setVolume(0.1);
        
    collectSound = loadSound('assets/collect.wav');
    collectSound.setVolume(0.3);
        
    gameOverSound = loadSound('assets/gameOver.wav');
    gameOverSound.setVolume(0.1);
    
    winSound = loadSound('assets/win.wav');
    winSound.setVolume(0.5);
}



function setup()
{
	createCanvas(1024, 576);
    floorPosY = height * 3/4;
    
    startGame();
    lives=3;
    
    //cloud
    for (var i=-8; i < 10; i++ )
    {
        clouds.push(new Cloud(i*random(360,500), random(100,150)));
    }
    
    //mountain
    for (var i= -4; i < 10; i++)
    {
        mountains.push(new Mountain(i*700))
    }
    
    //tree
    for (var i=-4; i < 10; i++ )
    {
        trees.push(new Tree(i*600));
    }
    
    //canyon 
    for (i=0; i < canyons.length; i++)
    {
        canyons[i] = new Canyon(canyons[i]);
    }
    
    //carrot
    for (i=-4; i<10; i++)
    {
        carrots.push(new Carrot(i*(random(20,1000)),false));
    }
    
    //platform
    for (i=0; i < platforms.length; i++)
    {
        platforms[i] = new Platform(platforms[i]);
    }
    
    //enemies
    for (i=0; i < 7; i++)
    {
        enemies.push(new Enemy(i*random(-1500,2000), random(50,100)));
    }
    

}





function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPosY;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isJumping = false;
    

    flagpole = {posX:2100, isReached:false};
    
    lifeToken = {posX: 30, posY: 30}; 
    
    carrotCounter = {posX:width-60, posY:30};

    gameScore = 0;
    
    gameEnded = false;
    
    char = {head_rad:25, face_rad:18, eye_rad:2,
       smile_rad:7, smile1:0, smile2:3.14,
       hand_rad:6, body_width:22, body_length:40, 
       feet_length:12, feet_width:5.5};   
      
}

function draw()
{
    background(135,206,250); //fill the sky blue

	noStroke();
    //snow
    fill(255);
	rect(0, floorPosY, width, height); 
    //soil
    fill(205,133,63); 
    rect(0, floorPosY+23, width, height);

    
    push();
    translate(scrollPos,0);

	// Draw clouds.
    for (var i=0; i<clouds.length; i++)
    {
        clouds[i].drawCloud();
    }
    
	// Draw mountains.
    for (var i=0; i<mountains.length; i++)
    {
        mountains[i].drawMountain();
    }
    
	// Draw trees.
    for (var i=0; i<trees.length; i++)
    {
        trees[i].drawTree();
    }
   
	// Draw and check canyons.
    for (var i=0; i<canyons.length; i++)
    {
        canyons[i].drawCanyon();
        canyons[i].checkCanyon();        
    }

    //draw and check enemies
    for (var i=0; i<enemies.length; i++)
    {
        enemies[i].drawEnemy();
        
        var isContact = enemies[i].checkEnemy(gameChar_world_x, gameChar_y);
        
        if (isContact == true)
            
            {
                lives--;

                if(lives>0)
                    {
                        startGame();
                        fallSound.play();
                    }
                if (lives ==0)
                    {
                        gameEnded=true;
                        console.log("Oh no.. Enemy... :(");
                        gameOverSound.play();
                    }
            }
    }
    
	// Draw and check collectable items.
    for (var i=0; i<carrots.length; i++)
    {
        if (carrots[i].isFound==false)
            {
                carrots[i].drawCarrot();
                carrots[i].checkCarrot();
            }
    }
    
    //draw platforms
    for (var i=0 ; i<platforms.length; i++)
    {
        platforms[i].drawPlatform();
    }

    //draw and check flagpole
    renderFlagpole();
    if (flagpole.isReached ==false)
    {
            checkFlagpole();
    }
    
    
    pop();
    

	//game character.
	drawGameChar();
    
    //life hearts
    fill(0,0,0,50)
    rect(15,10,125,55);
    drawLifeToken();
    
    fill(0,0,0,50)
    rect(900,12,105,72);
    fill(0);
    noStroke;
    textSize(14);
    text("Score: " + gameScore, width-100, 75);
    drawCarrotCounter();
    
    fill(0);
    text("Press F5 to restart..." , width-140, height-20);
    
    //check character death
    checkPlayerDeath();
        
    
    //game over
    if (lives<1)
    {
        fill(0,60)
        rect(width/2-180,height/2-50,340,130);
        textSize(28);
        fill(0,255,255)
        text("GAME OVER",width/2-90,height/2);
        text("Press Space to continue",width/2-160,height/2+50);
        gameEnded = true;
        return;
    }
    
    if (flagpole.isReached==true)
    {
        fill(0,60)
        rect(width/2-180,height/2-50,340,130);
        textSize(28);
        fill(255,174,251);
        text("LEVEL COMPLETE!",width/2-130,height/2);
        text("Press Space to continue",width/2-160,height/2+50);
        gameEnded = true;
        return;
    }
    
    
        
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
	// Logic to make the game character rise and fall.
    if (isJumping)
    {
        gameChar_y-=4;
    }
    
    if ( (floorPosY > gameChar_y) && (gameChar_y == (floorPosY-100) || gameChar_y <= (floorPosY-196)) )
    {
        var isContact = false;
        for (var i=0; i<platforms.length; i++)
        {
            if (platforms[i].checkPlatform(gameChar_world_x,gameChar_y))
                {
                    isContact = true;
                    break;
                }
        }
        
        if (isContact==false)
            {
                isFalling=true;
            }
        
        isJumping=false;
        
    }

    
    //to fall back to ground
    if (isFalling && (floorPosY > gameChar_y) )
    {
        gameChar_y+=4;
    }
    
    else
    {
        isFalling=false; 
    }
    
    if (isPlummeting)
    {
        gameChar_y+=5;    
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
}



// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{

//	console.log("press" + keyCode);
//	console.log("press" + key);
    
    if(keyCode == 65 || keyCode == 37) //left
	{
		isLeft = true;
	}

	if(keyCode == 68 || keyCode == 39) //right
	{
		isRight = true;
	}
    
    if (keyCode == 32 || keyCode == 87 || keyCode == 38) //up, space
    {
     if (gameChar_y == floorPosY || gameChar_y == floorPosY-100)
        {
            isJumping=true;
            jumpSound.play();
        }
    }
    
    if (keyCode == 32 && gameEnded == true)
    {
        startGame();
        lives =3;
    }

}

function keyReleased()
{

//	console.log("release" + keyCode);
//	console.log("release" + key);
    
    if(keyCode == 65 || keyCode == 37)
	{
		isLeft = false;
	}

	if(keyCode == 68 || keyCode == 39)
	{
		isRight = false;
	}

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
   //left ear
    fill(253,208,255);
    triangle(gameChar_x+6,gameChar_y-47,
             gameChar_x-11,gameChar_y-71,
             gameChar_x-6,gameChar_y-77);
    triangle(gameChar_x-10,gameChar_y-72,
             gameChar_x-17,gameChar_y-64,
             gameChar_x-4,gameChar_y-67);    
    //right ear
    triangle(gameChar_x-6,gameChar_y-47,
             gameChar_x+12,gameChar_y-71,
             gameChar_x+7,gameChar_y-77);
    //head - head_rad:25, face_rad:18
    ellipse(gameChar_x,gameChar_y-52,char.head_rad-8,char.head_rad);
    //face
    fill(255,228,181);
    ellipse(gameChar_x-5,gameChar_y-52,char.head_rad-17,char.head_rad-8);
    fill(0);
    //eyes
    ellipse(gameChar_x-5,gameChar_y-53,char.eye_rad,char.eye_rad);
    //right arm
    fill(245,159,247);    
    triangle(gameChar_x-2,gameChar_y-34,
             gameChar_x+18,gameChar_y-26,
             gameChar_x+15,gameChar_y-21);
    //hand
    fill(255,228,181);
    ellipse(gameChar_x+17,gameChar_y-23.5,char.hand_rad,char.hand_rad);

    //right leg
    fill(245,159,247);
    ellipse(gameChar_x+6,gameChar_y-10,char.feet_width,char.feet_length);
    //body
    fill(253,208,255);
    ellipse(gameChar_x,gameChar_y-25,char.body_width-2,char.body_length-3);
    //left arm
    fill(245,159,247);
    triangle(gameChar_x,gameChar_y-27,
             gameChar_x-15,gameChar_y-39,
             gameChar_x-17,gameChar_y-34);     
    //left hand
    fill(255,228,181);
    ellipse(gameChar_x-18,gameChar_y-37,char.hand_rad,char.hand_rad);
    //left leg
    fill(245,159,247);
    ellipse(gameChar_x-8,gameChar_y-11,char.feet_length,char.feet_width);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
 //left ear
    fill(253,208,255);
    triangle(gameChar_x+6,gameChar_y-47,
             gameChar_x-11,gameChar_y-71,
             gameChar_x-6,gameChar_y-77);
    triangle(gameChar_x-10,gameChar_y-72,
             gameChar_x-17,gameChar_y-64,
             gameChar_x-4,gameChar_y-67);    
    //right ear
    triangle(gameChar_x-6,gameChar_y-47,
             gameChar_x+12,gameChar_y-71,
             gameChar_x+7,gameChar_y-77);
    //head - head_rad:25, face_rad:18
    ellipse(gameChar_x,gameChar_y-52,char.head_rad-8,char.head_rad);
    //face
    fill(255,228,181);
    ellipse(gameChar_x+5,gameChar_y-52,char.head_rad-17,char.head_rad-8);
    fill(0);
    //eyes
    ellipse(gameChar_x+5,gameChar_y-53,char.eye_rad,char.eye_rad);
    //right arm
    fill(245,159,247);    
    triangle(gameChar_x,gameChar_y-27,
             gameChar_x+15,gameChar_y-39,
             gameChar_x+17,gameChar_y-34);
    //hand
    fill(255,228,181);
    ellipse(gameChar_x+18,gameChar_y-37,char.hand_rad,char.hand_rad);
    //left leg
    fill(245,159,247);
    ellipse(gameChar_x-8,gameChar_y-11,char.feet_width,char.feet_length);
    //body
    fill(253,208,255);
    ellipse(gameChar_x,gameChar_y-25,char.body_width-2,char.body_length-3);
    //left arm
    fill(245,159,247);
    triangle(gameChar_x+2,gameChar_y-37,
             gameChar_x-18,gameChar_y-29,
             gameChar_x-15,gameChar_y-24);    
    //left hand
    fill(255,228,181);
    ellipse(gameChar_x-17,gameChar_y-26.5,char.hand_rad,char.hand_rad);
    //right leg
    fill(245,159,247);
    ellipse(gameChar_x+6,gameChar_y-10,char.feet_length,char.feet_width);
	}
	else if(isLeft)
	{
		// add your walking left code
//left ear
    fill(253,208,255);
    triangle(gameChar_x+6,gameChar_y-44,
             gameChar_x-11,gameChar_y-68,
             gameChar_x-6,gameChar_y-74);
    triangle(gameChar_x-10,gameChar_y-69,
             gameChar_x-17,gameChar_y-61,
             gameChar_x-4,gameChar_y-64);    
    //right ear
    triangle(gameChar_x-6,gameChar_y-44,
             gameChar_x+12,gameChar_y-68,
             gameChar_x+7,gameChar_y-74);
    //head - head_rad:25, face_rad:18
    ellipse(gameChar_x,gameChar_y-49,char.head_rad-8,char.head_rad);
    //face
    fill(255,228,181);
    ellipse(gameChar_x-5,gameChar_y-49,char.head_rad-17,char.head_rad-8);
    fill(0);
    //eyes
    ellipse(gameChar_x-5,gameChar_y-50,char.eye_rad,char.eye_rad);
    //left arm
    fill(245,159,247);
    triangle(gameChar_x+2,gameChar_y-34,
             gameChar_x-18,gameChar_y-26,
             gameChar_x-15,gameChar_y-21);
    //left hand
    fill(255,228,181);
    ellipse(gameChar_x-17,gameChar_y-23.5,char.hand_rad,char.hand_rad);
    //right leg
    fill(245,159,247);
    ellipse(gameChar_x+6,gameChar_y-5,char.feet_width,char.feet_length);
    //body
    fill(253,208,255);
    ellipse(gameChar_x,gameChar_y-20,char.body_width-2,char.body_length);
    //right arm
    fill(245,159,247);
    triangle(gameChar_x-2,gameChar_y-34,
             gameChar_x+18,gameChar_y-26,
             gameChar_x+15,gameChar_y-21);
    //hand
    fill(255,228,181);
    ellipse(gameChar_x+17,gameChar_y-23.5,char.hand_rad,char.hand_rad);
    //left leg
    fill(245,159,247);
    ellipse(gameChar_x-6,gameChar_y-5,char.feet_width,char.feet_length);

	}
	else if(isRight)
	{
		// add your walking right code
//left ear
    fill(253,208,255);
    triangle(gameChar_x+6,gameChar_y-44,
             gameChar_x-11,gameChar_y-68,
             gameChar_x-6,gameChar_y-74);
    triangle(gameChar_x-10,gameChar_y-69,
             gameChar_x-17,gameChar_y-61,
             gameChar_x-4,gameChar_y-64);    
    //right ear
    triangle(gameChar_x-6,gameChar_y-44,
             gameChar_x+12,gameChar_y-68,
             gameChar_x+7,gameChar_y-74);
    //head - head_rad:25, face_rad:18
    ellipse(gameChar_x,gameChar_y-49,char.head_rad-8,char.head_rad);
    //face
    fill(255,228,181);
    ellipse(gameChar_x+5,gameChar_y-49,char.head_rad-17,char.head_rad-8);
    fill(0);
    //eyes
    ellipse(gameChar_x+5,gameChar_y-50,char.eye_rad,char.eye_rad);
    //right arm
    fill(245,159,247);
    triangle(gameChar_x-2,gameChar_y-34,
             gameChar_x+18,gameChar_y-26,
             gameChar_x+15,gameChar_y-21);
    //hand
    fill(255,228,181);
    ellipse(gameChar_x+17,gameChar_y-23.5,char.hand_rad,char.hand_rad);
    //left leg
    fill(245,159,247);
    ellipse(gameChar_x-6,gameChar_y-5,char.feet_width,char.feet_length);
    //body
    fill(253,208,255);
    ellipse(gameChar_x,gameChar_y-20,char.body_width-2,char.body_length);
    //left arm
    fill(245,159,247);
    triangle(gameChar_x+2,gameChar_y-34,
             gameChar_x-18,gameChar_y-26,
             gameChar_x-15,gameChar_y-21);
    //left hand
    fill(255,228,181);
    ellipse(gameChar_x-17,gameChar_y-23.5,char.hand_rad,char.hand_rad);
    //right leg
    fill(245,159,247);
    ellipse(gameChar_x+6,gameChar_y-5,char.feet_width,char.feet_length);
	}
	else if(isFalling || isPlummeting || isJumping)
	{
		// add your jumping facing forwards code
 //left ear
    fill(253,208,255);
    triangle(gameChar_x,gameChar_y-44,
             gameChar_x-18,gameChar_y-68,
             gameChar_x-12,gameChar_y-74);
    triangle(gameChar_x-17,gameChar_y-69,
             gameChar_x-24,gameChar_y-61,
             gameChar_x-10,gameChar_y-64);    
    //right ear
    triangle(gameChar_x,gameChar_y-44,
             gameChar_x+19,gameChar_y-68,
             gameChar_x+12,gameChar_y-74);
    //head
    ellipse(gameChar_x,gameChar_y-49,char.head_rad,char.head_rad);
    //face
    fill(255,228,181);
    ellipse(gameChar_x,gameChar_y-49,char.face_rad,char.face_rad);
    fill(0);
    //eyes
    ellipse(gameChar_x-3,gameChar_y-50,char.eye_rad,char.eye_rad);
    ellipse(gameChar_x+3,gameChar_y-50,char.eye_rad,char.eye_rad);
    //smile
    arc(gameChar_x,gameChar_y-47, char.smile_rad,char.smile_rad, char.smile1,char.smile2); 
    //arms
    fill(253,208,255);
    triangle(gameChar_x,gameChar_y-24,
             gameChar_x-15,gameChar_y-36,
             gameChar_x-17,gameChar_y-31);
    triangle(gameChar_x,gameChar_y-24,
             gameChar_x+15,gameChar_y-36,
             gameChar_x+17,gameChar_y-31);
    //hand
    fill(255,228,181);
    ellipse(gameChar_x-18,gameChar_y-34,char.hand_rad,char.hand_rad);
    ellipse(gameChar_x+18,gameChar_y-34,char.hand_rad,char.hand_rad);
    //right leg
    fill(245,159,247);
    ellipse(gameChar_x+6,gameChar_y-5,char.feet_width,char.feet_length);
    //body
    fill(253,208,255);
    ellipse(gameChar_x,gameChar_y-20,char.body_width,char.body_length);
    //left leg
    fill(245,159,247);
    ellipse(gameChar_x-6,gameChar_y-5,char.feet_width,char.feet_length);
	}
	else
	{
		// add your standing front facing code
    //left ear
    fill(253,208,255);
    triangle(gameChar_x,gameChar_y-44,
             gameChar_x-18,gameChar_y-68,
             gameChar_x-12,gameChar_y-74);
    triangle(gameChar_x-17,gameChar_y-69,
             gameChar_x-24,gameChar_y-61,
             gameChar_x-10,gameChar_y-64);    
    //right ear
    triangle(gameChar_x,gameChar_y-44,
             gameChar_x+19,gameChar_y-68,
             gameChar_x+12,gameChar_y-74);
    //head
    ellipse(gameChar_x,gameChar_y-49,char.head_rad,char.head_rad);
    //face
    fill(255,228,181);
    ellipse(gameChar_x,gameChar_y-49,char.face_rad,char.face_rad);
    fill(0);
    ellipse(gameChar_x-3,gameChar_y-50,char.eye_rad,char.eye_rad);
    ellipse(gameChar_x+3,gameChar_y-50,char.eye_rad,char.eye_rad);
    arc(gameChar_x,gameChar_y-47, char.smile_rad,char.smile_rad, char.smile1,char.smile2); 
    //arms
    fill(253,208,255);
    triangle(gameChar_x,gameChar_y-34,
             gameChar_x-20,gameChar_y-26,
             gameChar_x-17,gameChar_y-21);
    triangle(gameChar_x,gameChar_y-34,
             gameChar_x+20,gameChar_y-26,
             gameChar_x+17,gameChar_y-21);
    //hand
    fill(255,228,181);
    ellipse(gameChar_x-18.5,gameChar_y-23.5,char.hand_rad,char.hand_rad);
    ellipse(gameChar_x+18.5,gameChar_y-23.5,char.hand_rad,char.hand_rad);
    //body
    fill(253,208,255);
    ellipse(gameChar_x,gameChar_y-20,char.body_width,char.body_length);
    //legs
    fill(245,159,247);
    ellipse(gameChar_x-7,gameChar_y,char.feet_length,char.feet_width);
    ellipse(gameChar_x+7,gameChar_y,char.feet_length,char.feet_width);
	}
    
}

//functions to draw scenary
function Cloud(x,y)
{
        this.x = x;
        this.y = y;
        this.rad = 70;
        this.drawCloud = function()
        { 
            fill(255);
            ellipse(this.x-40, this.y, this.rad*0.7, this.rad*0.7);
            ellipse(this.x, this.y-10, this.rad, this.rad);
            ellipse(this.x+40, this.y, this.rad*0.7, this.rad*0.7);
            ellipse(this.x, this.y+10, this.rad, this.rad);
            ellipse(this.x+70, this.y, this.rad*0.45, this.rad*0.45);
        }
    }

function Mountain(x)
{
    this.x = x;
    this.y = 250
    this.drawMountain = function()
        {
        //mountain
        fill(195,196,206);
        triangle(this.x, this.y, 
                 this.x-80, this.y+182, 
                 this.x+80, this.y+182); 

        fill(165,165,176);
        triangle(this.x, this.y, 
                 this.x-80+60, this.y+182, 
                 this.x+80, this.y+182);

        //snow
        fill(250,251,255);
        beginShape();
        vertex(this.x,this.y);
        vertex(this.x-80+58,this.y+182-132);
        vertex(this.x+80-98,this.y+182-117);
        vertex(this.x-6,this.y+50);    
        endShape();

        fill(224,226,238);
        beginShape();
        vertex(this.x,this.y);
        vertex(this.x-80+74,this.y+182-132);
        vertex(this.x+80-67,this.y+182-113);
        vertex(this.x-6+28,this.y+50);    
        endShape();

        //mountain 2

        fill(195,196,206);
        triangle(this.x+100, this.y-60, 
                 this.x-80+80, this.y+182, 
                 this.x+80+120, this.y+182); 

        fill(165,165,176);
        triangle(this.x+100, this.y-60, 
                 this.x-80+160, this.y+182, 
                 this.x+80+120, this.y+182); 

        //snow 

        fill(250,251,255);
        beginShape();
        vertex(this.x+100, this.y-60);
        vertex(this.x-80+100+58, this.y+182-56-132);
        vertex(this.x+80+101-98, this.y+182-53-117);
        vertex(this.x-6+102, this.y+50-56); 
        endShape();

        fill(224,226,238);
        beginShape();
        vertex(this.x+100, this.y-60);
        vertex(this.x-80+101+74, this.y+182-55-132);
        vertex(this.x+80+103-67, this.y+182-53-113);
        vertex(this.x-6+101+28, this.y+50-56);    
        endShape();

        }

}

function Tree(x)
{
    this.x = x;
    this.y = floorPosY-177;
    this.width = 120;
    this.height = 100;
    this.drawTree = function()
    {
        fill(182,137,59);
        triangle(this.x, this.y, 
                 this.x-20, this.y+177, 
                 this.x+20, this.y+177);

        //left branch, right branch
        triangle(this.x-60, this.y+100,
                 this.x-20+5, this.y+177-37,
                 this.x+20-33, this.y+177-57);

        triangle(this.x+50, this.y+90,
                 this.x-20+30, this.y+177-72,
                 this.x+20-7, this.y+177-52);

        fill(52,132,17);
        ellipse(this.x, this.y+20, 120, 100);

        //leaves on left branch, right branch
        ellipse(this.x-60, this.y+100, this.width-80, this.height-60); 
        ellipse(this.x+50, this.y+90, this.width-90, this.height-70);
}
}

//functions to draw and check for interaction
function Canyon(x)
{
    this.x = x;
    this.y = floorPosY;
    this.drawCanyon = function()
    { 
        fill(135,206,250);
        triangle(this.x,this.y,
                 this.x+90,this.y,
                 this.x+45,height+160);
    }
    this.checkCanyon = function()
    {
       for (var i=0; i < canyons.length; i++)
        {if ( this.x <= gameChar_world_x && gameChar_world_x <= this.x+90 && gameChar_y >= floorPosY)
            {
                isPlummeting = true;
                gameChar_y+=5;
                console.log("help!");
            }
        } 
    }
}

function Carrot(x,found)
{
    this.x = x;
    this.y = 420;
    this.isFound = found;
    this.drawCarrot = function()
    {
        //carrot leaves
        fill(25,94,0);
        triangle(this.x+5, this.y+8, this.x-50+70, this.y+25-35, this.x+8+17, this.y+25-30);
        triangle(this.x+5, this.y+8, this.x-50+70, this.y+25-35, this.x+8+17, this.y+25-30);
        triangle(this.x+6, this.y+10, this.x-50+76,this.y+25-26, this.x+8+20, this.y+25-20); 
        triangle(this.x+7, this.y+12,this.x-50+78, this.y+25-17, this.x+8+20, this.y+25-11); 

        //carrot body
        fill(255,171,43);
        triangle(this.x, this.y, this.x-50, this.y+25, this.x+8, this.y+25);
        ellipse(this.x+5, this.y+12,26,26); 
    }
    this.checkCarrot = function()
    {
        if (dist(gameChar_world_x,gameChar_y,this.x,this.y+20) <=20 )
            {
                this.isFound = true;
                gameScore+=1;
                console.log("Carrot!");
                collectSound.play();
            }   

}    
}

function Platform(x)
{
    this.x = x-40;
    this.y = floorPosY-98;
    this.length = random(80,200);
    this.drawPlatform = function()
    {
        fill(12,83,131);
        rect(this.x, this.y, this.length, 10);
    }
    this.checkPlatform = function(gameChar_world_x)
    {
        if (gameChar_world_x > this.x && gameChar_world_x < this.x + this.length )
            {
                return true;
                
            }
        return false;
    }
}

function Enemy (x,range)
{
    this.x = x; 
    this.y = floorPosY-5;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;

    //move away from character spawn
    if (this.currentX <= width/2 +100 && this.currentX >= width/2-100  )
    {
        this.currentX = width/2+500
    }
    
    //update current location
    this.update = function()
    {
        this.currentX += this.inc;
        if (this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if (this.currentX < this.x)
            {
                this.inc = 1;
            }
    }
    
    this.drawEnemy = function()
    {
        this.update();  
        fill(152,87,55);
        triangle(this.currentX+7,this.y-5,
               this.currentX+12,this.y-15,
               this.currentX+17,this.y-5);

        fill(134,77,48);
        rect(this.currentX+3,this.y-5,18,5);

        fill(118,68,43);
        rect(this.currentX-1, this.y,26,5);
        
    }
    
    this.checkEnemy = function(gameChar_world_x, gameChar_y)
    {
        var d = dist (gameChar_world_x, gameChar_y, this.currentX, this.y)
        
        if(d<26)
            {
                return true;
            }
        else return false;
    }
}


//function to draw flagpole
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.posX, floorPosY, flagpole.posX, floorPosY-250);
    
    if (flagpole.isReached==true)
    {
    noStroke();
    fill(52,132,17); //leaves
    triangle(flagpole.posX+3, floorPosY-250, 
            flagpole.posX+3, floorPosY-200,
            flagpole.posX+53,floorPosY-225);
    fill(255,171,43); //body
    triangle(flagpole.posX+12, floorPosY-250, 
            flagpole.posX+12, floorPosY-200,
            flagpole.posX+62,floorPosY-225);
    }
    else
    {
    noStroke();
    fill(52,132,17); //leaves
    triangle(flagpole.posX+3, floorPosY-50, 
            flagpole.posX+3, floorPosY,
            flagpole.posX+53,floorPosY-25);
    fill(255,171,43); //body
    triangle(flagpole.posX+12, floorPosY-50, 
            flagpole.posX+12, floorPosY,
            flagpole.posX+62,floorPosY-25);
    }
    
    pop();
}

//fucntion to check character has reached flagpole
function checkFlagpole()
{
    if(dist(gameChar_world_x, gameChar_y, flagpole.posX, gameChar_y) <= 15)
        {
            flagpole.isReached=true;
            winSound.play();
        }
}

//function to draw life tokens
function drawLifeToken()
{
    for (i=0; i<lives; i++)
        {

            
            fill(255,117,237);
            ellipse(lifeToken.posX+i*40,lifeToken.posY,15);
            ellipse(lifeToken.posX+i*40+15,lifeToken.posY,15);
            triangle(lifeToken.posX+i*40-8.2,lifeToken.posY+1,
                    lifeToken.posX+i*40+8.2,lifeToken.posY+24,
                    lifeToken.posX+i*40+15+8.2,lifeToken.posY+1);
            
        }
}

function drawCarrotCounter()
{


    //carrot leaves
    fill(25,94,0);
    triangle(carrotCounter.posX+5, carrotCounter.posY+8, carrotCounter.posX-50+70, carrotCounter.posY+25-35, carrotCounter.posX+8+17, carrotCounter.posY+25-30);
    triangle(carrotCounter.posX+5, carrotCounter.posY+8, carrotCounter.posX-50+70, carrotCounter.posY+25-35, carrotCounter.posX+8+17, carrotCounter.posY+25-30);
    triangle(carrotCounter.posX+6, carrotCounter.posY+10, carrotCounter.posX-50+76,carrotCounter.posY+25-26, carrotCounter.posX+8+20, carrotCounter.posY+25-20); 
    triangle(carrotCounter.posX+7, carrotCounter.posY+12,carrotCounter.posX-50+78, carrotCounter.posY+25-17, carrotCounter.posX+8+20, carrotCounter.posY+25-11); 

    //carrot body
    fill(255,171,43);
    triangle(carrotCounter.posX, carrotCounter.posY, carrotCounter.posX-50, carrotCounter.posY+25, carrotCounter.posX+8, carrotCounter.posY+25);
    ellipse(carrotCounter.posX+5, carrotCounter.posY+12,26,26); 

}

//check if player died
function checkPlayerDeath()
{
    if(gameChar_y > height)
        {
            lives--;
            
            if(lives>0)
                {
                    startGame();
                    fallSound.play();
                }
            if (lives == 0)
                {
                    gameEnded = true;
                    console.log("Oh no.. Game over... :(");
                    gameOverSound.play();
                }
        }
}
