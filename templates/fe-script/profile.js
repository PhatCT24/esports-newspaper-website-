document.addEventListener("DOMContentLoaded",async () => {
    document.getElementById("btn-verify").addEventListener("click", () => {
        window.location.href = "../html/otp.html";
    });
    function displayUserInfo() {
        const username = getCookie('username');
        let token = getCookie('access_token');
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        const userInfo = JSON.parse(atob(token.split('.')[1]));
        const verified = userInfo.verified;
        const registered = getCookie('createdAt');  
        
        const remove = registered.split("T")[0];
        const date = new Date(remove.slice(3));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        document.getElementById('username').textContent = username;
        document.getElementById('verified').textContent = verified;
        document.getElementById('registered').textContent = formattedDate;

        const btnVerify = document.getElementById("btn-verify")
        if (verified === false) {
            btnVerify.style.display = "block";  
        } else {
            btnVerify.style.display = "none";  
        }
    }
    

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;  
    }

  window.onload = function() {
    displayUserInfo();
  };
});