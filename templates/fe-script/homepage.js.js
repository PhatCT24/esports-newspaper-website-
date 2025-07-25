document.addEventListener("DOMContentLoaded",async () => {
    document.getElementById("lol-carousel").addEventListener("click", () => {
        window.location.href = "/html/lol-homepage.html";
    });
    document.getElementById("val-carousel").addEventListener("click", () => {
        window.location.href = "/html/valorant-homepage.html";
    });
    document.getElementById("tft-carousel").addEventListener("click", () => {
        window.location.href = "/html/tft-homepage.html";
    }); 
    
    const token = getCookie("Authorization");
    const role = getCookie("role");
    
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
        document.getElementById("user-info-email").style.display = "none";
    }
    console.log(role);
    if (role === "admin"){
        document.getElementById("admin-btn").style.display = "block";
    }
    else {
        document.getElementById("admin-btn").style.display ="none";
    }

    document.getElementById("user-info-email").addEventListener("click", () =>{
       window.location.href = "/html/profile.html"; 
    });
    
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

    document.getElementById("search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(event.target.value);
        }
    });
    document.getElementById("big-search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(event.target.value);
        }
    });
    
    try{
        const response = await fetch("/api/posts/all-posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log(data);
        if (response.ok){
            const newsSection = document.getElementById("news-section");
            const smallPostSection = document.createElement("div");
            smallPostSection.className = "right-news-column";
            let count = 5;
            data.data.forEach(post =>{
                if (count === 5){
                    const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                    const now = new Date();
                    const category = post.category ? post.category : "General";
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.userID?.username ? post.userID.username : "Unknown";
                    const bigbigPostElement = document.createElement("div");
                    bigbigPostElement.className = "news-1"

                    const bigPostElement = document.createElement("div");
                    bigPostElement.className = "content-1";

                    const title = document.createElement("h2");
                    title.className = "news-title";
                    title.innerHTML = `<a href="../html/news.html?_id=${post._id}">` + post.title;
                    bigPostElement.appendChild(title);
                    
                    const briefDescription = document.createElement("p");
                    briefDescription.className = "news-1-desc";
                    briefDescription.innerHTML = post.description;
                    bigPostElement.appendChild(briefDescription);
                    
                    const postStat = document.createElement("p");
                    postStat.className = "news-category-and-time";
                    postStat.innerHTML = `${category} | ${timeDiff} hours ago | by ${author}`;

                    const image = document.createElement("img");
                    image.src = post.image;
                    bigPostElement.appendChild(postStat);
                    bigPostElement.appendChild(image);
                    console.log(bigPostElement);
                    bigbigPostElement.appendChild(bigPostElement);
                    console.log(bigbigPostElement);
                    newsSection.appendChild(bigPostElement);
                    count--;
                }else if (count > 0){
                    const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                    const now = new Date();
                    const category = post.category ? post.category : "General";
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.userID?.username ? post.userID.username : "Unknown";

                    const smallPost = document.createElement("div");
                    smallPost.className = "news-2-container";

                    const postText = document.createElement("div");
                    postText.className = "news-2-context";
                    
                    const postTitle = document.createElement("p");
                    postTitle.className = "news-title";
                    postTitle.innerHTML = `<a href="../html/news.html?_id=${post._id}">` + post.title;
                    postText.appendChild(postTitle);
                    const postDesc = document.createElement("p");
                    postDesc.className = "news-2-desc";
                    postDesc.innerHTML = post.description;
                    postText.appendChild(postDesc);
                    const postStat = document.createElement("p");
                    postStat.className = "news-category-and-time";
                    postStat.innerHTML = `${category} | ${timeDiff} hours ago | by ${author}`;
                    postText.appendChild(postStat);
                    const postImage = document.createElement("img");
                    postImage.src = post.image;
                    smallPost.appendChild(postText);
                    smallPost.appendChild(postImage);
                    smallPostSection.appendChild(smallPost);
                   
                    count--;
                }
            }); 
            newsSection.appendChild(smallPostSection);
        }
    }catch (error) {
        console.error(error);
    }

});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}