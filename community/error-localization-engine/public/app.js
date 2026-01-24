const form = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const languageSelect = document.getElementById('language');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const language = languageSelect.value;
    
    // Clear previous response
    responseDiv.className = 'response hidden';
    
    try {
        const response = await fetch(`http://localhost:3000/api/auth/signup?lang=${language}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            showResponse(data.message, 'success');
            form.reset();
        } else {
            // Error - show localized error message
            const errorMessage = data.message || data.error || 'An error occurred';
            showResponse(errorMessage, 'error');
        }
    } catch (error) {
        showResponse('Failed to connect to server. Make sure the backend is running!', 'error');
    }
});

function showResponse(message, type) {
    responseDiv.textContent = message;
    responseDiv.className = `response ${type}`;
}

// Add some visual feedback on language change
languageSelect.addEventListener('change', () => {
    const lang = languageSelect.options[languageSelect.selectedIndex].text;
    console.log(`Language changed to: ${lang}`);
});
