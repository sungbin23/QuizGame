// --- 게임 상태 변수 ---
let currentQuestionIndex = 0;
let score = 0;
let combo = 0;
let correctCount = 0;
let currentMode = 'normal'; // normal, speed, survival, timeattack
let timer;
let timeLeft = 15;
let globalTimeLeft = 60;
let lives = 1;
let currentQuizSet = [];

// --- Web Audio API 사운드 효과음 시스템 ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
    } else if (type === 'hint') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}

// --- 폭죽 파티클 연출 (Confetti Engine) ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function triggerConfetti() {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.7) * 12,
            size: Math.random() * 8 + 4,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            life: 100
        });
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // 중력
        p.life -= 2;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(index, 1);
    });
    if (particles.length > 0) requestAnimationFrame(animateConfetti);
}

// --- UI 엘리먼트 가져오기 ---
const mainCard = document.getElementById('main-card');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const topScoreDisplay = document.getElementById('top-score');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score-text');
const categoryText = document.getElementById('category-text');
const timerDisplay = document.getElementById('timer-display');
const timeLeftSpan = document.getElementById('time-left');
const comboText = document.getElementById('combo-text');
const lifeText = document.getElementById('life-text');
const hintBtn = document.getElementById('hint-btn');

const feedbackContainer = document.getElementById('feedback-container');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackDesc = document.getElementById('feedback-desc');
const nextBtn = document.getElementById('next-btn');

// --- 이벤트 바인딩 ---
document.getElementById('mode-normal').addEventListener('click', () => startGame('normal'));
document.getElementById('mode-speed').addEventListener('click', () => startGame('speed'));
document.getElementById('mode-survival').addEventListener('click', () => startGame('survival'));
document.getElementById('mode-timeattack').addEventListener('click', () => startGame('timeattack'));

document.getElementById('restart-btn').addEventListener('click', () => {
    startScreen.classList.add('active');
    resultScreen.classList.remove('active');
    loadHighScore();
});

nextBtn.addEventListener('click', loadNextQuestion);
hintBtn.addEventListener('click', useHint);

// --- 최고 점수 저장 및 불러오기 (LocalStorage) ---
function loadHighScore() {
    const savedScore = localStorage.getItem('knowledge_king_highscore') || 0;
    topScoreDisplay.textContent = savedScore;
}
loadHighScore();

function saveHighScore(newScore) {
    const currentHigh = parseInt(localStorage.getItem('knowledge_king_highscore') || 0);
    if (newScore > currentHigh) {
        localStorage.setItem('knowledge_king_highscore', newScore);
        return true;
    }
    return false;
}

// --- 게임 시작 로직 ---
function startGame(mode) {
    currentMode = mode;
    currentQuestionIndex = 0;
    score = 0;
    combo = 0;
    correctCount = 0;
    
    // 배열 섞기 (랜덤 문제 구성)
    currentQuizSet = [...quizData].sort(() => Math.random() - 0.5);

    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');

    // 모드별 상태 초기화
    timerDisplay.classList.add('hidden');
    lifeText.classList.add('hidden');

    if (mode === 'speed') {
        timerDisplay.classList.remove('hidden');
    } else if (mode === 'survival') {
        lives = 1;
        lifeText.classList.remove('hidden');
        lifeText.textContent = `❤️ 목숨: ${lives}`;
    } else if (mode === 'timeattack') {
        timerDisplay.classList.remove('hidden');
        globalTimeLeft = 60;
        timeLeftSpan.textContent = globalTimeLeft;
        clearInterval(timer);
        timer = setInterval(handleGlobalTimer, 1000);
    }

    loadQuestion();
}

