document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registerBtn").addEventListener("click", changeToRegister);
    document.getElementById("loginBtn").addEventListener("click", changeToLogIn);
    
    document.getElementById("login-form").addEventListener("submit", async function(event) {
        event.preventDefault(); 
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        console.log(email, password);
        try {
            const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                document.getElementById("error-message").style.color = "limegreen";
                document.getElementById("error-message").textContent = "Login successful! Redirecting...";
                window.location.href = "/";
                
            } else {
                console.error(data.message);
                document.getElementById("error-message").textContent = data.message;
            }
        }
        catch (error) {
            console.error(error);
            document.getElementById("error-message").textContent = "An error occurred. Please try again later.";
        }
    });

    document.getElementById("register-form").addEventListener("submit", async function(event) {
        event.preventDefault(); 
        const username = document.getElementById("usernameR").value;
        const email = document.getElementById("emailR").value;
        const password = document.getElementById("passwordR").value;
        const passwordConfirm = document.getElementById("passwordConfirmR").value;
        console.log(username, email, password, passwordConfirm);
        try {
            const response = await fetch("/auth/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, passwordConfirm })
            });
            const data = await response.json();
            if (response.ok) {
                document.getElementById("error-register").style.color = "limegreen";
                document.getElementById("error-register").textContent = "Registration successful! Go to the login page to log in.";
                
            } else {
                console.error(data.message);
                document.getElementById("error-register").textContent = data.message;
            }
        }
        catch (error) {
            console.error(error);
            document.getElementById("error-register").textContent = "An error occurred. Please try again later.";
        }
    }
    );
});




function changeToRegister(){
    document.getElementById("change-to-register").classList.add("hidden");
    document.getElementById("change-to-login").classList.add("visible");
    
    document.getElementById("login-box").classList.add("slide-over-right-to-left-to-fade");
    document.getElementById("login-box").classList.remove("slide-over-left-to-right-to-appear");
    document.getElementById("login-box").classList.add("bring-to-back");
    document.getElementById("login-box").classList.remove("bring-to-front");

    document.getElementById("register-box").classList.add("slide-over-right-to-left-to-appear");
    document.getElementById("register-box").classList.remove("slide-over-left-to-right-to-fade");
    document.getElementById("register-box").classList.add("bring-to-front");
    document.getElementById("register-box").classList.remove("bring-to-back");
}

function changeToLogIn(){
    document.getElementById("change-to-register").classList.remove("hidden");
    document.getElementById("change-to-login").classList.remove("visible");
    
    document.getElementById("login-box").classList.add("slide-over-left-to-right-to-appear");
    document.getElementById("login-box").classList.remove("slide-over-right-to-left-to-fade");
    document.getElementById("login-box").classList.add("bring-to-front");
    document.getElementById("login-box").classList.remove("bring-to-back");

    document.getElementById("register-box").classList.remove("slide-over-right-to-left-to-appear");
    document.getElementById("register-box").classList.add("slide-over-left-to-right-to-fade");
    document.getElementById("register-box").classList.add("bring-to-back");
    document.getElementById("register-box").classList.remove("bring-to-front");
    
}


