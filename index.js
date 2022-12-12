import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import "dotenv/config";

import { loginValidation, registerValidation, blogValidation } from "./utils/validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { getHome, UserControllers, BlogControllers } from "./controllers/index.js";

mongoose
    .connect(String(process.env.MONGO_URI))
    .then(() => console.log("DATABASE OK"))
    .catch(err => console.log("DATABASE FAILED", err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync("uploads")) {
            fs.mkdirSync("uploads");
        }
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// HOME
app.get("/", getHome);

// UPLOAD
app.post("/upload", checkAuth, upload.single("image"), (request, response) => {
    response.json({
        url: `/uploads/${request.file.originalname}`,
    });
});

// AUTH
app.post("/auth/login", loginValidation, handleValidationErrors, UserControllers.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserControllers.register);
app.get("/auth/me", checkAuth, UserControllers.getMe);

// POSTS
app.get("/posts/post/:id", BlogControllers.getOne);
app.get("/posts/latest", BlogControllers.getAll);
app.get("/posts/popular", BlogControllers.getSortPostsPopular);
app.get("/posts/tag/:tag_name", BlogControllers.getPostsByTag);
app.get("/tags", BlogControllers.getTags);

app.post("/posts", checkAuth, blogValidation, handleValidationErrors, BlogControllers.create);
app.delete("/posts/:id", checkAuth, BlogControllers.remove);
app.patch("/posts/:id", checkAuth, blogValidation, handleValidationErrors, BlogControllers.update);
app.patch("/posts/:id/comment", checkAuth, BlogControllers.newCommentUpdate);

const PORT = process.env.PORT || 8080;
app.listen(PORT, err => {
    if (err) {
        return console.log("RUN FAILED", err);
    }
    console.log("SERVER IS RUNNING ON PORT " + PORT);
});
