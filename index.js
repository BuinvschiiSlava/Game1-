const QUESTIONS = [
    {
        text: 'Какое насекомое вызвало короткое замыкание в ранней версии вычислительной машины, тем самым породив термин «компьютерный ба?',
        answers: ['Таракан','Мотылек','Муха','Японский хрущик'],
        rightIndex: 1,
    },
    {
        text: 'Какое из этих чисел является простым?',
        answers: ['37','25','42','50'],
        rightIndex: 0,
    },
];

const MONEY_NODES = document.querySelectorAll(".money");
const START_GAME_BUTTONS = document.querySelectorAll(".start-game");
const SCREEN_NODES = document.querySelectorAll(".screen");
const ANSWER_NODES = document.querySelectorAll(".answer");
const PRIZE_FOR_RIGHT_ANSWER = 5000;
const HIGHLIGHT_TIMEOUT_MS = 1500;

let activeQuestionIndex = 0;
let money = 0;

START_GAME_BUTTONS.forEach( button => {
    button.addEventListener('click', startNewGame)   
})

function startNewGame() {
    showScreen(1);
    setActiveQuestion(0);
    updateMoney(0);
}

function showScreen(index) {
    SCREEN_NODES.forEach(( screen, i)=>{
        screen.classList.toggle('visible', i=== index)
    })
}

function updateMoney(newMoney) {
    money = newMoney;
    MONEY_NODES.forEach(moneyNode =>{
        moneyNode.textContent = money;
    })
}

function setActiveQuestion(index) {
    activeQuestionIndex = index;

    const QUESTIONS_NODE = document.querySelector('.question');
    const activeQuestion = QUESTIONS[index];
    
    QUESTIONS_NODE.textContent = activeQuestion.text;
     
    activeQuestion.isChecking = false;

    setupAnswers(activeQuestion);
}

function setupAnswers(question) {
    const letters = ['A','B','C','D'];
    ANSWER_NODES.forEach((answerNode, index)=>{
        answerNode.textContent = `${letters[index]}. ${question.answers[index]}`;

        answerNode.addEventListener('click', () => {
            handleAnswerClick(answerNode,question);
        })
    });
}

async function handleAnswerClick(answerNode, question) {
    if (question.isChecking){
        return;
    }

    question.isChecking = true;

    await highlightAnswer(answerNode, 'active');

    const rightAnswerNode = ANSWER_NODES [question.rightIndex];

    const isRightAnswer = rightAnswerNode.textContent === answerNode.textContent;

    await highlightAnswer(rightAnswerNode, 'right');

    if(!isRightAnswer) {
        showScreen(2);
        return;
    }

    const isLastQuestion = activeQuestionIndex === QUESTIONS.length - 1;

    if(isLastQuestion){
        showScreen(3);
    } else {
        setActiveQuestion(activeQuestionIndex + 1)
    }

    updateMoney(money + 5000);
}

async function highlightAnswer(answerNode, type){
    answerNode.classList.add(type);


    await timeout(1500);

clearClassNamesFromQuestion(answerNode);
}

function clearClassNamesFromQuestion(answerNode){
    ['active','right'].forEach(className => {
        answerNode.classList.remove(className)
    })
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}



