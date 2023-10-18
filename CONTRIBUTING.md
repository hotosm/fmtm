## 🤗 Welcome

👍🎉 First off, We are really glad you're reading this, because we need volunteer developers to help improve the Field Mapping Tasking Manager (FMTM)! Welcome to Field Mapping Tasking Manager (FMTM)! We're excited to have you join our community of contributors. Whether you're new to open source or an experienced developer, we value your contributions and are here to support you every step of the way. If you have any questions or need assistance, please don't hesitate to ask. 🎉👍

You can see an overview of the project and the process we have gone through in developing FMTM so far in these [slides](https://docs.google.com/presentation/d/1UrBG1X4MXwVd8Ps498FDlAYvesIailjjPPJfR_B4SUs/edit#slide=id.g15c1f409958_0_0) .

How to Contribute

There are several ways to contribute to the Field Mapping Tasking Manager:

## Testing

We're currently building the prototype, and your input is invaluable. Please help us by testing and providing feedback. If you're interested in coordinating field testing sessions, please reach out.

## Code contributions

Create pull requests (PRs) to propose changes or new features. Your code contributions are highly appreciated. Skills in the following technologies are beneficial:

- Python
- FastAPI
- Javascript
- React
- Docker
- CI/CD workflows

Our latest task board is available [here](https://github.com/orgs/hotosm/projects/22).

## Report bugs and suggest improvements

The [issue queue](https://github.com/hotosm/fmtm/issues) is the best way to get started. There are issue templates for BUGs and FEATURES that you can use, you could also create your own. Once you have submitted an issue, it will be assigned one label from the following [label categories](https://github.com/hotosm/fmtm/labels). If you are wondering where to start, you can filter by the **good first issue label**.

## :handshake: Thank you

We're grateful for your contributions. Please review our **Code of Conduct**.
If you have any questions about contributing on GitHub, don't hesitate to reach out to us via our Slack channel, **#geospatial-tech-and-innovation**.

# Code Contribution guidelines

## Workflow

We follow the "Fork & Pull" model for contributions it is explained at [About Pull Requests](https://help.github.com/articles/about-pull-requests/). Here's how it works:

Fork the Project: Fork the project into your own repository.

Create a Topic Branch: Create a topic branch in your repository to work on your contribution.

Make Pull Requests: Create one or more pull requests back to the main repository.

Review and Discussion: Your pull requests will be reviewed and discussed by other developers.

Documentation and Testing: Ensure that patches contain documentation updates and, for new features, include test cases when possible.

Focused Patches: Keep patches focused on a single feature to avoid merging complications with other developers.

# Reporting Problems

If you're reporting a problem, please include the following details:

- If you're reporting a problem, please include the following details:

- What you were trying to achieve
- What you did
- What you expected to happen
- What happened instead
- Relevant information about your platform and environment
- Include shell commands, log files, error messages, etc.
- Please open a separate issue for each problem, question or comment.This keeps issues small and manageable.

- Please open a separate issue for each problem, question, or comment you have. Do not re-use existing issues for other topics, even if they are similar. This keeps issues small and manageable and makes it much easier to follow through and make sure each problem is taken care of.

## Documentation

Project documentation should be in [Markdown
format](https://www.markdownguide.org/), and in a _docs_
subdirectory.We prefer using Markdown over HTML in Markdown documents for better readability.

## Coding Style

Python enforces a certain amount of style due to indent levels. Unlike
C/C++, we don't have to worry about curly braces. It is prefered that
all code follows object oriented techniques, with a minimal amount of
code other than basic control in the main function. This allows code
to be easily reused and run either standalone, or part of a REST API
backend. Code that is not designed to be run standalone can have a
main function to do simple testing during development. That test code
should be moved to a standalone test case when possible.
[Pytest](https://pytest.org/) is used as the test framework for
standalone test cases.

Code follows a [CamelCase](https://en.wikipedia.org/wiki/Camel_case)
style. Classes use an Upper Case for the first word, method use a
lower case for the first word. Variable names are all lower case with
an underbar as a word separator. Properly naming everything makes it
much easier to read the code and get an idea of what it is doing. This
enables people new to this project to contribute easier.

All methods should have a comment that can be used by
[pydoc](https://docs.python.org/3/library/pydoc.html). The usage of
base classes is encouraged so functionality can be shared. Comments in
the code are encouraged when necessary to explain code that may not be
obvious, but avoid over commenting as well. Code should be able to be
read like a book, with descriptive names used, no fancy tricks unless
required. Always be concious of performance and security.
