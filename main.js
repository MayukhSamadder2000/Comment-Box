let commentsObjects = {}
let commentId = 0
let selectedCommentId = null
const submitComment = (isChild = false, commentIdParam) => {
    let comment = {
        user:"",
        comment:"",
        comment_id: commentIdParam ? commentIdParam : commentId++,
        children:{},
        isEdited: false,
        isChild: commentIdParam ? true : false,
        enableReply: false,
    }
    comment.user = document.getElementById("username").value
    comment.comment = document.getElementById("commentdesc").value
    commentsObjects[commentId] = comment
    let rootElement = document.getElementById("comment__list");
    rootElement.innerHTML = ``
    let commentThread = generateCommentListOnDOM(commentsObjects,1,rootElement);
}

const generateCommentListOnDOM = (children = {}, depth = 1, parent, enableReplyParam) => {
    let comments = Object.keys(children)
    if(depth === 1){
        parent.innerHTML = ``
    }
    if(comments.length){
        comments.forEach(comment => {
            let gap = depth
            let element = document.createElement('div')
            element.style=`margin-bottom:1rem; max-width:30rem; padding-left:${gap}rem;`
            element.innerHTML = children[comment].comment
            let spanElement = document.createElement('span');
            spanElement.style="color:blue; cursor:pointer; padding-left:1rem;"
            spanElement.innerHTML = "Reply"
            spanElement.onclick = function() {
                children[comment].enableReply = true;
                generateCommentListOnDOM(commentsObjects, 1, parent, comment)
            }
            element.appendChild(spanElement)
            parent.appendChild(element);
            if(enableReplyParam === comment){
                let wrapper = document.createElement('div')
                wrapper.style = `margin-bottom:1rem; max-width:30rem; padding-left:${gap}rem; display: flex;
                flex-direction: column;`
                let textArea = document.createElement('textarea')
                textArea.style = "padding:1rem;margin-bottom:1rem;"
                textArea.setAttribute('id', `$comment__commentdesc__${comment}`)
                let userInput = document.createElement('input')
                userInput.style = "padding: 10px; margin-bottom: 1rem;"
                userInput.setAttribute('placeholder', 'Username');
                let submitButton = document.createElement('button');
                submitButton.innerHTML = "Comment"
                submitButton.style = "max-width: 6rem; padding: 0.75rem 1rem;"
                submitButton.onclick = function () {
                    replyToComment(comment, children, false, document.getElementById(`$comment__commentdesc__${comment}`).value)
                    children[comment].enableReply = false;
                    generateCommentListOnDOM(commentsObjects, 1, parent)
                }
                wrapper.appendChild(textArea);
                wrapper.appendChild(userInput)
                wrapper.appendChild(submitButton);
                parent.appendChild(wrapper);
            }
            
            if(Object.keys(children[comment].children).length){
                generateCommentListOnDOM(children[comment].children, depth+1, parent, enableReplyParam)
            }
        });
        return true
    }
    return false
}

function replyToComment(commentIdParam, children, indepth = false, text, user) {
    let truth = false
    Object.keys(children).forEach(comment => {
        let commentObj = {
            user:user,
            comment:text,
            comment_id: commentId++,
            children:{},
            isEdited: false,
            isChild: true,
            enableReply:false,
        }
        if(comment === commentIdParam){
            children[comment].children[commentId++] = commentObj
            truth = true
            return truth
        }else if(Object.keys(children[comment].children).length){
            truth = replyToComment(commentIdParam, children[comment].children, true, text)
            if(truth){
                return truth
            }
        }
    });
    return truth
}