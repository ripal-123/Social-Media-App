import {
  Comments,
  Likes,
  Notifications,
  Screams,
  Users,
} from "../models/appModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
export const addScream = (req, res) => {
  const scream = {
    userHandle: req.authData.userId,
    body: req.body.body,
  };
  let newScream = new Screams(scream);

  newScream.save((err, scream) => {
    if (err) {
      res.send(err);
    }
    res.json(scream);
  });
};

export const deleteScream = async (req, res) => {
  const screamId = req.params.screamId;
  const scream = await Screams.findById(screamId).exec();
  if (scream.userHandle != req.authData.userId) {
    return res.json({ error: "Unauthorized" }).status(403);
  }
  await Screams.findOneAndDelete({ _id: screamId });
  await Comments.deleteMany({ screamId: screamId });
  await Likes.deleteMany({ screamId: screamId });
  res.send("Delete Successful");
};
export const getScreams = (req, res) => {
  console.log("GetScreams Called");
  Screams.find()
    .sort({ created_at: "desc" })
    .exec((err, screams) => {
      if (err) {
        res.send(err);
      }
      res.json(screams);
    });
};

export const getScream = (req, res) => {
  let screamData = {};
  Screams.findById(req.params.screamId)
    .exec()
    .then((data) => {
      screamData = JSON.parse(JSON.stringify(data));
      screamData.screamId = data._id;
      return Comments.find({ screamId: data._id })
        .sort({ created_at: "desc" })
        .exec();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((comment) => {
        screamData.comments.push(comment);
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err.code }).status(500);
    });
};

export const commentOnScream = async (req, res) => {
  const screamId = req.params.screamId;
  let user;

  user = await Users.findById(req.authData.id, "userId imageUrl");

  const comment = {
    userHandle: user.userId,
    screamId,
    body: req.body.body.trim(),
    imageUrl: user.imageUrl,
  };
  let newComment = Comments(comment);
  newComment.save((err, comment) => {
    if (err) res.json({ error: err });
    res.json(comment);
  });
};

export const likeScream = async (req, res) => {
  const userId = req.authData.userId;

  let scream = await Screams.findById(req.params.screamId);
  scream.likeCount++;
  await Screams.findOneAndUpdate(
    { _id: req.params.screamId },
    { likeCount: scream.likeCount }
  );
  let newLike = new Likes({
    userHandle: userId,
    screamId: req.params.screamId,
  });

  await newLike.save((err, like) => {
    if (err) res.send(err);
    else res.json(like);
  });
};

export const unlikeScream = (req, res) => {
  const userId = req.authData.userId;
  const scream = Screams.findById(req.params.screamId);
  scream.likeCount--;
  Screams.findOneAndUpdate(
    { _id: req.params.screamId },
    { likeCount: scream.likeCount }
  );

  Likes.findOneAndDelete({
    screamId: req.params.screamId,
    userHandle: userId,
  }).then((err, data) => {
    res.send("Unlike Done");
  });
};

export const signupUser = async (req, res) => {
  const error = [];
  await Users.findOne({ userId: req.body.userId }, (_, user) => {
    if (user) error.push({ error: "UserId already exists" });
  });

  await Users.findOne({ email: req.body.email }, (_, user) => {
    if (user) error.push({ error: "Email already exists" });
  });

  if (error.length != 0) return res.send(error);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let newUser = new Users({
    email: req.body.email,
    password: hashedPassword,
    userId: req.body.userId,
  });

  newUser.save((err, user) => {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
};

export const loginUser = async (req, res) => {
  let User;
  console.log("LoginUser request made");
  console.log(req.body);
  await Users.findOne({ email: req.body.email }, (err, user) => (User = user));

  if (!User) return res.status(400).send("User not found");

  if (await bcrypt.compare(req.body.password, User.password)) {
    let token = jwt.sign(
      { userId: User.userId, id: User._id, email: User.email },
      "secretkey",
      { expiresIn: "1h" }
    );
    res.send(token);
  } else {
    res.send("Invalid Password");
  }
};

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
export const verifyToken = async (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get tolen from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Verify Token
    jwt.verify(bearerToken, "secretkey", (err, authData) => {
      if (err) res.sendStatus(403);
      else req.authData = authData;
    });
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

// Upload User Profile Image
export const uploadImage = async (req, res) => {
  const authData = req.authData;
  //console.log("Hello0");
  console.log(req.file.filename);
  await Users.findOneAndUpdate(
    { _id: authData.id }, //filter
    { imageUrl: `http://localhost:3000/uploads/${req.file.filename}` } // update
  );
  res.send("Image Upload Successful").status(200);
};

const reduceUserDetails = (data) => {
  const userDetails = {};
  userDetails.bio = data.bio.trim();
  userDetails.website = data.website.trim();
  userDetails.location = data.location.trim();

  return userDetails;
};
// Add User Details
export const addUserDetails = (req, res) => {
  const userDetails = reduceUserDetails(req.body);
  Users.findOneAndUpdate({ _id: req.authData.id }, userDetails).then(() => {
    res.send("User Details Updated");
  });
};

// Get own User Details
export const getAuthenticatedUser = (req, res) => {
  const id = req.authData.id;
  let userData = {};
  Users.findOne({ _id: id })
    .then((user) => {
      userData = JSON.parse(JSON.stringify(user));
      return Notifications.find({ receipient: userData.userId }).sort({
        created_at: "desc",
      });
    })
    .then((notifications) => {
      userData.notifications = [];
      notifications.forEach((notification) => {
        userData.notifications.push(notification);
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
