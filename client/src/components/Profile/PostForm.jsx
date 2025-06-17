export default function PostForm() {
    return (
        <section className="post-form">
            <h2>Posts</h2>
            <form>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea id="content" name="content"></textarea>
                </div>
                <button type="submit">Post</button>
            </form>
            
            </section>
    )
}
// This component is a form for creating posts. It includes fields for the title and content of the post, and a button to submit the form.