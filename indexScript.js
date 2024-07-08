

document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton) {
        signUpButton.addEventListener('click', () => {
            console.log("Sign Up button clicked");
            container.classList.add('right-panel-active');
        });
    }

    if (signInButton) {
        signInButton.addEventListener('click', () => {
            console.log("Sign In button clicked");
            container.classList.remove('right-panel-active');
        });
    }

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        axios.post('http://localhost:3000/signup', {
            name: name,
            email: email,
            password: password
        })
        .then(response => {
            if (response.data.success) {
                console.log(response.data);
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            alert('Signup failed! Please try again.');
        });
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        axios.post('http://localhost:3000/login', {
            email: email,
            password: password
        })
        .then(response => {
            if (response.data.success) {
                console.log(response.data);
                alert(response.data.message);
                // Save token to local storage
                localStorage.setItem('token', response.data.token);
                window.location.href = response.data.redirectUrl;
                
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            alert('Login failed! Please try again.');
        });
    });

    
});
