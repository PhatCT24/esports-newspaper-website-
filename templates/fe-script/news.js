document.addEventListener("DOMContentLoaded", async ()=> {
    document.getElementById("search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(event.target.value);
        }
    });

    try{
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get("_id");
        if (!postId) return;
        // Adjust the fetch URL if your API is mounted elsewhere
        const response = await fetch(`/posts/${encodeURIComponent(postId)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            document.getElementById("body-container").innerHTML = `<div class='alert alert-danger'>Post not found.</div>`;
            return;
        }
        const post = await response.json();
        const bodyContainer = document.getElementById("body-container");
        document.title = post.title;
        const createdAt = new Date(post.created_at);
        const readableDate = createdAt.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        const author = post.user_id || "Unknown";
        const news = document.createElement("div");
        news.className = "news";
        const newsHeader = document.createElement("div");
        newsHeader.className = "news-header";
        const title = document.createElement("h1");
        title.textContent = post.title;
        newsHeader.appendChild(title);
        const newsStat = document.createElement("p");
        newsStat.className = "news-stat";
        newsStat.innerHTML = `${readableDate} | by ${author}`;
        newsHeader.appendChild(newsStat);
        const headerImage = document.createElement("img");
        headerImage.className = "news-img";
        headerImage.src = post.image;
        const newsBody = document.createElement("div");
        newsBody.className = "news-body";
        post.content.split("\n").forEach(p => {
            const para = document.createElement('p');
            para.textContent = p.trim();
            newsBody.appendChild(para);
        });
        news.appendChild(newsHeader);
        news.appendChild(headerImage);
        news.appendChild(newsBody);
        bodyContainer.innerHTML = "";
        bodyContainer.appendChild(news);

        const recommended = document.createElement("h3");
        recommended.innerHTML = "Recommended"
        sidebar.appendChild(recommended)

        const response2 = await fetch('/api/posts/posts-by-category?category=' + post.category, {
            method: "GET",
            headers: {
            "Content-Type" : "application/json"
        }
        });
        const sidebardata = await response2.json();
        let count = 4;

        sidebardata.data.forEach(post2 => {
            if(post2._id !== searchQuery && count > 0){
                const sbnews = document.createElement("div");
                sbnews.className = "sbnews";

                const sbnewsImage = document.createElement("img");
                sbnewsImage.src = post2.image;
                sbnews.appendChild(sbnewsImage);

                const sbnewsLink = document.createElement("a");
                sbnewsLink.href=`../html/news.html?_id=${post2._id}`

                const sbnewsTitle = document.createElement("p");
                sbnewsTitle.textContent = post2.title;

                sbnewsLink.appendChild(sbnewsTitle)
                sbnews.appendChild(sbnewsLink);
                count--;
                sidebar.appendChild(sbnews);
            }
        })

        bodyContainer.appendChild(sidebar);
    } catch (error) {
        document.getElementById("body-container").innerHTML = `<div class='alert alert-danger'>Error loading post.</div>`;
    }
});
