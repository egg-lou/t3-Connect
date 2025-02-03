import { Elysia } from "elysia";
import { Database } from 'bun:sqlite'
import { Html, html } from "@elysiajs/html";
import { Home } from "./components";

const DB_NAME = 'submissions.db'
const PORT = 4000

const app = new Elysia()
const db = new Database(DB_NAME)

db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        message TEXT,
        linkedInUrl TEXT,
        githubUrl TEXT
    )`)


app.use(html())
app.get('/', () => {
    return <Home />
})

app.ws('/ws', () => {

})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})
