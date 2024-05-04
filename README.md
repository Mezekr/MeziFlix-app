# Movie App

A web application that allows users to access information about different films, directors and genres. Users will be able to register, update their personal information and create a list of their favourite films.

## Features

Return a list of ALL movies to the user:

-   Return data (description, genre, director, image URL, whether it’s featured or not) about a  single movie by title to the user
-   Return data about a genre (description) by name/title (e.g., “Thriller”)
-   Return data about a director (bio, birth year, death year) by name
-   Allow new users to register
-   Allow users to update their user info (username, password, email, date of birth)
-   Allow users to add a movie to their list of favorites
-   Allow users to remove a movie from their list of favorites
-   Allow existing users to deregister

## Documentation
### API Endpoints
#### Get all movies
    URL: GET /movies
    Request body: None
    Response body: List of movies as a JSON object.
#### Get a single movie
    URL: GET /movies/[title]
    Request body: None
    Response body: Movie data (title, year, genre, director...) as JSON object 
#### Get all users
    URL: GET /users
    Request body: None
    Response body: List of users as a JSON object.
#### Get a single user
    URL: GET /users/[Username]
    Request body: None
    Response body: User data (username, password, email, birthday, favorite movies) as JSON object.
#### Post new user (register)
    URL: POST /users
    Request body: User data provided by the user as a JSON object.
    Response body: A JSON object with data about the added user, including an ID.
#### Put user information (update)
    URL: PUT /users/[Username]
    Request body: User data provided by the user to update data as a JSON object.
    Response body: A JSON object with data about the updated user.
#### Post movie to users favorite movies list
    URL: POST  /users/[Username]/movies/[MovieID]
    Request body: None
    Response body: Updated user information and the added favorite movie as a JSON object.
#### Delete movie from users favorite movie list
    URL: DELETE /users/[Username]/movies/[MovieID]
    Request body: None
    Response body:Updated user information and the removed favorite movie as a JSON object.

#### Delete user
    URL: DELETE /users/[Username]
    Request body: None
    Response body: Text message indicating whether the user successfully unregistered.
 **Note** : ` See documentation.html in the public folder of the repository for more detaild info.`

 ## Tech Stack
 - Nodejs
 - Express
 - MongoDB and Mongoose
 - Javascript
 - Git and Github
 - JSON Web Token (JWT) Authorization
 
