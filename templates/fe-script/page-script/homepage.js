import { setupNavbar } from '../global-script/navbar.js';

document.addEventListener("DOMContentLoaded", async () => {
    setupNavbar({searchBarId: 'search-bar', bigSearchBarId: 'big-search-bar'});
    const lolCarousel = document.getElementById("lol-carousel");
    const valCarousel = document.getElementById("val-carousel");
    const tftCarousel = document.getElementById("tft-carousel");

    if (lolCarousel) lolCarousel.addEventListener("click", () => {
        window.location.href = "../html/lol-homepage.html";
    });
    if (valCarousel) valCarousel.addEventListener("click", () => {
        window.location.href = "../html/valorant-homepage.html";
    });
    if (tftCarousel) tftCarousel.addEventListener("click", () => {
        window.location.href = "../html/tft-homepage.html";
    });

    try {
        const response = await fetch("/posts/", {
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
                    const category = post.category || "General";
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.user_id || "Unknown";

                    if (count === 5) {
                        const bigPostContainer = document.createElement("div");
                        bigPostContainer.className = "news-1";

                        const bigPostContent = document.createElement("div");
                        bigPostContent.className = "content-1";

                        const title = document.createElement("h2");
                        title.className = "news-title";
                        const link = document.createElement("a");
                        link.href = `../html/news.html?post_id=${post.post_id}&title=${post.title}`;
                        link.textContent = post.title;
                        title.appendChild(link);
                        link.addEventListener("click", async (event) => {
                            event.preventDefault();
                            try{
                                const res = await fetch(`/posts/${post.post_id}`, {
                                    method: "GET",
                                    headers: { "Content-Type": "application/json" }
                                });
                                const data = await res.json();
                                console.log(data);
                                window.location.href =`../html/news.html?post_id=${post.post_id}&title=${post.title}`;
                            } catch (error) {
                                console.log(error);
                            }
                        });

                        const briefDescription = document.createElement("p");
                        briefDescription.className = "news-1-desc";
                        briefDescription.textContent = post.description;

                        const postStat = document.createElement("p");
                        postStat.className = "news-category-and-time";
                        postStat.textContent = `${category} | ${timeDiff} hours ago | by ${author}`;

                        const image = document.createElement("img");
                        image.src = post.image;

                        bigPostContent.appendChild(title);
                        bigPostContent.appendChild(briefDescription);
                        bigPostContent.appendChild(postStat);
                        bigPostContent.appendChild(image);
                        bigPostContainer.appendChild(bigPostContent);
                        newsSection.appendChild(bigPostContainer);
                        count--;
                    } else if (count > 0) {
                        const smallPost = document.createElement("div");
                        smallPost.className = "news-2-container";

                        const postText = document.createElement("div");
                        postText.className = "news-2-context";

                        const postTitle = document.createElement("p");
                        postTitle.className = "news-title";
                        const link = document.createElement("a");
                        link.href = `../html/news.html?post_id=${post.post_id}&title=${post.title}`;
                        link.textContent = post.title;
                        link.addEventListener("click", async (event) => {
                            event.preventDefault();
                            try{
                                const res = await fetch(`/posts/${post.post_id}`, {
                                    method: "GET",
                                    headers: { "Content-Type": "application/json" }
                                });
                                const data = await res.json();
                                console.log(data);
                                window.location.href =`../html/news.html?post_id=${post.post_id}&title=${post.title}`;
                            } catch (error) {
                                console.log(error);
                            }   
                        });
                        postTitle.appendChild(link);

                        const postDesc = document.createElement("p");
                        postDesc.className = "news-2-desc";
                        postDesc.textContent = post.description;

                        const postStat = document.createElement("p");
                        postStat.className = "news-category-and-time";
                        postStat.textContent = `${category} | ${timeDiff} hours ago | by ${author}`;

                        const postImage = document.createElement("img");
                        postImage.src = post.image;

                        postText.appendChild(postTitle);
                        postText.appendChild(postDesc);
                        postText.appendChild(postStat);
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
        console.error("Failed to fetch posts:", error);
    }
});
