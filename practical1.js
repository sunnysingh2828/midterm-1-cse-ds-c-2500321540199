const http = require('http');

// Library Books
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "fiction"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        category: "self-help"
    },
    {
        id: 3,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "finance"
    }
];

// Create HTTP Server
const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");

    // GET - Display All Books
    if (req.method === "GET" && req.url === "/books") {
        res.writeHead(200);
        res.end(JSON.stringify(books));
    }

    // GET - Display Book By ID
    else if (req.method === "GET" && req.url.startsWith("/books/")) {
        const id = parseInt(req.url.split("/")[2]);
        const book = books.find(b => b.id === id);

        if (book) {
            res.writeHead(200);
            res.end(JSON.stringify(book));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Book not found" }));
        }
    }

    // POST - Add New Book
    else if (req.method === "POST" && req.url === "/books") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                if (!data.title || !data.author || !data.category) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({
                        message: "All fields are required"
                    }));
                }

                const newBook = {
                    id: books.length
                        ? Math.max(...books.map(b => b.id)) + 1
                        : 1,
                    title: data.title,
                    author: data.author,
                    category: data.category
                };

                books.push(newBook);

                res.writeHead(201);
                res.end(JSON.stringify({
                    message: "Book added successfully",
                    book: newBook
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Invalid JSON" }));
            }
        });
    }

    // PUT - Update Book
    else if (req.method === "PUT" && req.url.startsWith("/books/")) {
        const id = parseInt(req.url.split("/")[2]);
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const book = books.find(b => b.id === id);

                if (!book) {
                    res.writeHead(404);
                    return res.end(JSON.stringify({
                        message: "Book not found"
                    }));
                }

                if (!data.title || !data.author || !data.category) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({
                        message: "All fields are required"
                    }));
                }

                book.title = data.title;
                book.author = data.author;
                book.category = data.category;

                res.writeHead(200);
                res.end(JSON.stringify({
                    message: "Book updated successfully",
                    book: book
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Invalid JSON" }));
            }
        });
    }

    // DELETE - Remove Book
    else if (req.method === "DELETE" && req.url.startsWith("/books/")) {
        const id = parseInt(req.url.split("/")[2]);
        const index = books.findIndex(b => b.id === id);

        if (index === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Book not found" }));
        } else {
            const deletedBook = books.splice(index, 1)[0];

            res.writeHead(200);
            res.end(JSON.stringify({
                message: "Book deleted successfully",
                book: deletedBook
            }));
        }
    }

    // Invalid Route
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

// Start Server
server.listen(3000, () => {
    console.log("Library Management Server running at http://localhost:3000");
});