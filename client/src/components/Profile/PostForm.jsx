import { useState } from "react"

export default function PostForm({ setPosts }) {
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert('Post created');
        setPosts(prev => [data.post, ...prev]); 
        setFormData({ title: "", content: "" }); 
      } else {
        alert(data.message || 'Failed to create');
      }
    } catch (error) {
      console.error('Error posting:', error);
      alert('An error occurred while posting');
    }
  };

    return (
        <section className="post-form">
            <h2>Posts</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea id="content" name="content" value={formData.content} onChange={handleChange}></textarea>
                </div>
                <button type="submit">Post</button>
            </form>
            
            </section>
    )
}
