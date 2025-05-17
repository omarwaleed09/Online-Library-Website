document.getElementById("add-book-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = document.getElementById("add-book-form");
    const formData = new FormData(form);  

    fetch('/api/addnewbook', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => { throw errData; });
        }
        return response.json();
    })
    .then(data => {
        alert('Book added successfully!');
        window.location.href = "viewbooksadmin";
    })
    .catch(errors => {
        alert("Failed to add book: " + JSON.stringify(errors));
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
