const editor = document.getElementById('editor');
const modeSelect = document.getElementById('modeSelect');

const screenplayFlow = ['slugline', 'action', 'character', 'dialogue', 'parenthetical'];
let currentType = 'slugline';

function createLine(type, text = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.dataset.type = type;
  line.textContent = text;
  return line;
}

function placeCaret(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

editor.appendChild(createLine('slugline', 'INT. LOCALIZACIÓN - DÍA'));

editor.addEventListener('keydown', (e) => {
  const sel = window.getSelection();
  const anchorNode = sel.anchorNode;
  const parentEl = anchorNode?.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode;
  const line = parentEl?.closest('.line');
  if (!line) return;

  if (e.key === 'Enter') {
    e.preventDefault();
    const nextType = modeSelect.value === 'novel' ? 'action' : (
      line.dataset.type === 'character' ? 'dialogue' :
      line.dataset.type === 'dialogue' ? 'action' :
      line.dataset.type === 'parenthetical' ? 'dialogue' :
      screenplayFlow[(screenplayFlow.indexOf(line.dataset.type) + 1) % screenplayFlow.length]
    );
    const newLine = createLine(nextType);
    line.after(newLine);
    placeCaret(newLine);
    currentType = nextType;
  }

  if (e.key === 'Tab' && modeSelect.value === 'screenplay') {
    e.preventDefault();
    const next = line.dataset.type === 'action' ? 'character' :
      line.dataset.type === 'dialogue' ? 'parenthetical' :
      line.dataset.type === 'parenthetical' ? 'dialogue' : 'action';
    line.dataset.type = next;
    line.className = `line ${next}`;
    currentType = next;
  }
});

modeSelect.addEventListener('change', () => {
  document.body.classList.toggle('novel', modeSelect.value === 'novel');
});

function addItem(listId, prefix) {
  const list = document.getElementById(listId);
  const li = document.createElement('li');
  li.textContent = `${prefix} ${list.children.length + 1}`;
  list.appendChild(li);
}

document.getElementById('addScene').onclick = () => addItem('structureList', 'Escena');
document.getElementById('addCharacter').onclick = () => addItem('charactersList', 'Personaje');
document.getElementById('addLocation').onclick = () => addItem('locationsList', 'Localización');

document.getElementById('exportTxt').onclick = () => {
  const text = [...editor.querySelectorAll('.line')].map(l => l.textContent).join('\n');
  downloadFile('guion.txt', text, 'text/plain');
};

document.getElementById('exportJson').onclick = () => {
  const payload = {
    mode: modeSelect.value,
    lines: [...editor.querySelectorAll('.line')].map(l => ({ type: l.dataset.type, text: l.textContent })),
    scenes: [...document.querySelectorAll('#structureList li')].map(li => li.textContent),
    characters: [...document.querySelectorAll('#charactersList li')].map(li => li.textContent),
    locations: [...document.querySelectorAll('#locationsList li')].map(li => li.textContent)
  };
  downloadFile('proyecto-cinescript.json', JSON.stringify(payload, null, 2), 'application/json');
};

function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
