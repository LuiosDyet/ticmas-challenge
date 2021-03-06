# Vi-Datec Full-Stack Challenge

## Backend

-   port: 8080
-   mysql port: 3306
-   mongoDB port: 27017

### commands

    cd backend
    run: npm run dev
    test 1: npm test -- userRoutes.test.js
    test 2: npm test -- todosRoutes.test.js
    lint: npm run lint
    lint-fix: npm run lint:fix

## Frontend

-   port: 3000

### commands

    cd frontend
    run: npm start
    test: npm test
    lint: npm run lint
    lint-fix: npm run lint:fix

### Docker

-   frontend port: 8888
-   backend port: 6868
-   mysql port: 3307
-   mongoDB port: 27017

### commands

    build: docker-compose build
    run: docker-compose up

## Challenge

The test consists of the development of a TODOs app.

## The app must:

-   &#9745; Use React for UI rendering
-   &#9745; Be responsive down to mobile phone screen sizes
-   &#9745; Use a Node backend (with Express or some web framework like NestJS)
-   &#9745; Authenticate requests with JWT
-   &#9745; Have a README file
-   &#9745; Have the source code hosted on Github or GitLab

### The frontend app must:

-   &#9745; Have a single page where all TODOs are listed.
-   &#9745; Each TODO item can be marked as done.
-   &#9745; Each TODO item can be deleted.
-   &#9745; A new TODO item can be created.

### The backend service must:

-   &#9745; Be the source of truth about the existing TODO items, and the status (completed / not
    completed) of each of them.
-   &#9745; Have 1 endpoint that generates a JWT for the user
-   &#9745; Implement REST API endpoints for the

### Bonus points

-   &#9745; Include tests for the application code (backend, frontend, or both).
-   &#9745; Use an ESLint/TSLint config and a npm command to lint all files.
-   &#9745; Use a database for persistence.
-   &#9745; Provide a docker-compose file with containers for frontend, backend and database.
