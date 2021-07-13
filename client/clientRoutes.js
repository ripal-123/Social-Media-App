import path from "path";
import express from "express";
export const clientRoutes = (app) => {
  app.use(express.static(path.join(__dirname, "static")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./static/home.html"));
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "./static/login.html"));
  });
};
