import "dotenv/config.js";
import express from "express";
import { indexRouter } from "./routes/indexRouter.js";
import { postsRouter } from "./routes/postsRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { commentsRouter } from "./routes/commentsRouter.js";
import passport from "passport";
import { initialize } from "./authUtils.js";
import cors from 'cors';
import { globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());

initialize(passport);

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

app.use(globalErrorHandler);

export default app;

if(process.env.NODE_ENV !== 'test'){
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}!`);
    })

    // Handle server errors
    server.on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });
}




