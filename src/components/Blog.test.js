import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Blog For Test",
    author: "Ujjwol",
    likes: 0,
    url: "nourl",
  };

  const component = render(
    <Blog blog={blog} user="Ujjwol D" createdBy="Ujjwol D" />
  );

  expect(component.container).toHaveTextContent("Blog For Test Ujjwol");
});

test("clicking the button calls event handler once", () => {
  const blog = {
    title: "Blog For Test",
    author: "Ujjwol",
    likes: 0,
    url: "nourl",
  };

  const component = render(
    <Blog blog={blog} user="Ujjwol D" createdBy="Ujjwol D" />
  );

  const button = component.getByText("View");
  fireEvent.click(button);
  expect(component.container.querySelector("#likes")).toHaveTextContent("0");
  expect(component.container.querySelector("#url")).toHaveTextContent("nourl");
});

test("clicking the button calls event handler twice", () => {
  const blog = {
    title: "Blog For Test",
    author: "Ujjwol",
    likes: 0,
    url: "nourl",
  };

  const mockHandler = jest.fn();

  const component = render(
    <Blog
      blog={blog}
      user="Ujjwol D"
      createdBy="Ujjwol D"
      updateBlog={mockHandler}
    />
  );

  component.debug();
  const button = component.getByText("View");
  fireEvent.click(button);
  const likebutton = component.container.querySelector("#likeButton");
  fireEvent.click(likebutton);
  fireEvent.click(likebutton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
