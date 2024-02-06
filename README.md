# NomuLabs trial: Simple Social Network

## Technical Challenge Description

The goal of this challenge is to evaluate candidates' technical skills in developing a Simple Social Network using Node.js and React.js. Candidates should create an application that allows users to register, search for other users by username, create posts, follow other users, view content created by the users they follow, set privacy settings, and perform actions such as commenting and liking posts.

## Minimum Requirements:

1. Create a Simple Social Network web application using Node.js and React.js.
2. Implement user authentication, allowing users to register and log in.
3. Provide a user search functionality by username.
4. Users should be able to follow and unfollow other users.
5. Users should be able to view a feed of content that includes posts from the users they
   follow.
6. Provide an option for users to configure their profiles as public or private.
7. Implement a commenting system on posts.
8. Implement the ability to like posts.

## Extra Points (Optional):

1. Implement a notification system to inform users of new followers, comments, and likes.
2. Allow users to upload and manage profile pictures.
3. Implement a pagination or infinite scroll system to display posts in the feed.
4. Add the ability to edit and delete posts.
5. Implement direct messaging functionality between users.
6. Apply responsive design for mobile devices.

## Instructions:

1.  Candidates should create a private GitHub repository for this project and share access with the evaluator.
2.  Candidates have a timeframe of 10 days to complete the technical challenge.
3.  Candidates should create a README.md with basic documentation on how to set up and run
    the project including a list of the functionalities.
4.  Candidates should submit the GitHub repository link along with a brief description of
    themselves and their CV upon completion of the challenge to this email address:
    info@nomulabs.com.

## Data Model

In this simple social network we have two entities, User and Post, which relate to each other 1 to n. Both, user and post will have an ImageData property, which will use the Cloudinary schema, the service that will be used to store images.

## Database

A connection is made to Mongo through Mongoose, Mongoose, a library for Node that allows us to write queries with validations and middlewares, to narrow down the data that is received and sent.

## Error management

Create a class and a middleware to manage errors in the back and send a message according to the type of error,
