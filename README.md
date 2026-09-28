# Spec-Driven Development: Engineering with Intent (Manning Publications) Companion Code

This repository contains companion code for the book [_Spec-Driven Development: Engineering with Intent (Manning Publications)_](https://hubs.ly/Q04vSdlS0).

<img width="1584" height="396" alt="linkedin profile banner" src="https://github.com/user-attachments/assets/6e80ce16-4daa-454d-a685-83ec0e0a146f" />

# Spec Driven Development integration with Project Backlog Board

This repository contains the companion code for the Chapter 5 Spec Driven Development integration with Project Backlog Board exercise.

If you want to follow the evolution of the exercise, inspect the commit history. Each iteration shows the prompt used by the coding agent and the code changes introduced in that step.

# Project Details

A dependency-free CommonJS Node.js application. Requires Node.js 22 or newer. No installation step is needed.

Start the application:

```sh
npm start
```

Open http://localhost:3000, enter an absolute HTTP or HTTPS destination, and choose **Shorten URL**. The result is a clickable short URL. Anyone with that link can follow it while the application remains running.

Run the automated tests (no external network requests):

```sh
npm test
```

## Configuration

`PORT` defaults to `3000` and must be an integer from 1 to 65535. For example:

```sh
PORT=3100 npm start
```

`BASE_URL` controls the origin displayed in generated links, defaulting to `http://localhost:<PORT>`. Set it to the browser-accessible origin if different:

```sh
PORT=3100 BASE_URL=http://127.0.0.1:3100 npm start
```

