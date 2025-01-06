const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const textInput = document.getElementById('textInput');
img.src = 'assets/text-background.jpg';

// Default text settings
let textSettings = {
    fontSize: 32,
    horizontalAlign: 'left',
    verticalAlign: 'middle'
};

// Restore text and settings from localStorage if exists
const savedText = localStorage.getItem('bluesky-text') || '';
const savedSettings = JSON.parse(localStorage.getItem('bluesky-text-settings') || JSON.stringify(textSettings));
textSettings = savedSettings;
textInput.value = savedText;

// Update font size display
document.getElementById('fontSize').textContent = textSettings.fontSize;

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    drawImage(savedText);
};

function drawImage(text = '') {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    if (text) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `700 ${textSettings.fontSize}px "Roboto"`;
        ctx.textAlign = textSettings.horizontalAlign;
        ctx.textBaseline = 'top';

        const paragraphs = text.split('\n');
        const lines = [];
        const padding = 48;
        let maxWidth = canvas.width - (padding * 2);

        paragraphs.forEach(paragraph => {
            if (paragraph === '') {
                lines.push('');
                return;
            }
            
            const words = paragraph.split(' ');
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
        });

        const lineHeight = textSettings.fontSize * 1.3;
        const totalHeight = lines.length * lineHeight;
        
        // Calculate vertical position based on alignment
        let startY;
        switch(textSettings.verticalAlign) {
            case 'top':
                startY = padding;
                break;
            case 'bottom':
                startY = canvas.height - totalHeight - padding;
                break;
            default: // middle
                startY = (canvas.height - totalHeight) / 2;
        }

        // Calculate horizontal position based on alignment
        let startX;
        switch(textSettings.horizontalAlign) {
            case 'left':
                startX = padding;
                break;
            case 'right':
                startX = canvas.width - padding;
                break;
            default: // center
                startX = canvas.width / 2;
        }

        lines.forEach((line, index) => {
            ctx.fillText(line, startX, startY + (index * lineHeight));
        });
    }
}

// Font size controls
document.getElementById('increaseFontSize').addEventListener('click', () => {
    textSettings.fontSize = Math.min(72, textSettings.fontSize + 2);
    document.getElementById('fontSize').textContent = textSettings.fontSize;
    saveSettingsAndRedraw();
});

document.getElementById('decreaseFontSize').addEventListener('click', () => {
    textSettings.fontSize = Math.max(12, textSettings.fontSize - 2);
    document.getElementById('fontSize').textContent = textSettings.fontSize;
    saveSettingsAndRedraw();
});

// Horizontal alignment controls
document.querySelectorAll('[data-align]').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('[data-align]').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        textSettings.horizontalAlign = button.dataset.align;
        saveSettingsAndRedraw();
    });
});

// Vertical alignment controls
document.querySelectorAll('[data-valign]').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('[data-valign]').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        textSettings.verticalAlign = button.dataset.valign;
        saveSettingsAndRedraw();
    });
});

function saveSettingsAndRedraw() {
    localStorage.setItem('bluesky-text-settings', JSON.stringify(textSettings));
    drawImage(textInput.value);
}

function generateImage() {
    const text = document.getElementById('textInput').value;
    drawImage(text);
    
    const link = document.createElement('a');
    link.download = 'blue-sky-message.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Update preview as user types
document.getElementById('textInput').addEventListener('input', function(e) {
    const text = e.target.value;
    localStorage.setItem('bluesky-text', text);
    drawImage(text);
});

// Set initial active states for alignment buttons
document.querySelector(`[data-align="${textSettings.horizontalAlign}"]`)?.classList.add('active');
document.querySelector(`[data-valign="${textSettings.verticalAlign}"]`)?.classList.add('active'); 