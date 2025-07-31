document.addEventListener("DOMContentLoaded", async () => {
    const submitBtn = document.getElementById("submit-btn");
    const errorMsg = document.getElementById("error-message");
    const email = document.getElementById("email");
    errorMsg.textContent = "";
    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
           const response = await fetch("/auth/send-verification-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email: email.value })
           })
           const data = await response.json();
           if (response.ok){
                errorMsg.style.color = "limegreen";
                errorMsg.textContent = "Verification code sent to your email!";
                setTimeout(() => {
                    window.location.href = "/otp?email=" + encodeURIComponent(email.value);
                }, 500);
           }else{
                errorMsg.style.color = "red";
                errorMsg.textContent = data.detail || "Failed to send verification code.";
           }
        } catch (error) {
            console.error(error);
            errorMsg.style.color = "red";
            errorMsg.textContent = "Reset password failed!";   
        }
    });
});
