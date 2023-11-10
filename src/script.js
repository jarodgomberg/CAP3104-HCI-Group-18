function rand(max) {
	return Math.floor(Math.random() * max);
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/* function changeBrightness(factor, sprite) {
	var virtCanvas = document.createElement("canvas");
	virtCanvas.width = 500;
	virtCanvas.height = 500;
	var context = virtCanvas.getContext("2d");
	context.drawImage(sprite, 0, 0, 500, 500);

	var imgData = context.getImageData(0, 0, 500, 500);

	for (let i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = imgData.data[i] * factor;
		imgData.data[i + 1] = imgData.data[i + 1] * factor;
		imgData.data[i + 2] = imgData.data[i + 2] * factor;
	}
	context.putImageData(imgData, 0, 0);

	var spriteOutput = new Image();
	spriteOutput.src = virtCanvas.toDataURL();
	virtCanvas.remove();
	return spriteOutput;
} */

function displayVictoryMess(moves) {
	const username = document.getElementById("user-input").value.trim();

	//create an overlay container
	const overlay = document.createElement("div");
	overlay.id = "overlay";

	//create a message element and add personalized message
	const message = `Congratulations, ${username}! You solved the maze in ${moves} steps!`;
	const messageElement = document.createElement("p");
	messageElement.textContent = message;

	//create a button to close the overlay and restart the maze
	const closeButton = document.createElement("button");
	closeButton.textContent = "OK";
	closeButton.addEventListener("click", function () {
		//close the overlay
		document.body.removeChild(overlay);

		//restart the maze
		makeMaze();
	});

	overlay.appendChild(messageElement);
	overlay.appendChild(closeButton);

	//append the overlay to the body
	document.body.appendChild(overlay);

	//add the moves to the leaderboard and display the updated leaderboard
	updateLeaderboard(username, moves);
}

function Maze(Width, Height) {
	var mazeMap;
	var width = Width;
	var height = Height;
	var startCoord, endCoord;
	var dirs = ["n", "s", "e", "w"];
	var modDir = {
		n: {
			y: -1,
			x: 0,
			o: "s",
		},
		s: {
			y: 1,
			x: 0,
			o: "n",
		},
		e: {
			y: 0,
			x: 1,
			o: "w",
		},
		w: {
			y: 0,
			x: -1,
			o: "e",
		},
	};

	this.map = function () {
		return mazeMap;
	};
	this.startCoord = function () {
		return startCoord;
	};
	this.endCoord = function () {
		return endCoord;
	};

	function genMap() {
		mazeMap = new Array(height);
		for (y = 0; y < height; y++) {
			mazeMap[y] = new Array(width);
			for (x = 0; x < width; ++x) {
				mazeMap[y][x] = {
					n: false,
					s: false,
					e: false,
					w: false,
					visited: false,
					priorPos: null,
				};
			}
		}
	}

	function defineMaze() {
		var isComp = false;
		var move = false;
		var cellsVisited = 1;
		var numLoops = 0;
		var maxLoops = 0;
		var pos = {
			x: 0,
			y: 0,
		};
		var numCells = width * height;
		while (!isComp) {
			move = false;
			mazeMap[pos.x][pos.y].visited = true;

			if (numLoops >= maxLoops) {
				shuffle(dirs);
				maxLoops = Math.round(rand(height / 8));
				numLoops = 0;
			}
			numLoops++;
			for (index = 0; index < dirs.length; index++) {
				var direction = dirs[index];
				var nx = pos.x + modDir[direction].x;
				var ny = pos.y + modDir[direction].y;

				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					//check if the tile is already visited
					if (!mazeMap[nx][ny].visited) {
						//carve through walls from this tile to next
						mazeMap[pos.x][pos.y][direction] = true;
						mazeMap[nx][ny][modDir[direction].o] = true;

						//set Currentcell as next cells Prior visited
						mazeMap[nx][ny].priorPos = pos;
						//update Cell position to newly visited location
						pos = {
							x: nx,
							y: ny,
						};
						cellsVisited++;
						//recursively call this method on the next tile
						move = true;
						break;
					}
				}
			}

			if (!move) {
				//  If it failed to find a direction,
				//  move the current position back to the prior cell and Recall the method.
				pos = mazeMap[pos.x][pos.y].priorPos;
			}
			if (numCells == cellsVisited) {
				isComp = true;
			}
		}
	}

	function defineStartEnd() {
		switch (rand(4)) {
			case 0:
				startCoord = {
					x: 0,
					y: 0,
				};
				endCoord = {
					x: height - 1,
					y: width - 1,
				};
				break;
			case 1:
				startCoord = {
					x: 0,
					y: width - 1,
				};
				endCoord = {
					x: height - 1,
					y: 0,
				};
				break;
			case 2:
				startCoord = {
					x: height - 1,
					y: 0,
				};
				endCoord = {
					x: 0,
					y: width - 1,
				};
				break;
			case 3:
				startCoord = {
					x: height - 1,
					y: width - 1,
				};
				endCoord = {
					x: 0,
					y: 0,
				};
				break;
		}
	}

	genMap();
	defineStartEnd();
	defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null, wallImage = null) {
	var map = Maze.map();
	var cellSize = cellsize;
	var drawEndMethod;
	ctx.lineWidth = cellSize / 40;

	this.redrawMaze = function (size) {
		cellSize = size;
		ctx.lineWidth = cellSize / 50;
		drawMap();
		drawEndMethod();
	};

	function drawCell(xCord, yCord, cell) {
		var x = xCord * cellSize;
		var y = yCord * cellSize;
		ctx.lineWidth = 3;

		//create walls from image
		if (wallImage !== null) {
			ctx.drawImage(wallImage, x, y, cellSize, cellSize);
		} else {
			// use drawing lines if wallImage is not provided
			if (cell.n == false) {
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x + cellSize, y);
				ctx.stroke();
			}
			if (cell.s === false) {
				ctx.beginPath();
				ctx.moveTo(x, y + cellSize);
				ctx.lineTo(x + cellSize, y + cellSize);
				ctx.stroke();
			}
			if (cell.e === false) {
				ctx.beginPath();
				ctx.moveTo(x + cellSize, y);
				ctx.lineTo(x + cellSize, y + cellSize);
				ctx.stroke();
			}
			if (cell.w === false) {
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x, y + cellSize);
				ctx.stroke();
			}
		}
	}

	function drawMap() {
		for (x = 0; x < map.length; x++) {
			for (y = 0; y < map[x].length; y++) {
				drawCell(x, y, map[x][y]);
			}
		}
	}

	function drawEndFlag() {
		var coord = Maze.endCoord();
		var gridSize = 4;
		var fraction = cellSize / gridSize - 2;
		var colorSwap = true;
		for (let y = 0; y < gridSize; y++) {
			if (gridSize % 2 == 0) {
				colorSwap = !colorSwap;
			}
			for (let x = 0; x < gridSize; x++) {
				ctx.beginPath();
				ctx.rect(
					coord.x * cellSize + x * fraction + 4.5,
					coord.y * cellSize + y * fraction + 4.5,
					fraction,
					fraction
				);
				if (colorSwap) {
					ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				} else {
					ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				}
				ctx.fill();
				colorSwap = !colorSwap;
			}
		}
	}

	function drawEndSprite() {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		var coord = Maze.endCoord();
		ctx.drawImage(
			endSprite,
			2,
			2,
			endSprite.width,
			endSprite.height,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	function clear() {
		var canvasSize = cellSize * map.length;
		ctx.clearRect(0, 0, canvasSize, canvasSize);
	}

	if (endSprite != null) {
		drawEndMethod = drawEndSprite;
	} else {
		drawEndMethod = drawEndFlag;
	}
	clear();
	drawMap();
	drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, gifImage = null) {
	var ctx = c.getContext("2d");
	var drawSprite;
	var moves = 0;
	var cellSize = _cellsize;
	var cellCoords = maze.startCoord(); //initialize cellCoords

	drawSprite = drawSpriteImg;

	function drawSpriteImg(coord) {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;

		//clear the previous position
		ctx.clearRect(
			cellCoords.x * cellSize + offsetLeft,
			cellCoords.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);

		//draw the player's sprite
		ctx.drawImage(
			gifImage,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);

		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves);
			player.unbindKeyDown();
		}
	}

	function removeSprite(coord) {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		ctx.clearRect(
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	function check(e) {
		var cell = maze.map()[cellCoords.x][cellCoords.y];
		moves++;
		switch (e.keyCode) {
			case 65:
			case 37: // west
				if (cell.w == true) {
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x - 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords);
				}
				break;
			case 87:
			case 38: // north
				if (cell.n == true) {
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x,
						y: cellCoords.y - 1,
					};
					drawSprite(cellCoords);
				}
				break;
			case 68:
			case 39: // east
				if (cell.e == true) {
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x + 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords);
				}
				break;
			case 83:
			case 40: // south
				if (cell.s == true) {
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x,
						y: cellCoords.y + 1,
					};
					drawSprite(cellCoords);
				}
				break;
		}
	}
	var bounceHeight = 10; //change bounce height
	var isMovingUp = true;

	function animateSprite() {
		frameIndex = (frameIndex + 1) % numberOfFrames;

		//calculate the bounce effect
		var bounceOffset = isMovingUp ? -bounceHeight : bounceHeight;
		var newY = cellCoords.y * cellSize + offsetLeft + bounceOffset;

		//clear the previous position
		ctx.clearRect(
			cellCoords.x * cellSize + offsetLeft,
			cellCoords.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);

		//draw player's sprite with the bounce effect
		ctx.drawImage(
			gifImage,
			frameIndex * spriteFrameWidth,
			0,
			spriteFrameWidth,
			gifImage.height,
			coord.x * cellSize + offsetLeft,
			newY,
			cellSize - offsetRight,
			cellSize - offsetRight
		);

		//toggle the direction of the bounce
		if (isMovingUp && newY <= coord.y * cellSize + offsetLeft - bounceHeight) {
			isMovingUp = false;
		} else if (!isMovingUp && newY >= coord.y * cellSize + offsetLeft) {
			isMovingUp = true;
		}

		requestAnimationFrame(animateSprite);
	}
	this.bindKeyDown = function () {
		window.addEventListener("keydown", check, false);

		$("#view").swipe({
			swipe: function (
				event,
				direction,
				distance,
				duration,
				fingerCount,
				fingerData
			) {
				console.log(direction);
				switch (direction) {
					case "up":
						check({
							keyCode: 38,
						});
						break;
					case "down":
						check({
							keyCode: 40,
						});
						break;
					case "left":
						check({
							keyCode: 37,
						});
						break;
					case "right":
						check({
							keyCode: 39,
						});
						break;
				}
			},
			threshold: 0,
		});
	};

	this.unbindKeyDown = function () {
		window.removeEventListener("keydown", check, false);
		$("#view").swipe("destroy");
	};

	drawSprite(maze.startCoord());

	this.bindKeyDown();

	this.updateCharacterImage = function (newImage) {
		gifImage = newImage;
	};

	if (gifImage !== null) {
		animateSprite();
	}
}

