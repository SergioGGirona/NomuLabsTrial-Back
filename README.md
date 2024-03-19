# NomuLabs trial: Simple Social Network

## Technical Challenge Description

The goal of this challenge is to evaluate candidates' technical skills in developing a Simple Social Network using Node.js and React.js. Candidates should create an application that allows users to register, search for other users by username, create posts, follow other users, view content created by the users they follow, set privacy settings, and perform actions such as commenting and liking posts.

## Minimum Requirements:

1. Create a Simple Social Network web application using Node.js and React.js.
2. Implement user authentication, allowing users to register and log in.
3. Provide a user search functionality by username.
4. Users should be able to follow and unfollow other users.
5. Users should be able to view a feed of content
6. Provide an option for users to configure their profiles as public or private.
7. Implement a commenting system on posts.
8. Implement the ability to like posts.

## The backend

Uploaded in Render:
https://nomulabstrial-back.onrender.com

### Data Model

In this simple social network we have two entities, User, Post and Comment which relate to each other 1 to n and 1 to n (user - post/comment) and 1 to n (post-comment). User will have an ImageData property, which will use the Cloudinary schema, the service that will be used to store images. But Comment and Post will no use cloudinary so multer will only be a middleware for form-data.

#### Data management

A connection is made to Mongo through Mongoose, Mongoose, a library for Node that allows us to write queries with validations and middlewares, to narrow down the data that is received and sent.

The repo makes the call to the database, while the controller manages the information that is sent and received.

There are 2 middlewares that change the information received: the Auth and de mediaFiles.
The first one encrypts the password and saves it already encrypted. It also has the method to check encrypted passwords and to provide tokens and check them. All focused on the register and login process.

The second one is in charge of managing the images uploaded by the user, both for the moment of registering and if he/she wants to update it later on.

### Error management

It's managed with a class and a middleware to manage errors in the back and send a message according to the type of error.

### Data movement

The requests will arrive at the server and the app will distribute them according to whether they are for users, posts or comments. Inside, the routes are split up in the CRUD and, depending on the type of request, an authorisation or authentication interceptor is used.

The request is also passed to the controller, which coordinates the application logic and calls the repository to send the appropriate responses.
Typing and error handling is present at all times in order to narrow down the data received and sent.

### Currently

The comments in the post have not been implemented, the next steps will be to create the model on the front end and to build the CRUD methods into it.
