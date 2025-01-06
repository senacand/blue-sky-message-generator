const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const textInput = document.getElementById('textInput');
img.src = 'assets/text-background.jpg';

// Restore text from localStorage if exists
const savedText = localStorage.getItem('bluesky-text') || '';
textInput.value = savedText;

img.onload = function() {
    // Set canvas size to match image dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    drawImage(savedText);
};

function drawImage(text = '') {
    // Draw background image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    if (text) {
        // Configure text style
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 32px "Roboto"';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Split text into paragraphs first (handle Enter key line breaks)
        const paragraphs = text.split('\n');
        const lines = [];

        // Calculate line breaks for each paragraph
        const padding = 48;
        const maxWidth = canvas.width - (padding * 2);

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

        // Draw text
        const lineHeight = 42;
        const totalHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalHeight) / 2;
        lines.forEach((line, index) => {
            ctx.fillText(line, padding, startY + (index * lineHeight));
        });
    }
}

function generateImage() {
    const text = document.getElementById('textInput').value;
    drawImage(text);
    
    // Convert canvas to PNG and trigger download
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