import React, { useState } from "react";
const Blog = ({ user, blog, createdBy, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [detailedView, setDetailedView] = useState(false);
  const visibilityStyle = { display: detailedView ? "" : "none" };

  const toggleDetailedView = () => {
    setDetailedView(!detailedView);
  };

  const updateLike = (event) => {
    event.preventDefault();
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.author,
      user: createdBy?.id,
      likes: blog.likes + 1,
    };
    updateBlog(blog.id, blogToUpdate);
  };

  const deleteBlogFromBlogs = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div className="singleBlog" style={blogStyle}>
      {blog.title} {blog.author}
      <button type="submit" onClick={toggleDetailedView}>
        {!detailedView ? "View" : "Hide"}
      </button>
      <div style={visibilityStyle}>
        <div id="url">{blog.url}</div>
        <div id="likes">
          <span id="numberOfLikes">{blog.likes}</span>
          <button id="likeButton" type="submit" onClick={updateLike}>
            like
          </button>
        </div>
        <div>{createdBy?.name}</div>
        {user.name === createdBy?.name ? (
          <button id="removeButton" type="submit" onClick={deleteBlogFromBlogs}>
            remove
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Blog;
