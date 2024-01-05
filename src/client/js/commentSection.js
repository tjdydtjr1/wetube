const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteComment = document.querySelectorAll("#delete__Comment");


const addComment = (text, newCommentId) =>
{
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = newCommentId;
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const span2 = document.createElement("span");

    newComment.className = "video__comment";
    icon.className = "fas fa-comment";
    span.innerText = `${text}`;
    span2.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
}


const handleSubmit = async (event) =>
{
    event.preventDefault();

    const textarea = form.querySelector("textarea");

    const text = textarea.value;
    const videoId = videoContainer.dataset.id;

    // 입력 없을시 예외 처리
    if(text === "")
    {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`,
    {
        method: "POST",
        // app.use(json) -> json으로 보내고 있다는걸 알려주기 위해 Content-Type 작성
        headers:
        {
            "Content-Type": "application/json",
        },
        body : JSON.stringify
        (
            {
                text: text,
            }
        )
    });

    // 서버에서 생성된 것을 새로고침이 아닌 가짜로 미리 생성
    if(response.status === 201)
    {
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }

    // text 지우기
    textarea.value = "";
}

const handleDelete = async (event) => 
{
    const li =  event.target.closest('.video__comment');
    // await fetch(`/api/comments/${li.dataset.id}/delete`, 
    // {
    //   method: "DELETE",
    // });

    if(li)
    {
        li.remove();
    }
};


if(form)
{
    form.addEventListener("submit", handleSubmit);
}

if(deleteComment)
{
    deleteComment.forEach((deleteBtn) =>
    {
        deleteBtn.addEventListener("click", handleDelete);
    });
}