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

	updateUserLeaderboard(username, moves, difficulty);
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

		// Draw lines for walls
		if (cell.n === false) {
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

	this.bindKeyDown = function () {
		window.addEventListener("keydown", check, false);
	};

	this.unbindKeyDown = function () {
		window.removeEventListener("keydown", check, false);
		$("#view").off("click");
	};

	drawSprite(maze.startCoord());

	this.bindKeyDown();

	this.updateCharacterImage = function (newImage) {
		gifImage = newImage;
	};
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
	// Check if on the game.html page
	if (window.location.pathname.includes("game.html")) {
		// Add an event listener for the "Start" button
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

				const currentUsers =
					JSON.parse(sessionStorage.getItem("usernames")) || [];
				const existingUser = currentUsers.find(
					(user) => user.username === username
				);

				if (existingUser) {
					//Username already exists, show an alert
					alert("This username already exists. Please choose a different one.");
					return;
				}

				const characterSelect = document.getElementById("character-select");
				const characterValue = characterSelect.value;
				if (!characterValue) {
					alert("Please select a character.");
					return;
				}

				const difficultySelect = document.getElementById("difficulty");
				const difficultyValue = difficultySelect.value;
				if (!difficultyValue) {
					alert("Please select a difficulty.");
					return;
				}

				//if a username is entered, add it to the leaderboard
				addUser();

				//hide previous elements and display the maze canvas
				document.getElementById("mazeCanvas").style.display = "block";
				document.getElementById("prompt-container").style.display = "none";
				document.getElementById("maze-container").style.display = "none";
				document.getElementById("moves").style.display = "none";
				document.getElementById("title").style.display = "none";

				//call function to generate and display maze
				makeMaze();
			});

		// Add event listener for keydown
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

		//load wallImage
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
						console.log("Wallimage", wallImage);
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
					completeOne = true;
					console.log(completeOne);
					isComplete();
				};
			}

			// Get the selected character from the dropdown
			const characterSelect = document.getElementById("character-select");
			if (characterSelect) {
				selectedCharacter = characterSelect.value;

				// Get any changes in the dropdown selection
				characterSelect.addEventListener("change", function () {
					selectedCharacter = characterSelect.value;
					loadCharacter();
				});
			}

			// Load the character initially
			loadCharacter();

			sprite = new Image();
			sprite.src =
				`Icons/${selectedCharacter}.gif` + "?" + new Date().getTime();
			sprite.setAttribute("crossOrigin", " ");
			sprite.onload = function () {
				completeOne = true;
				console.log(completeOne);
				isComplete();
			};

			finishSprite = new Image();
			finishSprite.src = "Icons/burger.png" + "?" + new Date().getTime();
			finishSprite.setAttribute("crossOrigin", " ");
			finishSprite.onload = function () {
				completeTwo = true;
				console.log(completeTwo);
				isComplete();
			};
		};

		// Call createLeaderboard here if needed
		// createLeaderboard();
	}
};

function makeMaze() {
	if (player !== undefined && typeof player.unbindKeyDown === "function") {
		player.unbindKeyDown();
		player = null;
	}

	// call to reset maze data
	resetMazeData();

	var e = document.getElementById("difficulty");
	difficulty = e.options[e.selectedIndex].value;
	cellSize = mazeCanvas.width / difficulty;
	maze = new Maze(difficulty, difficulty);
	draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
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
	const difficultySelect = document.getElementById("difficulty");

	if (!userInput || !difficultySelect) {
		console.error("Required elements not found.");
		return;
	}

	const username = userInput.value.trim();
	const difficulty = difficultySelect.value;

	if (!username || username === "") {
		alert("Please enter a username.");
		return;
	}

	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

	usernames.unshift({ username, moves: 0, difficulty });

	if (usernames.length > 5) {
		usernames.pop();
	}

	sessionStorage.setItem("usernames", JSON.stringify(usernames));

	console.log("User added:", { username, moves: 0, difficulty });
	console.log(
		"Usernames in sessionStorage:",
		JSON.parse(sessionStorage.getItem("usernames"))
	);
}

function changeCharacterImage() {
	var selectedCharacter = document.getElementById("character-select").value;
	var imageUrl = "Icons/" + selectedCharacter + ".gif";

	document.getElementById("character-icon").src = imageUrl;
}

function updateUserLeaderboard(username, moves, difficulty) {
	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

	const existingUserIndex = usernames.findIndex(
		(user) => user.username === username
	);

	if (existingUserIndex !== -1) {
		usernames[existingUserIndex].moves = moves;
		usernames[existingUserIndex].difficulty = difficulty;
	} else {
		usernames.unshift({ username, moves, difficulty });

		if (usernames.length > 5) {
			usernames.pop();
		}
	}

	sessionStorage.setItem("usernames", JSON.stringify(usernames));

	console.log("User added or updated:", { username, moves, difficulty });
	console.log(
		"Usernames in sessionStorage:",
		JSON.parse(sessionStorage.getItem("usernames"))
	);
}
