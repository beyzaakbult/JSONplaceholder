const userList = document.querySelector('#users');
const posts = document.querySelector('#posts');

function capitalize(string) {
    if (string) { 
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    else return ""
    
}
function renderDataValues(item,keys,label,hideKeys) {
    const availableKeys = keys.filter(key=>Object.keys(item).includes(key))
    return `
        ${label?`<tr><td><h4 class="card-subheader">${label}</h4></td><td></td></tr>`:null}
        ${availableKeys.map(key=>{
            return `
                <tr>${hideKeys?"":`<td>${capitalize(key)}</td><td>:</td>`}<td>${item[key]}</td></tr>`}
        ).join("")}
    `
}

function renderUsers(data) {
    data.forEach(user=>{
        const card = `
        <div id="user-${user.id}" class="card user-card">
            <h3 class="card-header"><div>${user.username}</div><div>id:&nbsp;${user.id}</div></h3>
            <div class="details">
                <table>
                    <tbody>
                        ${renderDataValues(item=user, keys=["name","email","phone"], label="Personal")}
                        <tr><td>Website</td><td>:</td><td><a target="_blank" href="http://${user.website}">${user.website}</a></td></tr>
                        ${renderDataValues(item=user.address, keys=["city","street","suite","zipcode"], label="Address")}
                        <tr><td><a target="_blank" href="https://maps.google.com/?q=${user.address.geo.lat},${user.address.geo.lng}">See the map</a></td></tr>
                        ${renderDataValues(item=user.company, keys=["name","bs","catchPhrase"], label="Company")}
                    </tbody>
                </table>
            </div>
        </div>`
        userList.innerHTML += card
        
    })
    data.forEach(user=>{
        const card = document.getElementById(`user-${user.id}`);
        card.addEventListener("click", (e)=>{
            for (const element of document.querySelectorAll(".card.post-card.selected")) {
                element.classList.remove("selected")
            }
            const clickedCard = e.target.closest(".card");
            for (const element of document.querySelectorAll(".card.user-card")) {
                if (element.id===clickedCard.id) {
                    element.classList.toggle("selected")
                    document.querySelector(`#${element.id}-posts`).classList.toggle("hidden");
                } else {
                    element.classList.remove("selected")
                    document.querySelector(`#${element.id}-posts`).classList.add("hidden");
                }
            };
        });
    })
}

function renderPosts(data) {
    let userIds = [];
    data?.forEach(post=>{
        if (!userIds.includes(post.userId)) userIds.push(post.userId)
    })
    userIds.forEach(userId=>{
        const userPosts = data.filter(post=>post.userId===userId)
        const card = `
        <div id="user-${userId}-posts" class="user-posts hidden">
            ${userPosts.map(userpost=>{
                return `
                    <div id="post-${userpost.id}" class="card post-card">
                        <h3 class="card-header"><div>${capitalize(userpost.title)}</div><div>id:&nbsp;${userpost.id}</div></h3>
                        <div class="details">
                            <table>
                                <tbody>
                                    ${renderDataValues(item=userpost, keys=["body"], label=" ",hideKeys=true)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `
            }).join("")}
        </div>`
        posts.innerHTML += card
    })
    data.forEach(post=>{
        const card = document.getElementById(`post-${post.id}`);
        card.addEventListener("click", (e)=>{
            const clickedCard = e.target.closest(".card");
            for (const element of document.querySelectorAll(".card.post-card")) {
                if (element.id===clickedCard.id) {
                    element.classList.toggle("selected")
                } else {
                    element.classList.remove("selected")
                }
            };
        });
    })
}
function renderComments(data) {
    let postIds = [];
    data?.forEach(comment=>{
        if (!postIds.includes(comment.postId)) postIds.push(comment.postId)
    })
    postIds?.forEach(postId=>{
        const postComments = data?.filter(comment=>comment.postId===postId) || []
        const commentsContainer = document.querySelector(`#post-${postId} .details`)
        if (postComments.length) {
            const card = `
            <div id="post-${postId}-comments" class="post-comments">
                <div class="comment-count">${postComments.length} comments</div>
                ${postComments.map(comment=>{
                    return `
                        <div id="comment-${comment.id}" class="comment-card">
                            <div class="comment-name"><div>${capitalize(comment.name)}</div><div>id:&nbsp;${comment.id}</div></div>
                            <div class="comment-email">${comment.email}</div>
                            <div class="comment-text">${comment.body}</div>
                        </div>
                    `
                }).join("")}
            </div>`
            commentsContainer.innerHTML += card
        }
    })
}

function getData(url, func) {
    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("HTTP status code: " + response.status + " from: "+url);
        }
        return response.json();
    }).then(d=>func(d))
}
const configurations = [
    {
        from_url: "https://jsonplaceholder.typicode.com/users",
        write_html: (data)=>renderUsers(data)
    },
    {
        from_url: "https://jsonplaceholder.typicode.com/posts",
        write_html: (data)=>renderPosts(data)
    },
    {
        from_url: "https://jsonplaceholder.typicode.com/comments",
        write_html: (data)=>renderComments(data)
    }
]
configurations.forEach(c=>getData(url=c.from_url, func=c.write_html))