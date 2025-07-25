document.addEventListener("DOMContentLoaded", async () => { 
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");
    document.getElementById("search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(event.target.value);
        }
    });
    if (searchQuery) {
        document.title = `Search result for ${searchQuery}`;
    }else {
        document.title = "Search results";
    }
    
    try {
        let response = null;
        if (!searchQuery){
            response = await fetch("/api/posts/posts-by-title?title=" + encodeURIComponent(searchQuery || ""), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        }
        else if(
        "TFT".toLowerCase().includes(searchQuery.toLowerCase())
        ){
        response = await fetch("/api/posts/posts-by-category?category=TFT", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        }else if("League of Legends".toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "lol"){
        response = await fetch("/api/posts/posts-by-category?category=League of Legends", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        }else if("VALORANT".toLowerCase().includes(searchQuery.toLowerCase())){
        response = await fetch("/api/posts/posts-by-category?category=VALORANT", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        }
        else{
            response = await fetch("/api/posts/posts-by-title?title=" + encodeURIComponent(searchQuery || ""), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        }
        const data = await response.json();
        if (response.ok) {
            document.getElementById("search-keyword").textContent = `Search result for "${searchQuery}"`;
            const newsSection = document.createElement("div");
            newsSection.className = "news-section";
            data.data.forEach(post => {
                console.log(post);
                const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                const now = new Date();
                const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                
                const author = post.userID?.username ? post.userID.username : "Unknown";
                
                const toNewsPage = document.createElement("a");
                toNewsPage.href = `../html/news.html?_id=${post._id}`;

                const postElement = document.createElement("div");
                postElement.className = "news-box";
            
                const textSide = document.createElement("div");
                textSide.className = "text-side";
            
                const header = document.createElement("div");
                header.className = "news-header";
                const titleP = document.createElement("p");
                titleP.textContent = post.title;
                header.appendChild(titleP);
            
                const meta = document.createElement("div");
                meta.className = "news-time-and-author";
                const metaP = document.createElement("p");
                metaP.textContent = `${timeDiff} hours ago | by ${author}`;
                meta.appendChild(metaP);
            
                const desc = document.createElement("div");
                desc.className = "news-brief-description";
                const descP = document.createElement("p");
                descP.textContent = post.description;
                desc.appendChild(descP);
            
                const game_icon = document.createElement("div");
                game_icon.className = "game-icon";
                if (post.category === "VALORANT") {
                    game_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="72px" height="72px"><path fill="#ff5252" d="M5,10.885v11.761c0,0.878,0.289,1.732,0.823,2.43L17.4,40.215C17.778,40.71,18.365,41,18.988,41 h9.951c0.835,0,1.302-0.963,0.785-1.619L6.785,10.266C6.198,9.521,5,9.936,5,10.885z"/><path fill="#ff5252" d="M27.245,28.389l13.964-18.07C41.792,9.563,43,9.976,43,10.93v12.465c0,0.395-0.117,0.781-0.336,1.109 l-3.07,4.606C39.223,29.666,38.598,30,37.93,30h-9.893C27.206,30,26.737,29.046,27.245,28.389z"/></svg>';
                }
                else if (post.category === "League of Legends") {
                    game_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="72px" height ="72px" id="FINAL" viewBox="0 0 96 96" style="fill: rgb(194,143,44); fill-rule: nonzero; opacity: 1"><path d="M54.16,13.81a34.84,34.84,0,0,1,26.5,47.9,34.42,34.42,0,0,1-5.52,9H86.88A44.42,44.42,0,0,0,54.16,4.1Z"/><path d="M20.27,82.37v-14a34.61,34.61,0,0,1-6.48-20.23,34.61,34.61,0,0,1,6.48-20.24V14a44.4,44.4,0,0,0,0,68.41Z"/><polygon points="47.5 0.06 22.06 0.06 26.92 10.01 26.92 86.29 22.11 96.13 79.78 96.13 85.05 77.32 47.5 77.32 47.5 0.06"/></svg>'
                }
                else if (post.category === "Teamfight Tactics") {
                    game_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" id="katman_1" x="0px" y="0px" viewBox="25 15 45 45" width="72px" height="72px"style="enable-background:new 0 0 96 72;" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;fill:url(#SVGID_1_);}</style>                  <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="34.8739" y1="12.8925" x2="64.828" y2="60.9741" gradientTransform="matrix(1 0 0 -1 0 74)">      <stop offset="4.909790e-02" style="stop-color:#AF893D"/><stop offset="0.2178" style="stop-color:#D29D40"/><stop offset="0.6393" style="stop-color:#FFCC74"/><stop offset="0.8142" style="stop-color:#E8B55D"/>                    </linearGradient>                    <path class="st0" d="M30.7,40c0.3,0.3,0.9,0.7,1.9,1.3v3.6l12,7l0-1.7c3.6,1.6,6.4,2.6,8.4,2.9l0.1,0L48,56L30.7,45.9V40z M48,16  l17.3,10v15.2c1.7,1.2,3.1,2.7,4.3,4.5c-0.3-0.1-0.9-0.4-1.8-0.8c1.1,2.5,1.3,6.3-2.8,7.2c-9.8,2.3-22.6-4.1-27.4-7.3  c2.5,1,4.8,1.9,7,2.6l0-1.6c-2.3-0.8-6.3-2.4-10.6-5.3c-4-2.7-7.1-6-7.5-6.6c0.7,0.2,1.2,0.3,1.7,0.3c-1.5-2.7,0.1-5.6,2.6-6.7V26  L48,16z M48,18.1L32.6,27v7.2c-0.7-0.6-1.7-2.3-1.9-3.3c-0.7,0.5-0.8,1.5-0.4,2.6c1.8,4.6,9.4,9.5,14.2,12.1l0-12.2h-7.5l-2.6-5.9  h27.2L59,33.5h-7.5l0,15.7c2.2,0.4,4.3,0.7,6.2,0.8c8.3,0.4,8.9-2,7.5-4l-4.8,2.8c-1.3,0.1-2.5,0.1-3.6-0.1l6.6-3.8V27L48,18.1z"/> </svg>'
                }

                textSide.appendChild(header);
                textSide.appendChild(meta);
                textSide.appendChild(desc);
            
                postElement.appendChild(textSide);
                postElement.appendChild(game_icon);
                toNewsPage.appendChild(postElement);
                newsSection.appendChild(toNewsPage);
            });
            document.body.appendChild(newsSection);
        } else {
            console.error(data.message);
        }
    }catch (error) {
        console.error(error);
    }

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

});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}