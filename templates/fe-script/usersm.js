(async () => {
    try {
        const response = await fetch("/api/users/all-users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            console.log("user loading");
            const userTable = document.getElementById("userTable");

            data.data.forEach(user => {
                const row = document.createElement("tr");

                const userId = document.createElement("td");
                userId.textContent = user._id;
                row.appendChild(userId);

                const username = document.createElement("td");
                username.textContent = user.username;
                row.appendChild(username);

                const email = document.createElement("td");
                email.textContent = user.email;
                row.appendChild(email);

                const role = document.createElement("td");
                role.textContent = user.role;
                row.appendChild(role);

                const status = document.createElement("td");
                const statusText = document.createElement("span");
                if (user.verified) {
                    statusText.className = "badge bg-success";
                    statusText.textContent = "True";
                } else {
                    statusText.className = "badge bg-secondary";
                    statusText.textContent = "False";
                }
                status.appendChild(statusText);
                row.appendChild(status);

                const actionButtons = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.className = "btn btn-sm btn-warning";
                editButton.setAttribute("data-id", user._id)
                editButton.textContent = "Edit";

                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-sm btn-danger";
                deleteButton.setAttribute("data-id",user._id);
                deleteButton.textContent = "Delete";

                actionButtons.appendChild(editButton);
                actionButtons.appendChild(deleteButton);
                row.appendChild(actionButtons);

                userTable.appendChild(row);
            });

            document.getElementById("close-popup-edit").addEventListener("click", () => {
                document.getElementById("user-popup-edit").classList.add("hidden");
            });

            document.getElementById("close-popup-delete").addEventListener("click", () => {
                document.getElementById("user-popup-delete").classList.add("hidden");
            });

            document.querySelectorAll(".btn-danger").forEach(button => {
                button.addEventListener("click", (event) => {
                    const userId = event.target.getAttribute("data-id");
                    document.getElementById("user-popup-delete").classList.remove("hidden");
                    document.getElementById("confirm-delete").addEventListener("click", async () =>{
                    const response = await fetch('/api/users/delete-user?_id=' + userId, {
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

            document.querySelectorAll(".btn-warning").forEach(button =>{
                button.addEventListener("click", async (event) => {
                    const userId = event.target.getAttribute("data-id");
                    
                    const response = await fetch("/api/users/user-by-id?_id=" + userId, {
                        method: "GET",
                        headers: {
                            "Content-Type" :"application/json"
                        }
                    });

                    const data = await response.json();
                    console.log(data);
                    if(response.ok){
                        document.getElementById("Euid").value= data.data._id;
                        document.getElementById("Eusername").value = data.data.username;
                        document.getElementById("Eemail").value = data.data.email;
                        document.getElementById("Erole").value = data.data.role;
                        document.getElementById("Estatus").checked = data.data.verified;
                        document.getElementById("user-popup-edit").classList.remove("hidden");
                    }
                    else{
                        console.error("fail")
                    }
                });
            });

            document.getElementById("user-form-edit").addEventListener("submit", async function (event) {
            event.preventDefault();
            const userId = document.getElementById("Euid").value;
            const username = document.getElementById("Eusername").value;
            const email = document.getElementById("Eemail").value;
            const role = document.getElementById("Erole").value;
            const verified = document.getElementById("Estatus").value === "True";

            const payload = {
                username,
                email,
                role,
                verified
            };

            try {
                const response = await fetch(`/api/users/update-user?_id=${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    
                    document.getElementById("error-message").textContent = "User updated successfully!";
                    document.getElementById("error-message").style.color = "green";
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    document.getElementById("error-message").textContent = data.message;
                    document.getElementById("error-message").style.color = "red";
                }
            } catch (error) {
                console.error("Error updating user:", error);
                document.getElementById("error-message").textContent = "An error occurred while updating the user.";
                document.getElementById("error-message").style.color = "red";
            }
        });
                } else {
                    console.error("Failed to fetch users:", response.statusText);
                }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
})();