var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
// sprite.src = 'media/sprite.png';

window.onload = function () {
	//add an event listener for the "Start" button
	document
		.getElementById("start-button")
		.addEventListener("click", function () {
			// Check if a username is entered
			const userInput = document.getElementById("user-input");
			const username = userInput.value.trim();

			if (username === "") {
				alert("Please enter a username.");
				return;
			}

			// If a username is entered, add it to the leaderboard
			addUser();

			//hide previous elements and display the maze canvas
			document.getElementById("mazeCanvas").style.display = "block";
			document.getElementById("prompt-container").style.display = "none";
			document.getElementById("maze-container").style.display = "none";
			document.getElementById("moves").style.display = "none";
			document.getElementById("title").style.display = "none";

			//call the function to generate and display the maze
			makeMaze();
		});

	window.addEventListener(
		"keydown",
		function (e) {
			if (
				["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
					e.code
				) > -1
			) {
				e.preventDefault();
			}
		},
		false
	);

	// Load wallImage
	var wallImage = new Image();
	wallImage.src = "Images/hedge50x50.png" + "?" + new Date().getTime();
	wallImage.setAttribute("crossOrigin", " ");
	wallImage.onload = function () {
		// Load and edit sprites
		var completeOne = false;
		var completeTwo = false;
		var isComplete = () => {
			if (completeOne === true && completeTwo === true) {
				console.log("Runs");
				setTimeout(function () {
					makeMaze();
				}, 500);
			}
		};

		//load the default character
		var selectedCharacter = "adventurer";

		function loadCharacter() {
			sprite = new Image();
			sprite.src =
				`Icons/${selectedCharacter}.gif` + "?" + new Date().getTime();
			sprite.setAttribute("crossOrigin", " ");
			sprite.onload = function () {
				sprite = changeBrightness(1.2, sprite);
				completeOne = true;
				console.log(completeOne);
				isComplete();
			};
		}

		//get the selected character from the dropdown
		const characterSelect = document.getElementById("character-select");
		if (characterSelect) {
			selectedCharacter = characterSelect.value;

			//get any changes in the dropdown selection
			characterSelect.addEventListener("change", function () {
				selectedCharacter = characterSelect.value;
				loadCharacter();
			});
		}

		// Load the character initially
		loadCharacter();

		sprite = new Image();
		sprite.src = `Icons/${selectedCharacter}.gif` + "?" + new Date().getTime();
		sprite.setAttribute("crossOrigin", " ");
		sprite.onload = function () {
			sprite = changeBrightness(1.2, sprite);
			completeOne = true;
			console.log(completeOne);
			isComplete();
		};

		finishSprite = new Image();
		finishSprite.src = "Icons/burger.png" + "?" + new Date().getTime();
		finishSprite.setAttribute("crossOrigin", " ");
		finishSprite.onload = function () {
			finishSprite = changeBrightness(1.1, finishSprite);
			completeTwo = true;
			console.log(completeTwo);
			isComplete();
		};
	};

	// Call createLeaderboard here if needed
	createLeaderboard();
};

