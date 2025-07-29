export function setupNavbar({searchBarId, bigSearchBarId} = {}) {
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

    if (searchBarId) setupSearchBar(searchBarId);
    if (bigSearchBarId) setupSearchBar(bigSearchBarId);
}

export function setupSearchBar(barId) {
    const searchBar = document.getElementById(barId);
    if (!searchBar) return;
    let suggestionsBox = document.querySelector(`.search-suggestions[data-for='${barId}']`);
    if (!suggestionsBox) {
        suggestionsBox = document.createElement("div");
        suggestionsBox.className = "search-suggestions";
        suggestionsBox.setAttribute('data-for', barId);
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
                item.style.cursor = "pointer";
                item.onclick = () => {
                    window.location.href = "/html/news.html?title=" + encodeURIComponent(post.title);
                };
                suggestionsBox.appendChild(item);
            });
            suggestionsBox.style.display = "block";
        } catch (error) {
            suggestionsBox.style.display = "none";
            suggestionsBox.innerHTML = "";
        }
    });
    document.addEventListener("click", (event) => {
        if (!searchBar.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.style.display = "none";
        }
    });
    searchBar.addEventListener("focus", () => {
        if (suggestionsBox.innerHTML.trim() !== "") {
            suggestionsBox.style.display = "block";
        }
    });
    searchBar.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(searchBar.value);
        }
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
