// Handler: backBtn click — navigate back in history
document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
});

const stats = JSON.parse(localStorage.getItem('scoreHistory')) || [];
const tbody = document.getElementById('statTableBody');
const svg = document.getElementById('chart');

if (stats.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Zatím žádné odehrané hry.</td></tr>';
} else {
    // Function: renderStats — populate table rows and draw chart bars
    stats.forEach((run, index) => {

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${run.time}</td><td>${run.killCount}</td><td>${run.level}</td><td>${run.skills}</td>`;

        tbody.appendChild(tr);

        const barWidth = 40;
        const spacing = 20;
        const x = index * (barWidth + spacing) + 20;

        const barHeight = Math.min(run.killCount * 2, 200); 
        const y = 250 - barHeight; 

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', '#df0000');

        // Handler: chart bar hover — highlight bar on hover
        rect.addEventListener('mouseover', () => rect.setAttribute('fill', '#ff4d4d'));
        // Handler: chart bar out — restore bar color
        rect.addEventListener('mouseout', () => rect.setAttribute('fill', '#df0000'));

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + barWidth / 2);
        text.setAttribute('y', y - 5);
        text.setAttribute('fill', 'white');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = run.killCount;

        svg.appendChild(rect);
        svg.appendChild(text);
    });
}