function makeMaze() {
	if (player != undefined) {
		player.unbindKeyDown();
		player = null;
	}

	// call to reset maze data
	resetMazeData();

	var e = document.getElementById("difficulty");
	difficulty = e.options[e.selectedIndex].value;
	cellSize = mazeCanvas.width / difficulty;
	maze = new Maze(difficulty, difficulty);
	draw = new DrawMaze(maze, ctx, cellSize, finishSprite, wallImage);
	player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);

	var wallImage = new Image();
	wallImage.src = "Images/hedge50x50.png" + "?" + new Date().getTime();
	wallImage.setAttribute("crossOrigin", " ");
	wallImage.onload = function () {
		draw = new DrawMaze(maze, ctx, cellSize, finishSprite, wallImage);
		player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
	};
}

//function to reset maze data
function resetMazeData() {
	if (maze && maze.map) {
		const map = maze.map();
		for (let x = 0; x < map.length; x++) {
			for (let y = 0; y < map[x].length; y++) {
				for (const direction in map[x][y]) {
					if (direction !== "visited" && direction !== "priorPos") {
						map[x][y][direction] = false;
					}
				}
				map[x][y].visited = false;
				map[x][y].priorPos = null;
			}
		}
	}
}
//function to add usernames entered in game window to the leaderboard
function addUser() {
	const userInput = document.getElementById("user-input");
	const username = userInput.value;

	if (username.trim() === "") {
		alert("Please enter a username.");
		return;
	}

	// Get existing usernames
	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

	// update username list (add new)
	usernames.unshift(username);

	// maintain 5 users on leaderboard
	if (usernames.length > 5) {
		usernames.pop();
	}

	// use json.stringify to store list of users per current session
	sessionStorage.setItem("usernames", JSON.stringify(usernames));

	console.log("Usernames added:", username);
	console.log(
		"Usernames in sessionStorage:",
		JSON.parse(sessionStorage.getItem("usernames"))
	);
	createLeaderboard();
}

