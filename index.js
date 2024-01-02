import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "library",
    password: "12345",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let currentUserId = 1;

let members = [
    { id: 1, name: "Powerp", color: "blue" },
];

let books = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Finish homework" },
];

async function getBooks() {
    const result = await db.query(
        "SELECT * FROM books WHERE user_id = $1",
        [currentUserId]
    );

    let books = [];
    result.rows.forEach((book) => {
        books.push({
            id: book.id,
            title: book.book_name,
        });
    });

    return books;
}

async function getCurrentUser() {
    const result = await db.query("SELECT * FROM members");
    members = result.rows;
    return members.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
    const books = await getBooks();
    const currentUser = await getCurrentUser();

    res.render("index.ejs", {
        mainTitle: "Your Library",
        listBooks: books,
        members: members,
        color: currentUser.color,
    });
});

app.post("/user", async (req, res) => {
    if (req.body.add == "new") {
        res.render("new.ejs");
    }
    else {
        currentUserId = req.body.user;
        res.redirect("/");
    }
});

app.post("/new", async (req, res) => {
    const name = req.body.name;
    const color = req.body.color;

    const result = await db.query(
        "INSERT INTO members (name, color) VALUES($1, $2) RETURNING *;",
        [name, color]
    );

    const id = result.rows[0].id;
    currentUserId = id;

    res.redirect("/");
});

app.post("/add", async (req, res) => {
    const book = req.body.newBook;
    
    await db.query("INSERT INTO books (book_name, user_id) VALUES ($1, $2)", [book, currentUserId]);
    res.redirect("/");
});


app.post("/edit", async (req, res) => {
    await db.query("UPDATE books SET book_name = ($1) WHERE id = ($2)", [req.body.updatedBookTitle, req.body.updatedBookId]);
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    await db.query("DELETE FROM books WHERE id = ($1)", [req.body.deleteBooksId]);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
}); 