// Utility to render LaTeX
function renderLatex(element, latex) {
    katex.render(latex, element, { throwOnError: false });
}

// Generate random integer between min and max (inclusive)
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random line: y = mx + b
function generateLine() {
    const m = randInt(-5, 5);
    const b = randInt(-10, 10);
    return { m, b };
}

// Generate a random point
function generatePoint() {
    const x = randInt(-8, 8);
    const y = randInt(-20, 20);
    return { x, y };
}

// Check if point is on line
function isPointOnLine(point, line) {
    return point.y === line.m * point.x + line.b;
}

// Render question
function renderQuestion(line, point) {
    const questionDiv = document.getElementById('question');
    const lineLatex = `y = ${line.m}x ${line.b >= 0 ? '+' : ''} ${line.b}`;
    const pointLatex = `(${point.x},\,${point.y})`;
    questionDiv.innerHTML = '';
    const latexHTML = `<span id="lineLatex"></span> <br> <span id="pointLatex"></span>`;
    questionDiv.innerHTML = latexHTML;
    renderLatex(document.getElementById('lineLatex'), lineLatex);
    renderLatex(document.getElementById('pointLatex'), pointLatex);
}

// Render solution
function renderSolution(line, point, correct) {
    const solutionDiv = document.getElementById('solution');
    const lineLatex = `y = ${line.m}x ${line.b >= 0 ? '+' : ''} ${line.b}`;
    const pointLatex = `(${point.x},\,${point.y})`;
    const calcLatex = `y = ${line.m} \times ${point.x} ${line.b >= 0 ? '+' : ''} ${line.b} = ${line.m * point.x + line.b}`;
    const answerLatex = correct ? 'Yes, the point is on the line.' : 'No, the point is not on the line.';
    solutionDiv.innerHTML = `
        <div><b>Line:</b> <span id="solLineLatex"></span></div>
        <div><b>Point:</b> <span id="solPointLatex"></span></div>
        <div><b>Calculation:</b> <span id="solCalcLatex"></span></div>
        <div><b>Answer:</b> ${answerLatex}</div>
    `;
    renderLatex(document.getElementById('solLineLatex'), lineLatex);
    renderLatex(document.getElementById('solPointLatex'), pointLatex);
    renderLatex(document.getElementById('solCalcLatex'), calcLatex);
}

// Plot line and point
function plotLineAndPoint(line, point) {
    const canvas = document.getElementById('plot');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Axes
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(200, 0); ctx.lineTo(200, 400); // y-axis
    ctx.moveTo(0, 200); ctx.lineTo(400, 200); // x-axis
    ctx.stroke();
    // Line
    ctx.strokeStyle = '#007bff';
    ctx.beginPath();
    for (let px = -10; px <= 10; px++) {
        const py = line.m * px + line.b;
        const cx = 200 + px * 20;
        const cy = 200 - py * 10;
        if (px === -10) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    // Point
    ctx.fillStyle = '#d9534f';
    const px = 200 + point.x * 20;
    const py = 200 - point.y * 10;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, 2 * Math.PI);
    ctx.fill();
    // Point label
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`(${point.x}, ${point.y})`, px + 8, py - 8);
}

// State
let currentLine, currentPoint, correctAnswer;

function newQuestion() {
    currentLine = generateLine();
    // 50% chance to generate a point on the line
    if (Math.random() < 0.5) {
        // Pick a random x, calculate y so point is on the line
        const x = randInt(-8, 8);
        const y = currentLine.m * x + currentLine.b;
        currentPoint = { x, y };
    } else {
        // Generate a random point, may or may not be on the line
        let pt;
        do {
            pt = generatePoint();
        } while (isPointOnLine(pt, currentLine)); // ensure not on line
        currentPoint = pt;
    }
    correctAnswer = isPointOnLine(currentPoint, currentLine);
    renderQuestion(currentLine, currentPoint);
    document.getElementById('solution').innerHTML = '';
    document.getElementById('plot').getContext('2d').clearRect(0,0,400,400);
    document.getElementById('isOnLine').value = '';
    document.getElementById('solutionExpander').open = false;
}

// Form submit
document.addEventListener('DOMContentLoaded', function() {
    newQuestion();
    document.getElementById('answerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userAnswer = document.getElementById('isOnLine').value;
        if (userAnswer === '') return;
        renderSolution(currentLine, currentPoint, correctAnswer);
        plotLineAndPoint(currentLine, currentPoint);
        document.getElementById('solutionExpander').open = true;
    });
    document.getElementById('newQuestion').addEventListener('click', function() {
        newQuestion();
    });
});
