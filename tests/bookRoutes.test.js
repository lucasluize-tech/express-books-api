process.env.NODE_ENV="test"

const request = require('supertest')
const Book = require('../models/book')
const app = require("../app");
const db = require("../db");



beforeEach(async function () {
    await db.query("DELETE FROM books");

    let u1 = await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
    });
});

describe("/GET routes", function () {
    test("GET all books in db", async function () {
        let book = await db.query("SELECT * FROM books")
        const result = await request(app).get('/books')
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ books: book.rows })
    })
    
    test("GET book by isbn", async function () {
        let book = await db.query("SELECT * FROM books")
        const result = await request(app).get('/books/0691161518')
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({ book: book.rows[0] })
    })
    
    test("GET invalid book", async function () {
        const result = await request(app).get('/books/0691161123')
        expect(result.statusCode).toBe(404)
    })
    
})

describe("/POST routes", function () {
    test("Create a new Book", async function () {
        const results = await request(app).
            post("/books").
            send({
                isbn: "0691161123",
                amazon_url: "http://a.co/eobPtX2",
                author: "Lucas Luize",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Testing Express Routes like a PRO!",
                year: 2021
            })
        expect(results.statusCode).toBe(201)
        expect(results.body).toEqual({
            book: {
                isbn: "0691161123",
                amazon_url: "http://a.co/eobPtX2",
                author: "Lucas Luize",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Testing Express Routes like a PRO!",
                year: 2021
            }
        })
    })
    
    test("Create with Invalid isbn type", async function () {
        const results = await request(app).
            post("/books/0691161518").
            send({
                isbn: 69123875,
                amazon_url: "http://a.co/eobPtX2",
                author: "Lucas Luize",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Testing Express Routes like a PRO!",
                year: 2021
            })
        expect(results.statusCode).toBe(404)
    })
})

describe("/PUT routes", function () {
    test("Edit a Book", async function () {
        const results = await request(app).
            put("/books/0691161518").
            send({
                isbn: "0691161518",
                author: "Lucas Luize",
                title: "Testing Express Routes like a PRO!",
                year: 2021
            })
        expect(results.statusCode).toBe(200)
        expect(results.body).toEqual({
            book: {
                isbn: "0691161518",
                amazon_url: null,
                author: "Lucas Luize",
                language: null,
                pages: null,
                publisher: null,
                title: "Testing Express Routes like a PRO!",
                year: 2021
            }
        })
    })
    
    test("Edit with Invalid book", async function () {
        const results = await request(app).
            post("/books/12312").
            send({
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Lucas Luize",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Testing Express Routes like a PRO!",
                year: 2021
            })
        expect(results.statusCode).toBe(404)
    })
    test("Edit with Invalid isbn type", async function () {
        const results = await request(app).
            post("/books/0691161518").
            send({
                isbn: 69123875,
                amazon_url: "http://a.co/eobPtX2",
                author: "Lucas Luize",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Testing Express Routes like a PRO!",
                year: 2021
            })
        expect(results.statusCode).toBe(404)
    })
});

describe("/DELETE routes", function () {
    test("DELETE a book with isbn", async function () {
        const res = await request(app).delete("/books/0691161518")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "Book deleted" })
    })
});

         
afterAll(async function () {
    await db.end();
});