// script.js

(async () => {
    const errorMessage = document.getElementById('error-message');
    const notepad = document.getElementById('notepad');
    const enhanceButton = document.getElementById('enhance-button');
    const saveButton = document.getElementById('save-button');
    const loadButton = document.getElementById('load-button');
    const downloadButton = document.getElementById('download-button');
    const clearButton = document.getElementById('clear-button');
    const responseArea = document.getElementById('response-area');
    const rawResponse = document.getElementById('raw-response');
    const details = document.querySelector('details');

    let session = null;

    // Check for AI capabilities
    if (!window.ai || !window.ai.languageModel) {
        errorMessage.textContent = "AI capabilities not available. Please ensure you're using a supported version of Chrome and have enabled the necessary flags.";
        errorMessage.style.display = 'block';
        return;
    }

    // Initialize AI session
    async function initSession() {
        try {
            session = await window.ai.languageModel.create();
        } catch (error) {
            errorMessage.textContent = `Failed to initialize AI session: ${error.message}`;
            errorMessage.style.display = 'block';
        }
    }

    // Enhance Writing
    enhanceButton.addEventListener('click', async () => {
        const content = notepad.value.trim();
        if (!content) {
            alert('Please enter some text to enhance.');
            return;
        }

        responseArea.style.display = 'block';
        responseArea.textContent = "Enhancing your writing...";
        rawResponse.textContent = '';

        try {
            if (!session) {
                await initSession();
                if (!session) return;
            }

            const enhancedText = await session.rewrite({
                text: content,
                style: 'professional', // You can allow users to select different styles
            });

            // Update the notepad with enhanced text
            notepad.value = enhancedText;

            // Display the AI's response
            responseArea.textContent = enhancedText;
            rawResponse.textContent = enhancedText;

        } catch (error) {
            responseArea.textContent = `Error: ${error.message}`;
        }
    });

    // Save Note
    saveButton.addEventListener('click', () => {
        const content = notepad.value;
        if (!content) {
            alert('There is no content to save.');
            return;
        }
        localStorage.setItem('savedNote', content);
        alert('Note saved successfully.');
    });

    // Load Note
    loadButton.addEventListener('click', () => {
        const content = localStorage.getItem('savedNote');
        if (content) {
            notepad.value = content;
            alert('Note loaded successfully.');
        } else {
            alert('No saved note found.');
        }
    });

    // Download Note
    downloadButton.addEventListener('click', () => {
        const content = notepad.value;
        if (!content) {
            alert('There is no content to download.');
            return;
        }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'note.txt';
        link.click();
        URL.revokeObjectURL(url);
    });

    // Clear Notepad
    clearButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the notepad?')) {
            notepad.value = '';
            responseArea.textContent = '';
            rawResponse.textContent = '';
        }
    });

    // Initialize session on page load
    await initSession();
})();