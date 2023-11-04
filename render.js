

export function render(comments) {


  const commensHtml = comments.map((comment, index) => {

    return `
    <div class="container">
    <ul class="comments" id="list">
    </ul>
    <li class="comment" data-text="${comment.textComment}" data-name="${comment.userName}">
        <div class="comment-header">
          <div>${comment.userName}</div>
          <div>${comment.fullDate}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.textComment}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.countLikes}</span>
            <button data-index ="${index}" class="like-button ${comment.checkLike ? '-active-like' : ''}"></button>
          </div>
        </div>
      </li>
      <div class="sign">`;


  })
    .join('');




  return commensHtml;
};
