const GameDifficulty=[20,50,70]; // Array defining the number of random moves for each difficulty level

class Game {
    difficulty; // Difficulty level (number of moves)
    cols=3; // Number of columns in the puzzle
    rows=3; // Number of rows in the puzzle
    count; // Total number of blocks
    blocks; // HTML elements representing the puzzle blocks
    emptyBlockCoords=[2,2]; // Coordinates of the empty space in the puzzle
    indexes=[]; // Array to track the current positions of the blocks

    constructor(difficultyLevel=1) {
        // Initialize game with specified difficulty level
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.count=this.cols*this.rows;
        this.blocks=document.getElementsByClassName("puzzle_block"); // Grab the blocks from the document
        this.init(); // Set up the initial puzzle state
    }

    // Position each block in its proper position
    init() {
        for(let y=0; y<this.rows; y++) {
            for(let x=0; x<this.cols; x++) {
                let blockIdx=x+y*this.cols; // Calculate block index based on coordinates
                if(blockIdx+1>=this.count) break; // Skip if index is out of range
                let block=this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx, x, y); // Position block at (x, y)
                block.addEventListener('click', (e) => this.onClickOnBlock(blockIdx)); // Add click event listener
                this.indexes.push(blockIdx); // Track block index
            }
        }
        this.indexes.push(this.count-1); // Add the empty block index to the array
        this.randomize(this.difficulty); // Shuffle the puzzle based on difficulty level
    }

    // Move a random block (x iterationCount)
    randomize(iterationCount) {
        for(let i=0; i<iterationCount; i++) {
            let randomBlockIdx=Math.floor(Math.random()*(this.count-1)); // Choose a random block index
            let moved=this.moveBlock(randomBlockIdx); // Attempt to move the block
            if(!moved) i--; // Retry if the block could not be moved
        }
    }

    // Move a block and return true if the block has moved
    moveBlock(blockIdx) {
        let block=this.blocks[blockIdx];
        let blockCoords=this.canMoveBlock(block); // Check if the block can be moved
        if(blockCoords != null) {
            this.positionBlockAtCoord(blockIdx, this.emptyBlockCoords[0], this.emptyBlockCoords[1]); // Move block to empty space
            this.indexes[this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols]; // Update indexes
            this.emptyBlockCoords[0] = blockCoords[0]; // Update empty block coordinates
            this.emptyBlockCoords[1] = blockCoords[1];
            return true; // Move was successful
        }
        return false; // Move was not successful
    }

    // Return the block coordinates if it can move, else return null
    canMoveBlock(block) {
        let blockPos=[parseInt(block.style.left), parseInt(block.style.top)]; // Get block position
        let blockWidth=block.clientWidth; // Get block width
        let blockCoords=[blockPos[0] / blockWidth, blockPos[1] / blockWidth]; // Calculate block coordinates
        let diff=[Math.abs(blockCoords[0] - this.emptyBlockCoords[0]), Math.abs(blockCoords[1] - this.emptyBlockCoords[1])]; // Calculate difference from empty block
        let canMove=(diff[0] == 1 && diff[1] == 0) || (diff[0] == 0 && diff[1] == 1); // Check if the block is adjacent to the empty space
        if(canMove) return blockCoords; // Block can move
        else return null; // Block cannot move
    }

    // Position the block at a certain coordinates
    positionBlockAtCoord(blockIdx, x, y) {
        let block=this.blocks[blockIdx];
        block.style.left=(x * block.clientWidth) + "px"; // Set block position (left)
        block.style.top=(y * block.clientWidth) + "px"; // Set block position (top)
    }

    // Try to move block and check if puzzle was solved
    onClickOnBlock(blockIdx) {
        if(this.moveBlock(blockIdx)) {
            if(this.checkPuzzleSolved()) {
                setTimeout(() => alert("Puzzle Solved!"), 600); // Alert when the puzzle is solved
            }
        }
    }

    // Return if puzzle was solved
    checkPuzzleSolved() {
        for(let i=0; i<this.indexes.length; i++) {
            if(i == this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols) continue; // Skip empty block
            if(this.indexes[i] != i) return false; // Check if block is in the correct position
        }
        return true; // Puzzle is solved
    }

    // Set difficulty
    setDifficulty(difficultyLevel) {
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.randomize(this.difficulty); // Shuffle puzzle with new difficulty level
    }
}

// Instantiate a new Game with difficulty level 1
var game=new Game(1);

// Taking care of the difficulty buttons
var difficulty_buttons=Array.from(document.getElementsByClassName("difficulty_button"));
difficulty_buttons.forEach((elem, idx) => {
    elem.addEventListener('click', (e) => {
        difficulty_buttons[GameDifficulty.indexOf(game.difficulty)].classList.remove("active"); // Remove active class from current difficulty button
        elem.classList.add("active"); // Add active class to clicked button
        game.setDifficulty(idx + 1); // Set new difficulty level
    });
});
