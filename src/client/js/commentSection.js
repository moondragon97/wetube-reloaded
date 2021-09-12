const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const comments = document.querySelectorAll(".video__comment");


const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul")
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const div = document.createElement("div");
    div.className = "comment__change";
    const span2 = document.createElement("span");
    span2.innerText = "🖌";
    span2.className = "comment__edit";
    const span3 = document.createElement("span");
    span3.innerText = "❌";
    span3.className = "comment__delete";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(div);
    div.appendChild(span2);
    div.appendChild(span3);
    videoComments.prepend(newComment);
        
    span2.addEventListener("click", handleEdit);
    span3.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === ""){
        alert("글을 적어주세요");
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text
        }),
    });
    if(response.status == 201){
        textarea.value = "";
        const {newCommentId} = await response.json();
        addComment(text, newCommentId)
    }
};

// 댓글 편집
const handleEdit = async (event) => {
    event.preventDefault();
    const comment = event.path[2];
    const commentId = comment.dataset.id
    const span = comment.childNodes[1];
    const icon = comment.childNodes[0];
    const change = comment.lastChild;
    const text = span.innerText;

    span.style.display = "none";
    change.style.display = "none";
    icon.style.display = "none";
    const textarea = document.createElement("input");
    const submitBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    textarea.value = text;
    submitBtn.innerText = "수정";
    cancelBtn.innerText = "취소";

    comment.appendChild(textarea);
    comment.appendChild(submitBtn);
    comment.appendChild(cancelBtn);
    
    const commentInit = () => {
        textarea.remove();
        submitBtn.remove();
        cancelBtn.remove();
        
        icon.style.removeProperty("display");
        change.style.removeProperty("display");
        span.style.removeProperty("display");
    };

    cancelBtn.onclick = () => {
        commentInit();
        return;
    }

    submitBtn.onclick = async (event) => {
        event.preventDefault();
        span.innerText = textarea.value;
        commentInit();

        await fetch(`/api/comment/${commentId}/edit`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: textarea.value,
            }),
        });
    }

};

// 댓글 삭제
const handleDelete = async (event) => {
    event.preventDefault();
    const comment = event.path[2];
    const commentId = comment.dataset.id;
    const response = await fetch(`/api/comment/${commentId}/delete`,{
        method: "DELETE",
    });
    comment.remove();
}

if (form){
    form.addEventListener("submit", handleSubmit);
}

if(comments){
    for(const commentIndex of comments){
        const editBtn = commentIndex.querySelector("#edit");
        const deleteBtn = commentIndex.querySelector("#delete");
        
        editBtn.addEventListener("click", handleEdit);
        deleteBtn.addEventListener("click", handleDelete);
    }
}
