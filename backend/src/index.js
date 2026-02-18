import { connectDB } from "./db/index.js"
import { app } from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

// throw error will throw the error to its catch() block to handle it
// STARTUP FLOW:
// 1. Connect to Database first.
// 2. ONLY if DB connects (.then), start the Server.
// 3. If DB fails (.catch), kill the application immediately.

connectDB()
.then(() => {
    // SUCCESS: Database connected successfully. Now we start the server.
    const PORT = process.env.PORT || 3004
    
    // ERROR HANDLER 1: Application-level errors (Rare)
    // This listens for errors emitted by the Express app object itself.
    // Note: This is an EVENT LISTENER. It runs asynchronously, potentially hours after startup.
    app.on("error", (error) => {
        console.log("ERRR: ", error);
        throw error // Throws an Uncaught Exception, causing the process to crash (which is good, see below).
    })

    // START SERVER
    const server = app.listen(PORT, () => {
        console.log(`Server is listening on: http://localhost:${PORT}`);
    })

    // ERROR HANDLER 2: Server-level errors (e.g., Port already in use)
    server.on("error", (error) => {
        console.log(`Server encountered an error: ${error}`)
        throw error // Crash app so deployment tools can restart it.
    })
})
.catch((err) => {
    // FAILURE: Database connection failed during startup.
    // This catches the error THROWN from src/db/index.js
    console.log("MONGO db connection failed !!! ", err);
    
    // CRITICAL: Exit the process.
    // Why? The app cannot function without a database. 
    // Usage: process.exit(1) terminates the Node.js process with a 'failure' code.
    process.exit(1) 
})

/* 
SUMMARY OF ERROR HANDLING:
1. DB Connection (.catch):
   - Caught gracefully during startup.
   - Logs error and exits process cleanly.

2. Runtime Errors (app.on / server.on):
   - These happen AFTER the .then() block has finished.
   - 'throw error' here creates an "Uncaught Exception".
   - Node.js default behavior for Uncaught Exceptions is to print the stack trace and EXIT.
   - This is desired: A generic server error usually means the app is in an unstable state and should be restarted.

3. Sync vs Async Error Handling:
   - Synchronous Code: A standard 'try...catch' block works perfectly.
     Example: 
     try { JSON.parse("invalid") } catch(e) { handle(e) }

   - Asynchronous Code (Promises/Async-Await):
     - option A: Use 'await' inside a 'try...catch' block.
       try { await connectDB() } catch(e) { handle(e) }
     - option B: Use '.catch()' on the promise chain.
       connectDB().then(...).catch(e => handle(e))
     
     ! CRITICAL GOTCHA !
     If you have an async function but do NOT use 'await' or '.catch()', the error might be swallowed or cause an "Unhandled Promise Rejection".
     
   - Asynchronous Code (Callbacks/Event Emitters like app.on):
     - A 'try...catch' block AROUND the callback registration WILL NOT catch errors INSIDE the callback.
     - You must handle errors INSIDE the callback function itself.

    *Note*: Because try-catch will finish executing before the callback function returns the error, so at the time of error returns from the callback there is no try-catch there to handle that error.
*/