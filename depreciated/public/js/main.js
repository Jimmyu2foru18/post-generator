document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const topicInput = document.getElementById('topic');
    const toneSelect = document.getElementById('tone');
    const lengthInput = document.getElementById('length');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    generateBtn.addEventListener('click', async () => {
        try {
            // Show loading state
            loadingDiv.classList.remove('hidden');
            resultDiv.innerHTML = '';
            generateBtn.disabled = true;

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: topicInput.value,
                    options: {
                        tone: toneSelect.value,
                        length: parseInt(lengthInput.value),
                        userContext: 'web interface'
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate content');
            }

            // Display result
            resultDiv.innerHTML = `
                <h3>Generated Content:</h3>
                <div class="content">${data.data.content}</div>
            `;
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="error">Error: ${error.message}</div>
            `;
        } finally {
            // Hide loading state
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });
}); 