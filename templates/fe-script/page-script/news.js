import { setupNavbar } from '../global-script/navbar.js';
document.addEventListener("DOMContentLoaded", async () => {
    setupNavbar({ searchBarId: 'search-bar' });
  
    let post = null;
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('_id');
    const postTitle = urlParams.get('title');
    if (postId) {
        const response = await fetch(`/posts/${encodeURIComponent(postId)}`);
        if (response.ok) {
            post = await response.json();
            renderPost(post);
            return;
        }
    } else if (postTitle) {
        const response = await fetch(`/posts/title/${encodeURIComponent(postTitle)}`);
        if (response.ok) {
            post = await response.json();
            renderPost(post);
            return;
        }
    }
    // If nothing found
    document.getElementById('body-container').innerHTML = '<div class="alert alert-danger">Post not found.</div>';
});

function renderPost(post) {
    const bodyContainer = document.getElementById("body-container");
    bodyContainer.innerHTML = "";
    document.title = post.title;
    const createdAt = new Date(post.createdAt || post.created_at);
    const readableDate = createdAt.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const author = post.userID?.username || post.user_id || "Unknown";
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
    (post.content || "").split("\n").forEach(p => {
        if (p.trim()) {
            const para = document.createElement('p');
            para.textContent = p.trim();
            newsBody.appendChild(para);
        }
    });
    // Sidebar (recommended)
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    const recommended = document.createElement("h3");
    recommended.innerHTML = "Recommended";
    sidebar.appendChild(recommended);
    fetch(`/posts/by-category?category=${encodeURIComponent(post.category)}`)
        .then(resp => resp.json())
        .then(recommendedPosts => {
            let count = 4;
            (recommendedPosts || []).forEach(post2 => {
                if ((post2.post_id !== post.post_id) && count > 0) {
                    const sbnews = document.createElement("div");
                    sbnews.className = "sbnews";
                    const sbnewsImage = document.createElement("img");
                    sbnewsImage.src = post2.image;
                    sbnews.appendChild(sbnewsImage);
                    const sbnewsLink = document.createElement("a");
                    sbnewsLink.href = `../html/news.html?title=${encodeURIComponent(post2.title)}`;
                    const sbnewsTitle = document.createElement("p");
                    sbnewsTitle.textContent = post2.title;
                    sbnewsLink.appendChild(sbnewsTitle);
                    sbnews.appendChild(sbnewsLink);
                    count--;
                    sidebar.appendChild(sbnews);
                }
            });
        });
    news.appendChild(newsHeader);
    news.appendChild(headerImage);
    news.appendChild(newsBody);
    bodyContainer.appendChild(news);
    bodyContainer.appendChild(sidebar);
}
