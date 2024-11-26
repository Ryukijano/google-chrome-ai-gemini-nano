import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

// Three.js Setup
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85  // threshold
);

composer.addPass(renderPass);
composer.addPass(bloomPass);

// Create animated background
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: '#6c5ce7',
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Animation
function animate() {
  requestAnimationFrame(animate);
  particlesMesh.rotation.x += 0.0001;
  particlesMesh.rotation.y += 0.0001;
  composer.render();
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// AI Studio functionality
let session = null;
let currentMode = 'chat';
let selectedStyle = '';

const errorElement = document.getElementById('error');
const messagesContainer = document.getElementById('messages');
const promptInput = document.getElementById('prompt');
const submitButton = document.getElementById('submit');
const temperatureSlider = document.getElementById('temperature');
const temperatureValue = document.getElementById('temperature-value');
const modeButtons = document.querySelectorAll('.mode-btn');
const modeDescription = document.querySelector('.mode-description');
const rewriteOptions = document.querySelector('.rewrite-options');
const styleButtons = document.querySelectorAll('.style-btn');
const typingIndicator = document.querySelector('.typing-indicator');

const modeDescriptions = {
  chat: 'Chat with AI to brainstorm ideas and get creative feedback',
  write: 'Generate original content with AI assistance',
  rewrite: 'Transform your text into different styles'
};

async function initAPIs() {
  try {
    if (!self.ai?.languageModel) {
      throw new Error('AI APIs not available. Please enable AI features in Chrome.');
    }

    const capabilities = await self.ai.getCapabilities();
    console.log('AI Capabilities:', capabilities);

    // Create session with both temperature and topK
    session = await self.ai.languageModel.createSession({
      temperature: 0.7,
      topK: 20
    });
    
    // Update UI to reflect initial values
    temperatureSlider.value = "0.7";
    temperatureValue.textContent = "0.7";
    
    enableInterface();
  } catch (error) {
    console.error('Initialization error:', error);
    showError(error.message);
  }
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
  messageDiv.innerHTML = isUser ? text : DOMPurify.sanitize(marked.parse(text));
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function processInput(text) {
  if (!text.trim()) return;

  try {
    if (!session) {
      await initAPIs();
    }

    disableInterface();
    showTypingIndicator();
    addMessage(text, true);
    promptInput.value = '';

    let prompt = text;
    if (currentMode === 'rewrite' && selectedStyle) {
      prompt = `Rewrite the following text in a ${selectedStyle} style:\n\n${text}`;
    }

    const result = await session.sendMessage(prompt, {
      temperature: parseFloat(temperatureSlider.value),
      topK: 20,
      maxTokens: 1000
    });

    hideTypingIndicator();
    addMessage(result.text);
  } catch (error) {
    console.error('Processing error:', error);
    hideTypingIndicator();
    showError(error.message);
    
    // If session error, try to reinitialize
    if (error.message.includes('session')) {
      session = null;
      await initAPIs();
    }
  } finally {
    enableInterface();
  }
}

function updateMode(mode) {
  currentMode = mode;
  modeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  modeDescription.textContent = modeDescriptions[mode];
  rewriteOptions.classList.toggle('visible', mode === 'rewrite');
  
  // Update placeholder text based on mode
  const placeholders = {
    chat: 'Type your message here...',
    write: 'Describe what you want to create...',
    rewrite: 'Paste your text here to rewrite it...'
  };
  promptInput.placeholder = placeholders[mode];
}

function disableInterface() {
  promptInput.disabled = true;
  submitButton.disabled = true;
}

function enableInterface() {
  promptInput.disabled = false;
  submitButton.disabled = false;
}

// Event Listeners
submitButton.addEventListener('click', () => processInput(promptInput.value));

promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    processInput(promptInput.value);
  }
});

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => updateMode(btn.dataset.mode));
});

styleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    styleButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedStyle = btn.dataset.style;
  });
});

temperatureSlider.addEventListener('input', () => {
  temperatureValue.textContent = temperatureSlider.value;
});

// Initialize
initAPIs();
