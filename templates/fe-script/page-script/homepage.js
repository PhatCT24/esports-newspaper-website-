import { setupNavbar } from '../global-script/navbar.js';

document.addEventListener("DOMContentLoaded", async () => {
    setupNavbar({searchBarId: 'search-bar', bigSearchBarId: 'big-search-bar'});
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
                        postTitle.innerHTML = `<a href="/html/news.html?post_id=${post.post_id}">` + post.title;
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