function loadQuestion() {
    if (currentMode !== 'timeattack') clearInterval(timer);
    
    feedbackContainer.classList.add('hidden');
    optionsContainer.innerHTML = '';
    hintBtn.disabled = false;
    hintBtn.style.opacity = '1';

    const currentQ = currentQuizSet[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    categoryText.textContent = currentQ.category;
    progressText.textContent = `${currentQuestionIndex + 1} / ${currentQuizSet.length}`;
    scoreText.textContent = `점수: ${score}`;

    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => checkAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    if (currentMode === 'speed') {
        timeLeft = 15;
        timeLeftSpan.textContent = timeLeft;
        timer = setInterval(handleSpeedTimer, 1000);
    }
}

function handleSpeedTimer() {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        checkAnswer(-1, null);
    }
}

function handleGlobalTimer() {
    globalTimeLeft--;
    timeLeftSpan.textContent = globalTimeLeft;
    if (globalTimeLeft <= 0) {
        clearInterval(timer);
        showResult(true);
    }
}

function useHint() {
    playSound('hint');
    const currentQ = currentQuizSet[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    
    for (let i = 0; i < allButtons.length; i++) {
        if (i !== currentQ.answerIndex && !allButtons[i].disabled) {
            allButtons[i].style.opacity = '0.3';
            allButtons[i].disabled = true;
            break;
        }
    }
    score -= 2;
    scoreText.textContent = `점수: ${score}`;
    hintBtn.disabled = true;
    hintBtn.style.opacity = '0.4';
}

function checkAnswer(selectedIndex, selectedButton) {
    if (currentMode === 'speed') clearInterval(timer);

    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);
    hintBtn.disabled = true;

    const currentQ = currentQuizSet[currentQuestionIndex];
    const isCorrect = (selectedIndex === currentQ.answerIndex);

    if (isCorrect) {
        playSound('correct');
        triggerConfetti();
        if (selectedButton) selectedButton.classList.add('correct');
        
        correctCount++;
        combo++;
        let points = 10;

        if (combo >= 2) {
            points += 5;
            comboText.textContent = `🔥 ${combo}연속 정답! (+5점)`;
            comboText.classList.remove('hidden');
        }

        score += points;
        feedbackTitle.textContent = "✅ 정답입니다!";
        feedbackTitle.style.color = "#38a169";
    } else {
        playSound('wrong');
        mainCard.classList.add('shake');
        setTimeout(() => mainCard.classList.remove('shake'), 400);

        if (selectedButton) selectedButton.classList.add('wrong');
        allButtons[currentQ.answerIndex].classList.add('correct');
        combo = 0;
        comboText.classList.add('hidden');

        if (selectedIndex === -1) {
            feedbackTitle.textContent = "⏰ 시간 초과!";
        } else {
            feedbackTitle.textContent = "❌ 틀렸습니다";
        }
        feedbackTitle.style.color = "#e53e3e";

        if (currentMode === 'survival') {
            lives--;
            lifeText.textContent = `❤️ 목숨: ${lives}`;
            setTimeout(() => {
                showResult(false, true);
            }, 1200);
            return;
        }
    }

    scoreText.textContent = `점수: ${score}`;
    feedbackDesc.textContent = currentQ.explanation;
    feedbackContainer.classList.remove('hidden');
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizSet.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult(timeOut = false, isSurvivalGameOver = false) {
    clearInterval(timer);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    const isNewRecord = saveHighScore(score);
    const newRecordMsg = document.getElementById('new-record-msg');

    if (isNewRecord && score > 0) {
        newRecordMsg.classList.remove('hidden');
        triggerConfetti();
    } else {
        newRecordMsg.classList.add('hidden');
    }

    const resultTitle = document.getElementById('result-title');
    if (isSurvivalGameOver) {
        resultTitle.textContent = "💀 게임 오버!";
    } else if (timeOut) {
        resultTitle.textContent = "⏱️ 시간 종료!";
    } else {
        resultTitle.textContent = "🏆 퀴즈 완료!";
    }

    document.getElementById('final-score').textContent = `${score}점`;
    document.getElementById('final-stats').textContent = `정답 개수: ${correctCount} / ${currentQuizSet.length} (${Math.round((correctCount / currentQuizSet.length) * 100)}%)`;
}