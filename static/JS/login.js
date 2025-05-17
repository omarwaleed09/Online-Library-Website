document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('message-container');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('registered') && urlParams.get('registered') === 'true') {
        const successElement = document.createElement('div');
        successElement.className = 'message success';
        successElement.textContent = 'Account created successfully! Please log in with your credentials.';
        messageContainer.appendChild(successElement);
        
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const csrfToken = formData.get('csrfmiddlewaretoken');
        
        messageContainer.innerHTML = '';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message info';
        messageElement.textContent = 'Logging in...';
        messageContainer.appendChild(messageElement);
        
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        data.append('csrfmiddlewaretoken', csrfToken);
        
        fetch('/login/', {
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
                
                if (document.cookie.includes('sessionid')) {
                    messageElement.className = 'message success';
                    messageElement.textContent = 'Login successful! Redirecting...';
                    
                    fetch('/login/?check_status=true', {
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(resp => resp.json())
                    .then(userData => {
                        setTimeout(() => {
                            if (userData.is_staff) {
                                window.location.href = '/adminhome';
                            } else {
                                window.location.href = '/user_home/';
                            }
                        }, 1000);
                    })
                    .catch(() => {
                        setTimeout(() => {
                            window.location.href = '/user_home/';
                        }, 1000);
                    });
                }
                return;
            }
            
            const data = result.data;
            
            if (data.success) {
                messageElement.className = 'message success';
                messageElement.textContent = 'Login successful! Redirecting...';
                
                setTimeout(() => {
                    if (data.redirect_url) {
                        window.location.href = data.redirect_url;
                    } else {
                        if (data.is_staff) {
                            window.location.href = '/adminhome';
                        } else {
                            window.location.href = '/user_home/';
                        }
                    }
                }, 1000);
            } else {
                messageElement.className = 'message error';
                messageElement.textContent = data.error || 'Login failed. Please check your credentials.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageElement.className = 'message error';
            messageElement.textContent = 'An error occurred during login. Please try again.';
        });
    });
});