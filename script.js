
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const WORD_LENGTH = 5;
    const NUM_GUESSES = 6;
    let secretWord = '';
    let currentGuess = [];
    let currentRow = 0;

    fetch('word.txt')
        .then(response => response.text())
        .then(text => {
        
            const words = text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === WORD_LENGTH);
            secretWord = words[Math.floor(Math.random() * words.length)];
            
            console.log(`The secret word is: ${secretWord}`); 
            
            initializeBoard();
            document.addEventListener('keydown', handleKeyPress);
        });


    function initializeBoard() {
        for (let i = 0; i < NUM_GUESSES; i++) {
            let row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < WORD_LENGTH; j++) {
                let tile = document.createElement('div');
                tile.className = 'tile';
                row.appendChild(tile);
            }
            gameBoard.appendChild(row);
        }
    }


    function handleKeyPress(e) {
    
        if (e.key === 'Enter') {
            if (currentGuess.length === WORD_LENGTH) {
                checkGuess();
            }
    
        } else if (e.key === 'Backspace') {
            currentGuess.pop();
            updateBoard();
    
        } else if (currentGuess.length < WORD_LENGTH && e.key.match(/^[a-z]$/i)) {
            currentGuess.push(e.key.toUpperCase());
            updateBoard();
        }
    }
    

    function updateBoard() {
        const row = gameBoard.children[currentRow];
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = row.children[i];
        
            tile.textContent = currentGuess[i] || '';
        }
    }


    function checkGuess() {
        const guess = currentGuess.join('');
        const row = gameBoard.children[currentRow];
        const secretLetters = secretWord.split(''); // An array of letters we can modify
        const guessLetters = guess.split('');
        const resultClasses = new Array(WORD_LENGTH).fill(''); // To store the result for each tile

        // Pass 1: Check for 'correct' (green) letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessLetters[i] === secretLetters[i]) {
                resultClasses[i] = 'correct';
                secretLetters[i] = null; // Mark this secret letter as "used"
                guessLetters[i] = null;  // Mark this guess letter as "accounted for"
            }
        }

        // Pass 2: Check for 'present' (yellow) letters
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessLetters[i] !== null) { // If this letter wasn't a 'correct' match
                const letterIndexInSecret = secretLetters.indexOf(guessLetters[i]);
                if (letterIndexInSecret !== -1) {
                    resultClasses[i] = 'present';
                    secretLetters[letterIndexInSecret] = null; // Mark this secret letter as "used"
                }
            }
        }

        // Apply the classes to the tiles
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = row.children[i];
            const letterClass = resultClasses[i] || 'absent'; // If not 'correct' or 'present', it's 'absent'
            tile.classList.add(letterClass);
        }

        // --- WIN/LOSS CONDITIONS --- (This part is the same as before)
        if (guess === secretWord) {
            // We are ignoring the keyboard update for now as requested
            alert('You win!');
            document.removeEventListener('keydown', handleKeyPress);
            return;
        }

        currentRow++;
        currentGuess = [];

        if (currentRow === NUM_GUESSES) {
            alert(`You lose! The word was: ${secretWord}`);
            document.removeEventListener('keydown', handleKeyPress);
        }
    }
});