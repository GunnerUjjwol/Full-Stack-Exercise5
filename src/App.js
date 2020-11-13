import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(sortedBlogsByLikes(blogs));
    });
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(sortedBlogsByLikes(blogs.concat(returnedBlog)));
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setMessageType("success");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const handleBlogUpdate = (blogId, blogObject) => {
    blogService.update(blogId, blogObject).then((returnedBlog) => {
      const blogToUpdate = blogs.find((blog) => blog.id === blogId);
      const indexOfBlogToUpdate = blogs.indexOf(blogToUpdate);
      let blogListToUpdate = [...blogs];
      const updatedBlog = { ...returnedBlog, user: blogToUpdate.user };
      blogListToUpdate.splice(indexOfBlogToUpdate, 1, updatedBlog);
      setBlogs(sortedBlogsByLikes(blogListToUpdate));
    });
  };

  const handleBlogDelete = (blogId) => {
    blogService.deleteBlog(blogId).then(() => {
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage("wrong credentials");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      console.log("Wrong credentials");
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };
  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  );

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const sortedBlogsByLikes = (blogsToSort) => {
    const sortedBlogs = [...blogsToSort].sort((a, b) => b.likes - a.likes);
    return sortedBlogs;
  };

  return (
    <div>
      <Notification message={message} messageType={messageType} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <div>
            {user.username} logged in{" "}
            <button onClick={() => logout()}>Log out</button>
          </div>
          {blogForm()}
          <ul>
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                user={user}
                blog={blog}
                createdBy={blog.user}
                deleteBlog={handleBlogDelete}
                updateBlog={handleBlogUpdate}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
