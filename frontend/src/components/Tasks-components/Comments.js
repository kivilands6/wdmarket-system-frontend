import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios'
import StateContext from '../../StateContext'
import TaskNotDraggable from './TaskNotDraggable'

function Comments({task}) {
    const appState = useContext(StateContext)
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState([])
    const [commentCount, setCommentCount] = useState(0)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function getComments(){
            try{
                const response = await Axios.get('/all-comments', {cancelToken: ourRequest.token})
                setComments(response.data)
            }
            catch(e){
                console.log("There was a problem or the request was canceled!")
            }
        }
        getComments()
        return () => {
            ourRequest.cancel()
        }
    }, [commentCount])

    function handleNewComment() {
        if(newComment.length > 3) {
            const ourRequest = Axios.CancelToken.source()
            async function addNewComment(){
                try{
                    const response = await Axios.post('/create-comment',{
                        content: newComment,
                        taskId: task._id,
                        user: appState.user.username
                    }, {cancelToken: ourRequest.token})
                    setNewComment("")
                    setCommentCount(commentCount + 1)
                    
                }
                catch(e){
                    console.log("There was a problem or the request was canceled!")
                }
            }
            addNewComment()
            return () => {
                ourRequest.cancel()
            }
        } else {
            // throw error
        }
    }

  return (
    <div>
        <h2 className="comments-label text-xl text-bold">Comments:</h2>
        <div className="add-comment">
            <input value={newComment} onChange={e => {
                setNewComment(e.target.value)
            }} id="new-comment" name="comment" className="w-full py-2 px-5 rounded-xl border-gray-200 border mt-4 focus:border-[#1BC00C]" type="text" placeholder="New comment" autoComplete="off" />
            <button className="py-3 mr-4 text-[#B5B5B5] rounded-xl" onClick={() => setNewComment("")}>Discard</button>
            <button className="py-3 text-[#1BC00C] rounded-xl" onClick={handleNewComment}>Add comment</button>
        </div>
        <div className="comments mt-10">
            {comments.filter(comment => task._id == comment.taskId).map(comment => (
                <div className="flex justify-between mt-4 bg-white p-4 rounded-xl">
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-info">{comment.user + " " + comment.date}</div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Comments