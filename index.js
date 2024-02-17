const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5004;

app.listen(PORT, () => console.log("APP IS LIVE......"));

// Get all books
app.get("/books", (req, res) => {
    fs.readFile("./books.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Failure",
                error: "Error reading the file"
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Success",
                data: JSON.parse(data)
            });
        }
    });
});

// Add a new book
app.post("/books", (req, res) => {
    fs.readFile("./books.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Failure",
                error: "Error reading file"
            });
        }

        const { price, quantity, name } = req.body;

        if (price <= 0 || quantity <= 0 || name === "") {
            return res.status(400).json({
                status: 400,
                message: "Failure",
                error: "Invalid book data provided"
            });
        }

        const books = JSON.parse(data);
        const maximumId = Math.max(...books.map(book => book.id));
        const newBook = { id: maximumId + 1, name, quantity, price };

        books.push(newBook);

        fs.writeFile('books.json', JSON.stringify(books), (err) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Failure",
                    error: "Error writing to file"
                });
            } else {
                return res.status(201).json({
                    status: 201,
                    message: "Success",
                    data: newBook
                });
            }
        });
    });
});

// Get a single book by ID
app.get("/books/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile("./books.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Failure",
                error: "Error reading the file"
            });
        } 
        
        data = JSON.parse(data);
        let foundBook = data.find(book => book.id == id);
        if (foundBook) {
            res.json({
                status: 200,
                message: "Success", 
                data: foundBook
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Book not found",
                error: null
            });
        }
    });
});

// Update a book
app.put("/books/:id", (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    try {
        const data = fs.readFileSync("./books.json", "utf8");
        const books = JSON.parse(data);

        const index = books.findIndex((book) => book.id === id);

        if (index !== -1) {
            books[index] = { ...books[index], ...newData };

            fs.writeFileSync("./books.json", JSON.stringify(books));

            res.status(200).json({
                status: 200,
                message: "Success",
                data: books[index]
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Book not found",
                error: null
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Failure",
            error: error.message
        });
    }
});

// Delete a book
app.delete("/books/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile("./books.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Failure",
                error: "Error reading the file"
            });
        } 
        
        let books = JSON.parse(data);
        const index = books.findIndex((book) => book.id === id);

        if (index !== -1) {
            books.splice(index, 1);

            fs.writeFile("./books.json", JSON.stringify(books), (err) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: "Failure",
                        error: "Error writing to file"
                    });
                } else{

                res.status(200).json({
                    status: 200,
                    message: "Success",
                    data: null
                });
            }
            });
        } else{
            res.status(404).json({
                status: 404,
                message: "Book not found",
                error: null
            });
        }
    });
});
