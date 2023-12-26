import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let books = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Finish homework" },
  ];

app.get("/", (req, res) => {
    res.render("index.ejs", {
        mainTitle: "Today",
        listBooks: books,
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});