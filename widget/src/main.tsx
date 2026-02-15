import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChatWidget } from './components/ChatWidget'

// Find the container created by embed.js
const containerId = 'assistai-widget-container';
let container = document.getElementById(containerId);

if (!container) {
    // Fallback for dev mode where index.html has #root
    container = document.getElementById('root');
}

if (container) {
    // Try to find the script tag to get config
    // In production, the script tag that loaded this file involves looking at document.currentScript (but in module it's harder)
    // reliable way: embed.js sets a global or attributes on the container
    
    // For now, let's look for the embed script by ID if possible, or just default
    // Ideally embed.js passes props via a global object or data attributes on the container
    const businessId = container.getAttribute('data-business-id') || "demo-business-id";

    createRoot(container).render(
      <StrictMode>
        <ChatWidget businessId={businessId} />
      </StrictMode>,
    )
} else {
    console.warn("AssistAI Widget: Container not found.");
}
