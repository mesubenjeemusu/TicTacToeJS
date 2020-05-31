//
// Classes and Constants
//
class GameState
{
    constructor()
    {
        this.gameOver = false;
        this.gameSpaceMatrix = 0;
    }
}

class PlayerState
{
    constructor(mark)
    {
        this.mark = mark;
        this.claimedSpaces = 0;
    }

    Reset()
    {
        this.claimedSpaces = 0;
    }
}

// Masks
const flagSpace00  = parseInt('100000000', 2);
const flagSpace01  = parseInt('010000000', 2);
const flagSpace02  = parseInt('001000000', 2);
const flagSpace10  = parseInt('000100000', 2);
const flagSpace11  = parseInt('000010000', 2);
const flagSpace12  = parseInt('000001000', 2);
const flagSpace20  = parseInt('000000100', 2);
const flagSpace21  = parseInt('000000010', 2);
const flagSpace22  = parseInt('000000001', 2);
const flagCatsGame = parseInt('111111111', 2);

const WinMatrix =
    [
        flagSpace00 | flagSpace01 | flagSpace02,
        flagSpace10 | flagSpace11 | flagSpace12,
        flagSpace20 | flagSpace21 | flagSpace22,
        flagSpace00 | flagSpace10 | flagSpace20,
        flagSpace01 | flagSpace11 | flagSpace21,
        flagSpace02 | flagSpace12 | flagSpace22,
        flagSpace00 | flagSpace11 | flagSpace22,
        flagSpace02 | flagSpace11 | flagSpace20
    ];

// Helper Index to Flag map
let cellIndexToSpaceFlagMap = new Map();
cellIndexToSpaceFlagMap.set(0, flagSpace00);
cellIndexToSpaceFlagMap.set(1, flagSpace01);
cellIndexToSpaceFlagMap.set(2, flagSpace02);
cellIndexToSpaceFlagMap.set(3, flagSpace10);
cellIndexToSpaceFlagMap.set(4, flagSpace11);
cellIndexToSpaceFlagMap.set(5, flagSpace12);
cellIndexToSpaceFlagMap.set(6, flagSpace20);
cellIndexToSpaceFlagMap.set(7, flagSpace21);
cellIndexToSpaceFlagMap.set(8, flagSpace22);

//
// Globals
//
let cells = document.getElementsByClassName("cell");
let status = document.getElementById("status_text");
let newGameButton = document.getElementById("new_game_btn");

let gameState = new GameState();
let playerX = new PlayerState("X");
let playerO = new PlayerState("O");
let currentPlayer = playerX;

//
// Functions
//
const ClickSpace = (space) =>
{
    if (!gameState.gameOver)
    {
        let cellIndex = GetIndexFromCellId(space.id);

        if (!(gameState.gameSpaceMatrix & cellIndexToSpaceFlagMap.get(cellIndex)))
        {
            ClaimCell(space, cellIndex);

            // Check for Game Over
            CheckForGameOver(currentPlayer);
            //console.log(gameState.gameOver);

            UpdatePlayerTurn();
        }
    }
}

const ClaimCell = (space, index) =>
{
    // Update view
    let textNode = document.createTextNode(currentPlayer.mark);
    space.appendChild(textNode);

    // Update model
    gameState.gameSpaceMatrix |= cellIndexToSpaceFlagMap.get(index);

    // Update Player State
    currentPlayer.claimedSpaces |= cellIndexToSpaceFlagMap.get(index);
    //console.log(currentPlayer.claimedSpaces);
}

const CheckForGameOver = (currentPlayer) =>
{
    // Check for Cat's Game first... then check for winner (this was a bug!)
    if (gameState.gameSpaceMatrix == (gameState.gameSpaceMatrix | flagCatsGame))
    {
        gameState.gameOver = true;
        let catsGameString = "CAT'S GAME!"
        status.textContent = catsGameString;
        console.log(catsGameString);
    }

    // Check for Win
    WinMatrix.forEach((winFlag) =>
    {
        if (currentPlayer.claimedSpaces == (currentPlayer.claimedSpaces | winFlag))
        {
            let winString = `Player ${currentPlayer.mark} WINS!`
            status.textContent = winString;
            console.log(winString);

            gameState.gameOver = true;
        }
    });
}   

const ResetGame = () =>
{
    // Start new Game
    gameState.gameOver = false;

    // Update view
    for (let cell of cells)
    {
        cell.textContent = "";
    }

    // Update model
    gameState.gameSpaceMatrix = 0;
    playerX.Reset();
    playerO.Reset();
    UpdatePlayerTurn();
}

const UpdatePlayerTurn = () =>
{
    // Update Current Player if game not over
    if (!gameState.gameOver)
    {
        // Toggle Player
        if (currentPlayer === playerX)
            currentPlayer = playerO;
        else
            currentPlayer = playerX;

        status.textContent = `Player ${currentPlayer.mark}'s Turn!`;
    }
}

const GetIndexFromCellId = (id) =>
{
    let indexString = id.split("cell")[1];
    let index = parseInt(indexString);

    return index;
}

//
// Event Listeners
//
for (let cell of cells)
{
    cell.addEventListener("click", () => { ClickSpace(cell); });
}

newGameButton.addEventListener("click", ResetGame);