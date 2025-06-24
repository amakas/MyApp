import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
export default function PostList({ posts, setPosts }) {
    if (!posts || posts.length === 0) {
        return <div className="post-list">No posts</div>;
    }
     const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

    
    const handleEditClick = (post) =>{
      setEditingId(post._id);
      setEditedContent(post.content)
    }

    const handleSave = async (id) =>{
      const token = localStorage.getItem('token');
      try{
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        },
         body: JSON.stringify({ content: editedContent })
      })
      if(response.ok){
        setPosts(prev => prev.map(post => post._id === id ? { ...post, content: editedContent } : post));
        setEditingId(null);
        setEditedContent('');
      } else {
        alert('Failed to update post');
      }
    } catch (error){
      console.error("Error updating post", error)
    }
    }
    
    const handleDelete = async (id) => {
      const token = localStorage.getItem('token')
      try{
      const response = await fetch(`/api/posts/${id}`,{
        method:'DELETE',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      })
      if(response.ok) {
       setPosts(prev => [...prev.filter(post => post._id !== id)]);
       alert("Post deleted")
      }
      else{
        alert("Fail to delete post")
      }
    } catch(error){
      console.error("Error deleting", error)   
     }
    }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post._id}  className="post-item" >
          <h2>{post.title}</h2>
          {editingId===post._id?(
          <>
            <textarea  value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
            <button onClick={() => handleSave(post._id)}>Save</button>
            <button onClick={()=>setEditingId(null)}>Cancel</button>
          </>)
          :
          ( <>
           <p>{post.content}</p>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
          <button onClick={() => handleEditClick(post)}>Edit</button>
          </>
          )}
        </div>
      ))}
    </div>
  );
}