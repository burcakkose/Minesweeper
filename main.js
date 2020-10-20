let row_count = 10;
let col_count = 10;
let mine_count = 10;

function createBoard() {
    const board = document.getElementById('board');
   
    for(let i=0; i<row_count; i++) {
        const row = document.createElement('div');
        row.className='row';
        board.append(row);

        for(let j=0; j<col_count; j++) {
            const cell = document.createElement('div');
            cell.className='cell';
            cell.id = i+"_"+j;
            row.append(cell);      

            cell.addEventListener('click', function(){
                handleClick(i, j);
            });

            cell.addEventListener('contextmenu', function(e){
                e.preventDefault(); // context menu does not appear while right clicking
                handleRightClick(i,j);
            });
        }   
    }

    let positionsArray = createMinePosition();
    placeTheMines(positionsArray);
}

function createMinePosition() {

    let arrMinePositions = [];

    for(let i=0; i<mine_count;){
        
        let x = Math.floor(Math.random() * row_count);
        let y = Math.floor(Math.random() * col_count);
        let position = [x, y];
        
        let isUnique = true;

        arrMinePositions.forEach(function(eachExistingPosition) {

            if(eachExistingPosition[0]==x && eachExistingPosition[1]==y)
            {
                isUnique=false;
            }
        });

        if(isUnique) {
            arrMinePositions[i] = position;
            i++;
        }
    }
    console.log(arrMinePositions);

    return arrMinePositions;
}

function placeTheMines(minePositions) {

    for(let i=0; i<mine_count; i++) {

        let eachPosition  = minePositions[i];

        let x = eachPosition[0];
        let y = eachPosition[1]; 

        let cellAtThisPosition = document.getElementById(x+"_"+y);
        cellAtThisPosition.classList.add('mine');
    }
}

function handleClick(x, y) {
    let cell = document.getElementById(x + '_' + y);
    
    if(cell.classList.contains('mine')) {
        //reveal all mines
        for(let i=0; i<row_count; i++) {
            for(let j=0; j<col_count; j++) {
                
                let cell = document.getElementById(i + '_' + j);
                if(cell.classList.contains('mine'))
                    cell.classList.add('revealed');
            }    
        }
    } else {
        //reveal the cells withhout a mine
        reveal(x,y);
    }

    checkIfWon();
}

function reveal(x,y) {
    let cell = document.getElementById(x + '_' + y);

    if(cell.classList.contains('revealed')) {
        //already revealed
    } else {
        cell.classList.add('revealed');
        let mine_count_adjacent = 0;

        for(let i=Math.max(x-1, 0); i<= Math.min(x+1, row_count-1) ; i++) {
            for(let j=Math.max(y-1,0); j<= Math.min(y+1, col_count-1); j++) {
                
                let adjacentCell = document.getElementById(i + '_' + j);

                if(adjacentCell.classList.contains('mine')) {
                    mine_count_adjacent++;
                }
            }    
        }

        if(mine_count_adjacent > 0) {
            cell.innerHTML = mine_count_adjacent;
        } else {
            
            for(let i=Math.max(x-1, 0); i<= Math.min(x+1, row_count-1) ; i++) {
                for(let j=Math.max(y-1,0); j<= Math.min(y+1, col_count-1); j++) {
                    reveal(i,j);
                }    
            }
        }
    }
}

function handleRightClick(x,y){
    
    let cell = document.getElementById(x + '_' + y);
    
    if(!cell.classList.contains('revealed')) {
        if(cell.classList.contains('flagged'))
        {
            cell.classList.remove('flagged');
        } else {
            cell.classList.add('flagged');
        }
    }
}

function checkIfWon() {
    let minesRevealed = document.getElementsByClassName('mine revealed').length;
    let cellStillHidden = row_count * col_count - document.getElementsByClassName('cell revealed').length;
    
    if(minesRevealed > 0) {
        showGameOverMessage(false);
    } else if(cellStillHidden == mine_count) {
        showGameOverMessage(true);
    }
}

function showGameOverMessage(won) {

    //disable click
    board.classList.add('disable_click');

    if(won){
        alert('Game Over, YOU WON!');
    } else {
        alert('Game Over, YOU LOST :(');
    }
}
window.addEventListener('DOMContentLoaded', createBoard);