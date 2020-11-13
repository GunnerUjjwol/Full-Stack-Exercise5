import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";

test("<BlogForm /> updates parent state and calls onSubmit", () => {
  const createBlog = jest.fn();

  const component = render(<BlogForm createBlog={createBlog} />);

  const titleInput = component.container.querySelector("#titleInput");
  const authorInput = component.container.querySelector("#authorInput");
  const urlInput = component.container.querySelector("#urlInput");
  const form = component.container.querySelector("form");

  fireEvent.change(titleInput, {
    target: { value: "Testing Title" },
  });
  fireEvent.change(authorInput, {
    target: { value: "Testing Author" },
  });
  fireEvent.change(urlInput, {
    target: { value: "Testing Url" },
  });
  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe(
    "Testing Title"
  );
  expect(createBlog.mock.calls[0][0].author).toBe(
    "Testing Author"
  );
  expect(createBlog.mock.calls[0][0].url).toBe(
    "Testing Url"
  );
});
