import { Elysia, t } from "elysia";
import { Database } from 'bun:sqlite'
import { Html, html } from "@elysiajs/html";
import { Home, ProfileCardProps } from "./components";

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

// Function to get all profiles from database
const getProfiles = () => {
    const stmt = db.prepare('SELECT * FROM submissions ORDER BY id DESC')
    return stmt.all() as (ProfileCardProps & { id: number })[]
}

app.use(html())
app.get('/', () => {
    // Start with empty profiles, they will be loaded via WebSocket
    return <Home initialProfiles={[]} />
})

app.ws('/ws', {
    message(ws, rawMessage) {
        try {
            // Parse the raw message
            const data = typeof rawMessage === 'string' ? JSON.parse(rawMessage) : rawMessage

            // Extract only the fields we need
            const submission = {
                name: data.name,
                message: data.message,
                linkedInUrl: data.linkedInUrl,
                githubUrl: data.githubUrl
            }

            // Validate the submission
            if (!submission.name) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Name is required'
                }))
                return
            }

            if (data.type === 'update' && data.id) {
                // Update existing submission
                const stmt = db.prepare(`
                    UPDATE submissions 
                    SET name = ?, message = ?, linkedInUrl = ?, githubUrl = ?
                    WHERE id = ?
                `)
                
                stmt.run(
                    submission.name, 
                    submission.message || null, 
                    submission.linkedInUrl || null, 
                    submission.githubUrl || null,
                    data.id
                )

                // Send success response to the sender
                ws.send(JSON.stringify({
                    type: 'success',
                    message: 'Profile updated successfully'
                }))

                // Broadcast the updated profile to all clients
                app.server?.publish('profiles', JSON.stringify({
                    type: 'profile_updated',
                    data: { ...submission, id: data.id }
                }))
            } else {
                // Insert new submission
                const stmt = db.prepare(`
                    INSERT INTO submissions (name, message, linkedInUrl, githubUrl)
                    VALUES (?, ?, ?, ?)
                `)
                
                const result = stmt.run(
                    submission.name, 
                    submission.message || null, 
                    submission.linkedInUrl || null, 
                    submission.githubUrl || null
                )

                const newId = result.lastInsertRowid

                // Send success response to the sender with the new ID
                ws.send(JSON.stringify({
                    type: 'success',
                    message: 'Profile added successfully',
                    id: newId
                }))

                // Broadcast the new profile to all clients
                app.server?.publish('profiles', JSON.stringify({
                    type: 'profile',
                    data: { ...submission, id: newId }
                }))
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error)
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to add profile'
            }))
        }
    },

    // Handle new connections
    open(ws) {
        console.log('New client connected')
        ws.subscribe('profiles')

        // Send existing profiles to the new client
        const profiles = getProfiles()
        ws.send(JSON.stringify({
            type: 'initial_profiles',
            data: profiles
        }))
    },

    // Handle client disconnection
    close(ws) {
        console.log('Client disconnected')
        ws.unsubscribe('profiles')
    }
})

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})
