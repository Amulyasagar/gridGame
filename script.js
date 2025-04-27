const SIZE = 6;
let grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
let horizontalHints = [];
let verticalHints = [];

// Initialize
function generatePuzzle() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));

    for (let i = 0; i < 5; i++) {
        const randX = Math.floor(Math.random() * SIZE);
        const randY = Math.floor(Math.random() * SIZE);
        grid[randY][randX] = Math.random() < 0.5 ? '🌟' : '🌙';
    }

    createHints();
    renderGrid();
    clearStatusMessage();
}

// Create random hints
function createHints() {
    horizontalHints = [];
    verticalHints = [];

    for (let i = 0; i < 3; i++) {
        const row = Math.floor(Math.random() * SIZE);
        const col = Math.floor(Math.random() * (SIZE - 1));
        horizontalHints.push([row, col]);
    }

    for (let i = 0; i < 3; i++) {
        const row = Math.floor(Math.random() * (SIZE - 1));
        const col = Math.floor(Math.random() * SIZE);
        verticalHints.push([row, col]);
    }
}

// Render grid
function renderGrid() {
    const gridDiv = document.getElementById('grid');
    gridDiv.innerHTML = '';

    const wrongCells = findWrongCells();

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (wrongCells.some(([r, c]) => r === row && c === col)) {
                cell.classList.add('wrong');
            }
            cell.textContent = grid[row][col];
            cell.onclick = () => onCellClick(row, col);
            gridDiv.appendChild(cell);

            if (col !== SIZE - 1) {
                const hint = document.createElement('div');
                if (horizontalHints.some(([r, c]) => r === row && c === col)) {
                    hint.className = 'hint-x';
                    hint.textContent = '×';
                } else {
                    hint.className = 'empty-space';
                }
                gridDiv.appendChild(hint);
            }
        }

        if (row !== SIZE - 1) {
            for (let col = 0; col < SIZE; col++) {
                const hint = document.createElement('div');
                if (verticalHints.some(([r, c]) => r === row && c === col)) {
                    hint.className = 'hint-x';
                    hint.textContent = '×';
                } else {
                    hint.className = 'empty-space';
                }
                gridDiv.appendChild(hint);

                if (col !== SIZE - 1) {
                    const empty = document.createElement('div');
                    empty.className = 'empty-space';
                    gridDiv.appendChild(empty);
                }
            }
        }
    }

    validatePuzzle();
}

// Click toggle
function onCellClick(row, col) {
    if (grid[row][col] === '') {
        grid[row][col] = '🌟';
    } else if (grid[row][col] === '🌟') {
        grid[row][col] = '🌙';
    } else if (grid[row][col] === '🌙') {
        grid[row][col] = '';
    }
    renderGrid();
}

// Validation
function validatePuzzle() {
    let isComplete = true;
    let isValid = true;

    for (let row = 0; row < SIZE; row++) {
        const rowSymbols = grid[row];
        const stars = rowSymbols.filter(cell => cell === '🌟').length;
        const moons = rowSymbols.filter(cell => cell === '🌙').length;

        if (stars !== 3 || moons !== 3) {
            isValid = false;
        }

        if (rowSymbols.includes('')) {
            isComplete = false;
        }
    }

    for (let col = 0; col < SIZE; col++) {
        const colSymbols = grid.map(row => row[col]);
        const stars = colSymbols.filter(cell => cell === '🌟').length;
        const moons = colSymbols.filter(cell => cell === '🌙').length;

        if (stars !== 3 || moons !== 3) {
            isValid = false;
        }

        if (colSymbols.includes('')) {
            isComplete = false;
        }
    }

    if (isComplete && isValid) {
        showStatusMessage('🎉 Puzzle Completed Successfully!', 'success');
    } else if (!isValid && isComplete) {
        showStatusMessage('❌ Wrong pattern. Fix it!', 'error');
    } else {
        clearStatusMessage();
    }
}

// Find wrong cells
function findWrongCells() {
    const wrong = [];

    // Consecutive 3 check (rows)
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE - 2; col++) {
            if (grid[row][col] && grid[row][col] === grid[row][col + 1] && grid[row][col] === grid[row][col + 2]) {
                wrong.push([row, col], [row, col + 1], [row, col + 2]);
            }
        }
    }

    // Consecutive 3 check (cols)
    for (let col = 0; col < SIZE; col++) {
        for (let row = 0; row < SIZE - 2; row++) {
            if (grid[row][col] && grid[row][col] === grid[row + 1][col] && grid[row][col] === grid[row + 2][col]) {
                wrong.push([row, col], [row + 1, col], [row + 2, col]);
            }
        }
    }

    return wrong;
}

// Status messages
function showStatusMessage(message, type) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
}

function clearStatusMessage() {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = '';
    statusDiv.className = 'status-message';
}

// Reset Button
document.getElementById('reset-button').onclick = generatePuzzle;

// Start
generatePuzzle();
