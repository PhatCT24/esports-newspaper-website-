import { setupNavbar } from '../global-script/navbar.js';
document.addEventListener("DOMContentLoaded", async () => {
    setupNavbar({ searchBarId: 'search-bar' });

    //newest news
    document.getElementById("search-bar").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = "/html/search-result.html?query=" + encodeURIComponent(event.target.value);
        }
    });
    
    try{
        const response = await fetch("/posts/by-category?category=VALORANT", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        const data = await response.json();
        if (response.ok){
            const cyphercorkboard = document.getElementById("news-form-tournament-realm");
            const news_box_featured_news = document.createElement("div");
            const all_news = document.createElement("div");
            all_news.className = "all-news";
            const news_row_right = document.createElement("div");
            news_row_right.className = "news-row-right";
            news_box_featured_news.className = "news-box-featured-news"
            
            let count = 4;
            data.forEach(post => {
                if (count === 4){
                    const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                    const now = new Date();
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.userID?.username ? post.userID.username : "Unknown";

                    const featured_news = document.createElement("div");
                    featured_news.className = "featured_news";

                    const featured_content = document.createElement("div");
                    featured_content.className = "featured_content";

                    const news_uptime = document.createElement("p");
                    news_uptime.className = "news-uptime";
                    news_uptime.innerHTML = `${timeDiff} hours ago | by ${author}`;
                    featured_content.appendChild(news_uptime);

                    const news_link = document.createElement("a");
                    news_link.href = `../html/news.html?post_id=${post.post_id}`;
                    news_link.title = post.title;
                    news_link.addEventListener("click", async (event) => {
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
                    
                    const news_title = document.createElement("h5");
                    news_title.textContent = post.title;
                    news_link.appendChild(news_title);
                    featured_content.appendChild(news_link);

                    const news_desc = document.createElement("p");
                    news_desc.className= "news-brief-description";
                    news_desc.textContent = post.description;
                    featured_content.appendChild(news_desc);
                    featured_content.style.paddingLeft = "30px"
                    featured_content.style.minHeight = "100%";
                    featured_content.style.position = "relative";
                    featured_content.style.textAlign = "left";
                    featured_content.style.width = "100%";
                    

                    featured_news.appendChild(featured_content);
                    featured_news.style.display = "flex";
                    featured_news.style.alignItems = "flex-end";
                    featured_news.style.minHeight = "100%"
                    featured_news.style.backgroundImage = `url(${post.image})`;
                    featured_news.style.backgroundRepeat = "no-repeat";
                    featured_news.style.backgroundSize = "cover";
                    featured_news.style.objectFit = "contain";
                    
                    news_box_featured_news.appendChild(featured_news);
                    
                    all_news.appendChild(news_box_featured_news);
                    count--;
                }else if (count > 0){
                    const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                    const now = new Date();
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.userID?.username ? post.userID.username : "Unknown";

                    const news_box = document.createElement("div");
                    news_box.className = "news-box";

                    const image_section = document.createElement("div");
                    image_section.className = "image-section";

                    const image = document.createElement("img");
                    image.src = post.image;
                    image_section.appendChild(image);

                    const text_section = document.createElement("div");
                    text_section.className = "text-section";

                    const news_uptime = document.createElement("p");
                    news_uptime.className = "news-uptime";
                    news_uptime.innerHTML = `${timeDiff} hours ago | by ${author}`;
                    text_section.appendChild(news_uptime)

                    const news_link = document.createElement("a");
                    news_link.href = `../html/news.html?post_id=${post.post_id}`;
                    news_link.title = post.title;
                    news_link.addEventListener("click", async (event) => {
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

                    const news_title = document.createElement("h5");
                    news_title.textContent = post.title;
                    news_link.appendChild(news_title);
                    text_section.appendChild(news_link)
                    
                    const news_desc = document.createElement("p");
                    news_desc.className= "news-brief-description";
                    news_desc.textContent = post.description;
                    text_section.appendChild(news_desc);    

                    news_box.appendChild(image_section);
                    news_box.appendChild(text_section);news_row_right.appendChild(news_box);
                    all_news.appendChild(news_row_right);
                    count--;
                }   
            });
            cyphercorkboard.appendChild(all_news);
        }
    }catch (error){
        console.log(error);
    }
    //tournament news
    try{
        const response = await fetch("/posts/by-subcategory?subcategory=Tournament%20News&category=VALORANT", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        const data = await response.json();
        console.log(data);
        if (response.ok){
            const vct = document.getElementById("scuttle-news");
            const news_box_equal_row = document.createElement("div");
            news_box_equal_row.className = "news-box-equal-row";
            let count = 4;
            data.forEach(post => {
                if (count > 0){
                    const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                    const now = new Date();
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.userID?.username ? post.userID.username : "Unknown";


                    const news_section_box_1 = document.
                    createElement("div");
                    news_section_box_1.className = "news-section box-1"

                    const postImage = document.createElement("img");
                    postImage.src = post.image;
                    news_section_box_1.appendChild(postImage);

                    const postStat = document.createElement("p");
                    postStat.className = "news-uptime";
                    postStat.innerHTML = `${timeDiff} hours ago | by ${author}`;
                    news_section_box_1.appendChild(postStat);

                    const news_link = document.createElement("a");
                    news_link.href = `../html/news.html?post_id=${post.post_id}`;
                    news_link.title = post.title;
                    news_link.addEventListener("click", async (event) => {
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
                    
                    const news_title = document.createElement("h5");
                    news_title.textContent = post.title;
                    news_link.appendChild(news_title);
                    news_section_box_1.appendChild(news_link);

                    const news_desc = document.createElement("p");
                    news_desc.className= "news-brief-description";
                    news_desc.textContent = post.description;
                    news_section_box_1.appendChild(news_desc);
                    news_box_equal_row.appendChild(news_section_box_1);
                    count--;
                }
            });
            vct.appendChild(news_box_equal_row);
        }


    }catch (error){
        console.log(error);
    }

    //tournament news
    try{
        const response = await fetch("/posts/by-subcategory?subcategory=Game%20Updates&category=VALORANT", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        const data = await response.json();
        console.log(data);
        if (response.ok){
            const gameupdates = document.getElementById("game-updates");
            const news_box_equal_row = document.createElement("div");
            news_box_equal_row.className = "news-box-equal-row";
            let count = 4;
            data.forEach(post => {
                if (count > 0){
                    const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
                    const now = new Date();
                    const timeDiff = Math.floor((now - createdAt) / (1000 * 60 * 60));
                    const author = post.userID?.username ? post.userID.username : "Unknown";


                    const news_section_box_1 = document.
                    createElement("div");
                    news_section_box_1.className = "news-section box-1"

                    const postImage = document.createElement("img");
                    postImage.src = post.image;
                    news_section_box_1.appendChild(postImage);

                    const postStat = document.createElement("p");
                    postStat.className = "news-uptime";
                    postStat.innerHTML = `${timeDiff} hours ago | by ${author}`;
                    news_section_box_1.appendChild(postStat);

                    const news_link = document.createElement("a");
                    news_link.href = `../html/news.html?_id=${post._id}`;
                    news_link.title = post.title;
                    news_link.addEventListener("click", async(event) => {
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
                    
                    const news_title = document.createElement("h5");
                    news_title.textContent = post.title;
                    news_link.appendChild(news_title);
                    news_section_box_1.appendChild(news_link);

                    const news_desc = document.createElement("p");
                    news_desc.className= "news-brief-description";
                    news_desc.textContent = post.description;
                    news_section_box_1.appendChild(news_desc);
                    news_box_equal_row.appendChild(news_section_box_1);
                    count--;
                }
            });
            gameupdates.appendChild(news_box_equal_row);
        }
    }catch (error){
        console.log(error);
    }
});