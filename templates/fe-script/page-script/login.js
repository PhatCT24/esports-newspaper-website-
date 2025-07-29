document.addEventListener("DOMContentLoaded", function() {

    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    if (registerBtn) registerBtn.addEventListener("click", changeToRegister);
    if (loginBtn) loginBtn.addEventListener("click", changeToLogIn);

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const registerBtn = registerForm.querySelector(".register-button");
            registerBtn.disabled = true;
            const username = document.getElementById("usernameR").value;
            const email = document.getElementById("emailR").value;
            const password = document.getElementById("passwordR").value;
            const passwordConfirm = document.getElementById("passwordConfirmR").value;
            const errorMsg = document.getElementById("error-register");
            errorMsg.textContent = "";
            try {
                const response = await fetch("/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: username,
                        email,
                        password,
                        passwordConfirm
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    // Now send verification code
                    const codeRes = await fetch("/auth/send-verification-code", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({ email })
                    });
                    const codeData = await codeRes.json();
                    if (codeRes.ok) {
                        errorMsg.style.color = "limegreen";
                        errorMsg.textContent = "Registration successful! Verification code sent to your email.";
                        setTimeout(() => {
                            window.location.href = "/otp?email=" + encodeURIComponent(email);
                        }, 500);
                    } else {
                        errorMsg.style.color = "red";
                        errorMsg.textContent = codeData.detail || "Failed to send verification code.";
                    }
                } else {
                    errorMsg.style.color = "red";
                    errorMsg.textContent = data.detail || "Registration failed.";
                }
            } catch (error) {
                errorMsg.style.color = "red";
                errorMsg.textContent = "An error occurred. Please try again later.";
            }
            registerBtn.disabled = false;
        });
    }

    // Login form submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const errorMsg = document.getElementById("error-message");
            errorMsg.textContent = "";
            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    errorMsg.style.color = "limegreen";
                    errorMsg.textContent = "Login successful! Redirecting...";
                    window.location.replace("/");
                } else {
                    errorMsg.style.color = "red";
                    errorMsg.textContent = data.detail || "Login failed.";
                }
            } catch (error) {
                errorMsg.style.color = "red";
                errorMsg.textContent = "An error occurred. Please try again later.";
            }
        });
    }
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
