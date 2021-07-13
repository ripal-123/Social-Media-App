import {
  addScream,
  signupUser,
  getScreams,
  getScream,
  commentOnScream,
  loginUser,
  verifyToken,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  likeScream,
  unlikeScream,
  deleteScream,
} from "../controllers/appControllers";

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`
    );
  },
});
const upload = multer({ storage: storage });

const routes = (app) => {
  // Scream routes
  app.get("/api/screams", getScreams);
  app.post("/api/scream", verifyToken, addScream);
  app.get("/api/scream/:screamId", getScream);
  app.delete("/api/scream/:screamId", verifyToken, deleteScream);
  app.post("/api/scream/:screamId/like", verifyToken, likeScream);
  app.delete("/api/scream/:screamId/unlike", verifyToken, unlikeScream);
  app.post("/api/scream/:screamId/comment", verifyToken, commentOnScream);

  // User routes
  app.post("/api/signup", signupUser);
  app.post("/api/login", loginUser);
  app.post(
    "/api/user/image",
    verifyToken,
    upload.single("avatar"),
    uploadImage
  );
  app.post("/api/user", verifyToken, addUserDetails);
  app.get("/api/user", verifyToken, getAuthenticatedUser);
};

export default routes;
