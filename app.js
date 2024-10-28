document.addEventListener('DOMContentLoaded', () => {
    // Function to interact with the Prompt API and send results to the background script
    async function interactWithPromptAPI(prompt) {
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                const session = await ai.languageModel.create();
                const stream = await session.promptStreaming(prompt);
                let fullResponse = '';
                let previousLength = 0;
                for await (const chunk of stream) {
                    const newContent = chunk.slice(previousLength);
                    fullResponse += newContent;
                    displayResult(fullResponse);
                    previousLength = chunk.length;
                }
            } else {
                displayError("AI model is not available.");
            }
        } catch (error) {
            displayError(error.message);
        }
    }

    // Function to display the result on the webpage
    function displayResult(result) {
        const featureOutput = document.getElementById('feature-output');
        featureOutput.innerHTML = `<p>${result}</p>`;
    }

    // Function to display error messages on the webpage
    function displayError(message) {
        const featureOutput = document.getElementById('feature-output');
        featureOutput.innerHTML = `<p class="error">${message}</p>`;
    }

    // Load Gemini Nano when the website is opened
    interactWithPromptAPI("Load Gemini Nano");

    // Function to generate blog post ideas, social media captions, or marketing copy
    async function generateIdea() {
        const keywords = document.getElementById('idea-keywords').value;
        interactWithPromptAPI(`Generate ideas for: ${keywords}`);
    }

    // Function to write different types of content
    async function writeContent() {
        const topic = document.getElementById('content-topic').value;
        interactWithPromptAPI(`Write content about: ${topic}`);
    }

    // Function to enhance existing content
    async function enhanceContent() {
        const existingContent = document.getElementById('existing-content').value;
        interactWithPromptAPI(`Enhance the following content: ${existingContent}`);
    }

    // Function to translate content into different languages
    async function translateContent() {
        const content = document.getElementById('content-to-translate').value;
        const targetLanguage = document.getElementById('target-language').value;
        interactWithPromptAPI(`Translate the following content to ${targetLanguage}: ${content}`);
    }

    // Initialize and render 3.js particle effects in the background
    function initParticleEffects() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const particles = new THREE.Geometry();
        const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

        for (let i = 0; i < 10000; i++) {
            const particle = new THREE.Vector3(
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000
            );
            particles.vertices.push(particle);
        }

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 1000;

        function animate() {
            requestAnimationFrame(animate);
            particleSystem.rotation.y += 0.001;
            renderer.render(scene, camera);
        }

        animate();
    }

    initParticleEffects();
});
