document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const messageContainer = document.getElementById('message-container');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(signupForm);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const userRole = formData.get('user_role');
        const csrfToken = formData.get('csrfmiddlewaretoken');
        
        let hasError = false;
        messageContainer.innerHTML = '';
        
        if (password !== confirmPassword) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message error';
            errorMessage.textContent = 'Passwords do not match!';
            messageContainer.appendChild(errorMessage);
            hasError = true;
        }
        
        if (!username || !email || !password || !confirmPassword) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message error';
            errorMessage.textContent = 'Please fill in all required fields';
            messageContainer.appendChild(errorMessage);
            hasError = true;
        }
        
        if (hasError) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message info';
        messageElement.textContent = 'Creating your account...';
        messageContainer.appendChild(messageElement);
        
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('email', email);
        data.append('password', password);
        data.append('confirm_password', confirmPassword);
        data.append('user_role', userRole);
        data.append('csrfmiddlewaretoken', csrfToken);
        
        fetch('/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest' 
            },
            body: data.toString(),
            redirect: 'manual' 
        })
        .then(response => {
            if (response.type === 'opaqueredirect') {
                return { isRedirect: true };
            }
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response.json().then(data => {
                return { isRedirect: false, data: data };
            });
        })
        .then(result => {
            if (result.isRedirect) {
                setTimeout(() => {
                    window.location.href = '/login/?registered=true';
                }, 1500);
                return;
            }
            
            const data = result.data;
            
            if (data.success) {
                messageElement.className = 'message success';
                messageElement.textContent = data.message || 'Account created successfully!';
                
                signupForm.reset();
                
                setTimeout(() => {
                    const redirectUrl = data.redirect_url || '/login/?registered=true';
                    window.location.href = redirectUrl;
                }, 1500);
            } else {
                messageElement.className = 'message error';
                messageElement.textContent = data.error || 'An error occurred during registration.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageElement.className = 'message error';
            messageElement.textContent = 'An error occurred during registration. Please try again.';
        });
    });
});