(function() {
    const script = document.currentScript;
    const businessId = script.getAttribute('data-business-id');

    if (!businessId) {
        console.error('AssistAI: No business ID provided.');
        return;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'assistai-widget-container';
    container.setAttribute('data-business-id', businessId);
    document.body.appendChild(container);

    // Load Widget Script (from the build output)
    const widgetScript = document.createElement('script');
    // Assuming the user hosts 'dist' folder contents at the root of their assets server
    // For local dev, this might need adjustment to 'http://localhost:5173/src/main.tsx' if not built
    widgetScript.src = 'http://localhost:5173/dist/widget.iife.js'; 
    widgetScript.type = 'module';
    widgetScript.onload = function() {
        // Initialize if needed, or if the React app mounts automatically to #root (needs adjustment)
        console.log('AssistAI Widget Loaded');
    };
    document.body.appendChild(widgetScript);

    // Initial mount point logic is handled inside main.tsx of the widget
})();
