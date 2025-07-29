    fetch("/api/posts/all-posts?page=1")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const tbody = document.getElementById("news-table-body");
            tbody.innerHTML = "";

            data.data.forEach(news => {
                const tr = document.createElement("tr");
                const author = news.userID?.username ? news.userID.username : "Unknown";
                tr.innerHTML = `
                    <td>${news._id}</td>
                    <td><a href="../html/news.html?_id=${news._id}">${news.title}</a></td>
                    <td>${author}</td>
                    <td><img src="${news.image}" width="100" /></td>
                    <td>
                        <button class="edit-btn" data-id=${news._id}>Edit</button>
                        <button class="delete-btn" data-id=${news._id}>Delete</button>
                    </td>
                    `
                ;
                tbody.appendChild(tr);
            });
            const create = document.getElementById("button-create-post");
            create.addEventListener("click", () => {
                document.getElementById("news-popup-create").classList.remove("hidden");
            });

            document.querySelectorAll(".edit-btn").forEach(button =>{
                button.addEventListener("click", async (event) => {
                    const newsId = event.target.getAttribute("data-id");
                    console.log(newsId);
                    
                    const response = await fetch("/api/posts/single-post?_id=" + newsId, {
                        method: "GET",
                        headers: {
                            "Content-Type" :"application/json"
                        }
                    });

                    const data = await response.json();
                    console.log(data);
                    if(response.ok){
                        document.getElementById("Eid").value = data.data._id
                        document.getElementById("Etitle").value = data.data.title;
                        document.getElementById("Edescription").value = data.data.description;
                        document.getElementById("Ecategory").value = data.data.category;
                        document.getElementById("Esubcategory").value = data.data.subcategory;
                        document.getElementById("Econtent").value = data.data.content;
                        // document.getElementById("Eimage-upload").src = data.data.image;
                        document.getElementById("news-popup-edit").classList.remove("hidden");
                    }
                    else{
                        console.error("fail")
                    }
                });
            });

            document.getElementById("news-form-edit").addEventListener("submit", async function(event){
                
                event.preventDefault();
                const ID = document.getElementById("Eid").value;
                const newtitle = document.getElementById("Etitle").value;
                const newdescription = document.getElementById("Edescription").value;
                const newcategory = document.getElementById("Ecategory").value;
                const newsubcategory = document.getElementById("Esubcategory").value;
                const newcontent = document.getElementById("Econtent").value;
                const newimageInput = document.getElementById("Eimage-upload");
                const newimageFile = newimageInput.files[0];

                const formData = new FormData();
                formData.append("title", newtitle);
                formData.append("description", newdescription);
                formData.append("category", newcategory);
                formData.append("subcategory", newsubcategory);
                formData.append("content", newcontent);
                if (newimageFile) {
                    formData.append("image", newimageFile); 
                }
                
                try{
                    const response = await fetch('/api/posts/update-post?_id=' + ID, {
                        method: "PUT",
                        body: formData,
                    });
                const data = await response.json();
                if (response.ok){
                        document.getElementById("error-message").textContent = "Post edited successfully!"
                        document.getElementById("error-message").style.color = "green";
                        setTimeout(() => {
                        location.reload();
                        }, 1000); 
                    }else{
                        document.getElementById("error-message").textContent = data.message;
                        document.getElementById("error-message").style.color = "red";
                    }

                console.log("the process finished");
                }catch (error){
                    document.getElementById("error-message").textContent = error;
                }
            });

            document.getElementById("close-popup-create").addEventListener("click", () => {
                document.getElementById("news-popup-create").classList.add("hidden");
            });

            document.getElementById("close-popup-edit").addEventListener("click", () => {
                document.getElementById("news-popup-edit").classList.add("hidden");
            });

            document.getElementById("news-form-create").addEventListener("submit",async function(event) {
                event.preventDefault();
                const title = document.getElementById("title").value;
                const description = document.getElementById("description").value;
                const category = document.getElementById("category").value;
                const subcategory = document.getElementById("subcategory").value;
                const content = document.getElementById("content").value;
                const imageInput = document.getElementById("image-upload");
                const imageFile = imageInput.files[0];

                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("category", category);
                formData.append("subcategory", subcategory);
                formData.append("content", content);
                if (imageFile) {
                    formData.append("image", imageFile); 
                }
                try{
                    const response = await fetch('/api/posts/create-post', {
                        method: "POST",
                        
                        body: formData,
                    });
                    const data = await response.json();
                    if (response.ok){
                        document.getElementById("error-message").textContent = "Post created successfully!"
                        document.getElementById("error-message").style.color = "green";
                        setTimeout(() => {
                        location.reload();
                        }, 1000); 
                    }else{
                        document.getElementById("error-message").textContent = data.message;
                        document.getElementById("error-message").style.color = "red";
                    }
                }catch (error){
                    console.log(error);
                }
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const newsId = event.target.getAttribute("data-id");
                    document.getElementById("news-popup-delete").classList.remove("hidden");
                    document.getElementById("confirm-delete").addEventListener("click", async () =>{
                    console.log(newsId);
                    const response = await fetch('/api/posts/delete-post?_id=' + newsId, {
                        method: "DELETE",
                        headers: {
                        "Content-Type" :"application/json" 
                        }
                    });
                    const data = await response.json();
                    console.log(data);

                    if(response.ok){
                        location.reload();
                    }else{
                        console.log(error);
                    }
                });
                })
            });

            document.getElementById("close-popup-delete").addEventListener("click", () => {
                document.getElementById("news-popup-delete").classList.add("hidden");
            });          
        }).catch(error => console.error("Lỗi tải dữ liệu:", error));