//function to add all users to leaderboard (in order of last entered)
function createLeaderboard() {
	const leaderboard = document.getElementById("score-list");

	if (!leaderboard) {
		console.error("Leaderboard element not found.");
		return;
	}

	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

	// Check if the usernames array is defined
	if (!usernames || !Array.isArray(usernames)) {
		console.error("Usernames array not found or not an array.");
		return;
	}

	leaderboard.innerHTML = "";

	for (let i = 0; i < usernames.length; i++) {
		const listItem = document.createElement("li");
		const markElement = document.createElement("mark");
		markElement.textContent = usernames[i];
		listItem.appendChild(markElement);
		const smallElement = document.createElement("small");
		smallElement.textContent = "0";
		listItem.appendChild(smallElement);
		leaderboard.appendChild(listItem);
	}
}

function updateLeaderboard(username, moves) {
	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];
	const newEntry = { username, moves };
	usernames.unshift(newEntry);

	if (usernames.length > 5) {
		usernames.pop();
	}

	sessionStorage.setItem("usernames", JSON.stringify(usernames));

	createLeaderboard();
}

function changeCharacterImage() {
	var selectedCharacter = document.getElementById("character-select").value;
	var imageUrl = "Icons/" + selectedCharacter + ".gif";

	document.getElementById("character-icon").src = imageUrl;
}
