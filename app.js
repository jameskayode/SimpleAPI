const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = 5004;

app.listen(PORT, () => console.log("App is live and running"));

let movies = [
    {
        "id": 1,
        "name": "The Shawshank Redemption"
    },
    {
        "id": 2,
        "name": "The Godfather"
    },
    {
        "id": 3,
        "name": "The Dark Knight"
    },
    {
        "id": 4,
        "name": "Schindler's List"
    },
    {
        "id": 5,
        "name": "Pulp Fiction"
    }
];


//THIS IS TO LIST 
app.get("/movies", (request, response) => {
    // response.send(movies);

    response.json({
        status: 200,
        message:"Success",
        data:movies
    })
});


//this is SENDING SOMETHING TO THE SERVER

app.post("/movies", (request, response) => {
    console.log(request.body);
    movies.push(request.body);
    // response.send("Movie add success");
    response.json({
        status:201,
        message: "Movie add success",
        data:movies
    })
});


//using param
app.get("/movies/:id", (request, response) => {
    console.log(request.param);
    let id = request.params.id;
    let movie = movies.find(movie => movie.id == id);
    if (movie) {
        response.json({
            status: 200,
            message: "Movie found",
            data: movie
        });
    } else {
        response.json({
            status: 404,
            message: "Movie not found",
            data: null
        });
    }
});

