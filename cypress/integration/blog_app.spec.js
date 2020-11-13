describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Testing User",
      username: "testingUser",
      password: "12345678",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.get("#username").type("testingUser");
    cy.get("#password").type("12345678");
    cy.get("#login-button").click();

    cy.contains("testingUser logged in");
  });

  describe("Login", function () {
    it("fails with wrong credentials", function () {
      cy.get("#username").type("testingUser");
      cy.get("#password").type("123456789");
      cy.get("#login-button").click();
      cy.get(".error").contains("wrong credentials");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });

    it("succeeds with correct credentials", function () {
      cy.get("#username").type("testingUser");
      cy.get("#password").type("12345678");
      cy.get("#login-button").click();

      cy.contains("testingUser logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "testingUser", password: "12345678" });
      cy.createBlog({
        title: "a blog created by cypress",
        author: "Cypress",
        url: "www.cypress.com",
        likes: 7,
      });
      cy.createBlog({
        title: "a second blog created by cypress",
        author: "Cypress",
        url: "www.cypress.com",
        likes: 3,
      });
      cy.createBlog({
        title: "blog with most likes",
        author: "Cypress",
        url: "www.cypress.com",
        likes: 14,
      });
    });

    it("A blog can be created", function () {
      cy.contains("a blog created by cypress");
    });

    it("A user can like the blog", function () {
      cy.get(".singleBlog:first").as("blogToTest");
      cy.get("@blogToTest").contains("View").as("viewButton");
      cy.get("@viewButton").click();
      cy.get("@viewButton").parent().get("#likeButton").click();
    });

    it("the user who created a blog can delete it", function () {
      cy.get(".singleBlog:first").as("blogToTest");
      cy.get("@blogToTest").contains("View").click();
      cy.get("@blogToTest").get("#removeButton").click();
      cy.contains("blog with most likes").should("not.exist");
    });

    it("the blogs are ordered according to likes with the blog with the most likes being first", function () {
      var likes = [];
      cy.get("#numberOfLikes").each((elements) => {
        likes.push(elements.text());
      });
      cy.wrap(likes).should("equal", likes.sort());
    });
  });
});
