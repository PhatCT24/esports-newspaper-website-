document.addEventListener("DOMContentLoaded", async () => {
    const lolCarousel = document.getElementById("lol-carousel");
    const valCarousel = document.getElementById("valorant-carousel");
    const tftCarousel = document.getElementById("tft-carousel");

    if(lolCarousel) lolCarousel.addEventListener("click", () => {
        window.location.href = "lol-homepage";
    });
    if(valCarousel) valCarousel.addEventListener("click", () => {
        window.location.href = "valorant-homepage";
    });
    if(tftCarousel) tftCarousel.addEventListener("click", () => {
        window.location.href = "tft-homepage";
    });

    let token = getCookie("access_token");
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }
    const role = getCookie("role");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userBtn = document.getElementById("user-info-name");
    const adminBtn = document.getElementById("admin-btn");



    if(token){
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "block";
        if (userBtn) userBtn.style.display = "block";
        if (userBtn){
            try{
                const userInfoObj = JSON.parse(atob(token.split('.')[1]));
                if (userInfoObj){
                    userBtn.innerHTML = userInfoObj.name;
                } 
            } catch {}
        } 
    } else {
        if(loginBtn) loginBtn.style.display = "block";
        if(logoutBtn) logoutBtn.style.display = "none";
        if(userBtn) userBtn.style.display = "none";
    }
    if (adminBtn) adminBtn.style.display = (role === "admin" ? "block" : "none");
    if (userBtn) userBtn.addEventListener("click", () => window.location.href = "profile");
    if (logoutBtn) logoutBtn.addEventListener("click", async () => {
        try{
            const response = await fetch("/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
            if (response.ok){
                if (loginBtn) loginBtn.style.display = "block";
                if(logoutBtn) logoutBtn.style.display = "none";
                if(userBtn) userBtn.style.display = "none";
                if(adminBtn) adminBtn.style.display = "none";
            } else {
                console.log("logout failed");
            } 
        } catch (error){
            console.log(error);
        }
    });

    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        let suggestionsBox = document.querySelector(".search-suggestions");
        if (!suggestionsBox) {
            suggestionsBox = document.createElement("div");
            suggestionsBox.className = "search-suggestions";
            suggestionsBox.style.display = "none";
            searchBar.parentNode.appendChild(suggestionsBox);
        }

        searchBar.addEventListener("input", async (event) => {
            const query = event.target.value.trim();
            if (query.length === 0) {
                suggestionsBox.style.display = "none";
                suggestionsBox.innerHTML = "";
                return;
            }
            try {
                const response = await fetch(`/posts/search?title=${encodeURIComponent(query)}`);
                const results = await response.json();
                if (!Array.isArray(results) || results.length === 0) {
                    suggestionsBox.style.display = "none";
                    suggestionsBox.innerHTML = "";
                    return;
                }
                suggestionsBox.innerHTML = "";
                results.forEach(post => {
                    const item = document.createElement("div");
                    item.className = "suggestion-item";
                    item.textContent = post.title;
                    item.onclick = () => {
                        window.location.href = `news.html?title=${encodeURIComponent(post.title)}`;
                    };
                    suggestionsBox.appendChild(item);
                });
                suggestionsBox.style.display = "block";
            } catch (error) {
                suggestionsBox.style.display = "none";
                suggestionsBox.innerHTML = "";
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!searchBar.contains(event.target) && !suggestionsBox.contains(event.target)) {
                suggestionsBox.style.display = "none";
            }
        });

        // Show dropdown when focusing if suggestions exist
        searchBar.addEventListener("focus", () => {
            if (suggestionsBox.innerHTML.trim() !== "") {
                suggestionsBox.style.display = "block";
            }
        });

        // Enter key navigates to search results
        searchBar.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                window.location.href = "search-result.html?query=" + encodeURIComponent(searchBar.value);
            }
        });
    }
    const bigSearchBar = document.getElementById("big-search-bar");
    if(bigSearchBar){
        bigSearchBar.addEventListener("keydown", (event) => {
            if(event.key === "Enter"){
                window.location.href = "search-result.html?query=" + encodeURIComponent(bigSearchBar.value);
            }
        });
    }
    try {
        const response = await fetch("/posts", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
            const newsSection = document.getElementById("news-section");
            if (newsSection) {
                const smallPostSection = document.createElement("div");
                smallPostSection.className = "right-news-column";
                let count = 5;
                data.forEach(post => {
                    // Backend fields: post_id, title, category, subcategory, description, content, image, user_id, created_at, updated_at
                    const createdAt = post.created_at ? new Date(post.created_at) : new Date();
                    const now = new Date();
                    const category = post.category ? post.category : "General";
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.user_id ? post.user_id : "Unknown";
                    if (count === 5) {
                        const bigbigPostElement = document.createElement("div");
                        bigbigPostElement.className = "news-1";
                        const bigPostElement = document.createElement("div");
                        bigPostElement.className = "content-1";
                        const title = document.createElement("h2");
                        title.className = "news-title";
                        title.innerHTML = `<a href="news.html?post_id=${post.post_id}">` + post.title;
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
                        bigbigPostElement.appendChild(bigPostElement);
                        newsSection.appendChild(bigPostElement);
                        count--;
                    } else if (count > 0) {
                        const smallPost = document.createElement("div");
                        smallPost.className = "news-2-container";
                        const postText = document.createElement("div");
                        postText.className = "news-2-context";
                        const postTitle = document.createElement("p");
                        postTitle.className = "news-title";
                        postTitle.innerHTML = `<a href="news.html?post_id=${post.post_id}">` + post.title;
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
        }
    } catch (error) {
        console.error(error);
    }
});


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
