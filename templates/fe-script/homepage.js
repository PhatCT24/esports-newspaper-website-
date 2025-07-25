document.addEventListener("DOMContentLoaded", () => {     
    const token = getCookie("Authorization");
    
    if (token) {
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("user-info").style.display = "block";
        const userInfo = JSON.parse(atob(token.split('.')[1]));
        document.getElementById("user-info-email").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#FFFFFF"/> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#FFFFFF"/></g></svg>' + userInfo.email;
    }
    else {
        document.getElementById("login-btn").style.display = "block";
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("user-info").style.display = "none";
    }
    document.getElementById("logout-btn").addEventListener("click", async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                document.getElementById("login-btn").style.display = "block";
                document.getElementById("logout-btn").style.display = "none";
                document.getElementById("user-info").style.display = "none";
                document.getElementById("admin-btn").style.display = "none";
            } else {
                console.error("Logout failed.");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    }
    );

    document.getElementById("frontpage").addEventListener("click", () => {
        window.location.href = "/";
    }
    );

    document.getElementById("search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(event.target.value);
        }
    });
    const role = getCookie("role");
    if (role === "admin"){
        document.getElementById("admin-btn").style.display = "block";
    }
    else {
        document.getElementById("admin-btn").style.display ="none";
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}