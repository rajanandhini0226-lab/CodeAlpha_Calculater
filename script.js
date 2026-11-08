const currentEl = document.getElementById('current');
const historyEl = document.getElementById('history');
const symbols = {'+': '+', '-': '−', '*': '×', '/': '÷'};

let current = '0';      // number being typed
let previous = null;    // stored left-hand number
let operator = null;
let justEvaluated = false;

function compute(a, b, op) {
  a = parseFloat(a); b = parseFloat(b);
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Error' : a / b;
  }
}
const fmt = n => n === 'Error' ? n : String(parseFloat(Number(n).toPrecision(12)));

function render() {
  currentEl.textContent = current;
  historyEl.textContent = operator ? `${previous} ${symbols[operator]}` : '';
  document.querySelectorAll('.op').forEach(b => b.classList.toggle('active', b.dataset.op === operator && current === '0' && false));
}

function inputNumber(n) {
  if (current === 'Error' || justEvaluated) { current = '0'; justEvaluated = false; }
  if (n === '.' && current.includes('.')) return;
  current = (current === '0' && n !== '.') ? n : current + n;
  render();
}

function chooseOperator(op) {
  if (current === 'Error') return;
  if (operator && !justEvaluated && previous !== null && current !== '') {
    previous = fmt(compute(previous, current, operator));
    if (previous === 'Error') { current = 'Error'; previous = null; operator = null; return render(); }
  } else {
    previous = current;
  }
  operator = op;
  justEvaluated = false;
  current = '0';
  historyEl.textContent = `${previous} ${symbols[op]}`;
  currentEl.textContent = previous;
}

function equals() {
  if (!operator || previous === null) return;
  const expr = `${previous} ${symbols[operator]} ${current}`;
  const result = fmt(compute(previous, current, operator));
  historyEl.textContent = `${expr} =`;
  current = result;
  currentEl.textContent = current;
  previous = null; operator = null; justEvaluated = true;
}

function clearAll() { current = '0'; previous = null; operator = null; justEvaluated = false; render(); }
function del() {
  if (current === 'Error' || justEvaluated) return clearAll();
  current = current.length > 1 ? current.slice(0, -1) : '0';
  render();
}
function percent() {
  if (current === 'Error') return;
  current = fmt(parseFloat(current) / 100);
  render();
}

document.querySelector('.keys').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.num !== undefined) inputNumber(b.dataset.num);
  else if (b.dataset.op) chooseOperator(b.dataset.op);
  else if (b.dataset.action === 'equals') equals();
  else if (b.dataset.action === 'clear') clearAll();
  else if (b.dataset.action === 'delete') del();
  else if (b.dataset.action === 'percent') percent();
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (/^[0-9.]$/.test(e.key)) inputNumber(e.key);
  else if ('+-*/'.includes(e.key)) { e.preventDefault(); chooseOperator(e.key); }
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
  else if (e.key === 'Backspace') del();
  else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clearAll();
  else if (e.key === '%') percent();
});
render();
