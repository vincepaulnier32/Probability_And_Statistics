const Calculator = {
    displayValue: '',

    appendToDisplay(value) {
        // Prevent consecutive operators or repeated "nPr" / "nCr" / "="
        const lastChar = this.displayValue[this.displayValue.length - 1];
        
        // Check if the value is an operator
        if (this.isOperator(value)) {
            // Prevent consecutive operators or multiple nPr/nCr/= 
            if (this.isOperator(lastChar) || lastChar === '') {
                return;  // Prevent consecutive operators
            }
            if (value === 'nPr' || value === 'nCr' || value === '=') {
                if (this.displayValue.includes(value)) {
                    return; // Prevent repeating nPr, nCr, or =
                }
            }
        }

        // Append value to the display and update it
        this.displayValue += value;
        document.getElementById('display').value = this.displayValue;
    },

    clearDisplay() {
        // Clear the display
        this.displayValue = '';
        document.getElementById('display').value = '';
    },

    calculate() {
        let result;
        try {
            // Check for permutation or combination
            if (this.displayValue.includes('nPr')) {
                const [n, r] = this.getValuesForOperation('nPr');
                result = this.calculatePermutation(n, r);
            } else if (this.displayValue.includes('nCr')) {
                const [n, r] = this.getValuesForOperation('nCr');
                result = this.calculateCombination(n, r);
            } else {
                // Evaluate arithmetic expressions directly
                result = this.evaluateExpression(this.displayValue);
            }
        } catch (error) {
            result = `Error: ${error.message}`;
        }
        this.displayValue = result;
        document.getElementById('display').value = result;
    },

    // Function to safely evaluate arithmetic expressions
    evaluateExpression(expression) {
        try {
            // Using RegEx to ensure the expression contains only valid characters
            if (/[^0-9+\-*/().\s]/.test(expression)) {
                throw new Error('Invalid characters in expression.');
            }
            return eval(expression);
        } catch (e) {
            throw new Error('Invalid arithmetic expression.');
        }
    },

    getValuesForOperation(symbol) {
        // Split the displayValue based on the operation symbol (nPr or nCr)
        const parts = this.displayValue.split(symbol);
        if (parts.length !== 2) {
            throw new Error(`Invalid format. Use "n${symbol}" format.`);
        }
        const [n, r] = parts.map(Number);
        if (isNaN(n) || isNaN(r)) {
            throw new Error('Invalid numbers provided.');
        }
        return [n, r];
    },

    calculatePermutation(n, r) {
        if (n < r || n < 0 || r < 0) {
            throw new Error('Invalid values for permutation. Ensure n ≥ r and both are non-negative.');
        }
        return this.factorial(n) / this.factorial(n - r);
    },

    calculateCombination(n, r) {
        if (n < r || n < 0 || r < 0) {
            throw new Error('Invalid values for combination. Ensure n ≥ r and both are non-negative.');
        }
        return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
    },

    factorial(n) {
        if (n < 0) throw new Error('Factorial is undefined for negative numbers.');
        let result = BigInt(1);  // Use BigInt for large numbers
        for (let i = BigInt(1); i <= BigInt(n); i++) {
            result *= i;
        }
        return result;
    },

    isOperator(value) {
        // Check if the value is an operator (including nPr, nCr, and =)
        return ['+', '-', '*', '/', 'nPr', 'nCr', '='].includes(value);
    },

    toggleSign() {
        // Toggle the sign of the current number
        if (this.displayValue === '') {
            return;
        }

        if (this.displayValue[0] === '-') {
            this.displayValue = this.displayValue.slice(1);  // Remove negative sign
        } else {
            this.displayValue = '-' + this.displayValue;  // Add negative sign
        }
        
        document.getElementById('display').value = this.displayValue;
    }
};
// ???????????????????????????????????????????????????????????????????????????????
document.addEventListener('DOMContentLoaded', function() {
    const Quiz = {
        questions: [
            {
                question: "What is the probability of getting heads when flipping a fair coin?",
                options: ["0.25", "0.50", "0.75", "1.00"],
                correctAnswer: "0.50",
                explanation: "A fair coin has an equal chance of landing heads or tails, so the probability is 1/2 or 0.50."
            },
            {
                question: "If you roll two six-sided dice, what's the probability of rolling a total of 7?",
                options: ["1/6", "1/12", "1/9", "1/36"],
                correctAnswer: "1/6",
                explanation: "There are 6 ways to roll a 7 out of 36 possible combinations: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)."
            },
            {
                question: "In a standard deck of 52 cards, what's the probability of drawing a red card?",
                options: ["1/4", "1/2", "1/3", "2/3"],
                correctAnswer: "1/2",
                explanation: "A standard deck has 26 red cards (13 hearts and 13 diamonds) out of 52 total cards."
            },
            {
                question: "What does 'nPr' stand for in probability?",
                options: ["Net Profit Rate", "Number of Permutations", "New Probability Ratio", "Normalized Percentage"],
                correctAnswer: "Number of Permutations",
                explanation: "nPr calculates the number of ways to arrange r items from n total items, where order matters."
            },
            {
                question: "What is the sum of probabilities always equal to?",
                options: ["0", "0.5", "1", "10"],
                correctAnswer: "1",
                explanation: "The total probability of all possible outcomes in a sample space is always 1 or 100%."
            }
        ],
        currentQuestionIndex: 0,
        score: 0
    };

    function startQuiz() {
        document.getElementById('quiz-intro').style.display = 'none';
        document.getElementById('quiz-questions').style.display = 'block';
        Quiz.currentQuestionIndex = 0;
        Quiz.score = 0;
        displayQuestion();
    }

    function displayQuestion() {
        const currentQ = Quiz.questions[Quiz.currentQuestionIndex];
        document.getElementById('current-question').textContent = currentQ.question;

        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        
        currentQ.options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(btn);
        });

        document.getElementById('current-score').textContent = Quiz.score;
        document.getElementById('quiz-feedback').textContent = '';
    }

   function checkAnswer(selectedAnswer) {
    const currentQ = Quiz.questions[Quiz.currentQuestionIndex];
    const feedbackEl = document.getElementById('quiz-feedback');
    const optionsContainer = document.getElementById('answer-options');

    // Find all answer buttons
    const answerButtons = optionsContainer.querySelectorAll('button');

    if (selectedAnswer === currentQ.correctAnswer) {
        Quiz.score++;
        feedbackEl.textContent = '✅ Correct! ' + currentQ.explanation;
        feedbackEl.style.color = 'white';

        // Find and highlight the correct answer button
        answerButtons.forEach(btn => {
            if (btn.textContent === currentQ.correctAnswer) {
                btn.classList.add('correct');
            }
        });
    } else {
        feedbackEl.textContent = '❌ Incorrect. ' + currentQ.explanation;
        feedbackEl.style.color = 'red';
    }

    document.getElementById('current-score').textContent = Quiz.score;

    setTimeout(() => {
        Quiz.currentQuestionIndex++;
        if (Quiz.currentQuestionIndex < Quiz.questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 2500);
}

    function skipQuestion() {
        // Skip the current question by incrementing the index
        Quiz.currentQuestionIndex++;

        // Check if there are more questions
        if (Quiz.currentQuestionIndex < Quiz.questions.length) {
            displayQuestion(); // Display the next question
        } else {
            endQuiz(); // End quiz if there are no more questions
        }
    }

    function endQuiz() {
        // Hide the question section
        document.getElementById('quiz-questions').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';

        // Display the final score
        const finalScoreEl = document.getElementById('final-score-message');
        const resultEmojiEl = document.getElementById('result-emoji');

        // Show message based on score
        if (Quiz.score === 0) {
            finalScoreEl.textContent = "You skipped all the questions. Your score is: 0/5";
            resultEmojiEl.textContent = "😞 Better luck next time!";
        } else {
            finalScoreEl.textContent = `Your final score: ${Quiz.score}/5`;
            if (Quiz.score === 5) {
                resultEmojiEl.textContent = '🏆 Probability Master! 🧠';
            } else if (Quiz.score >= 3) {
                resultEmojiEl.textContent = '👍 Great Job! 📊';
            } else {
                resultEmojiEl.textContent = '📚 Keep Learning! 🤓';
            }
        }
    }

    function restartQuiz() {
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-intro').style.display = 'block';
    }

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerText = '↑';
    scrollTopBtn.onclick = scrollToTop;
    document.body.appendChild(scrollTopBtn);

    // Show button when user scrolls down
    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    };

    // Smooth scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Expose functions globally
    window.startQuiz = startQuiz;
    window.restartQuiz = restartQuiz;
    window.skipQuestion = skipQuestion;
});