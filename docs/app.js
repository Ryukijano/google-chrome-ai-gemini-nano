// app.js
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@4.2.12/marked.min.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.0/dist/purify.min.js';

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
    const toggleBackgroundButton = document.getElementById('toggle-background');
    const threeContainer = document.getElementById('three-container');

    let session = null;

    // Check for AI capabilities
    if (!window.ai || !window.ai.languageModel) {
        errorMessage.textContent = "AI capabilities not available. Please ensure you're using a supported version of Chrome and have enabled the necessary flags.";
        return;
    }

    // Initialize AI session
    async function initSession() {
        try {
            session = await window.ai.languageModel.create();
        } catch (error) {
            errorMessage.textContent = `Failed to initialize AI session: ${error.message}`;
        }
    }

    // Enhance Writing
    enhanceButton.addEventListener('click', async () => {
        const content = notepad.value.trim();
        if (!content) return;

        responseArea.textContent = "Processing...";

        try {
            if (!session) {
                await initSession();
                if (!session) return;
            }

            const enhancedText = await session.rewrite({
                text: content,
                style: 'professional', // You can change or allow users to select different styles
            });

            // Update the notepad with enhanced text
            notepad.value = enhancedText;

            // Display the AI's response (optional)
            responseArea.innerHTML = DOMPurify.sanitize(marked.parse(enhancedText));
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

    // Toggle Background
    toggleBackgroundButton.addEventListener('click', () => {
        if (threeContainer.style.display === 'none') {
            threeContainer.style.display = 'block';
            toggleBackgroundButton.textContent = 'Disable Background';
        } else {
            threeContainer.style.display = 'none';
            toggleBackgroundButton.textContent = 'Enable Background';
        }
    });

    // Initialize session on page load
    await initSession();
})();

// Three.js initialization
function initThreeJS() {
    // Scene, camera, renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById('three-container');
    container.appendChild(renderer.domElement);

    // Add geometric objects or visuals
    // Example: Rotating Torus Knot
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    camera.position.z = 50;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the object
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;

        renderer.render(scene, camera);
    }

    animate();

    // Adjust on window resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

// Call the function after the window loads
window.addEventListener('load', initThreeJS);