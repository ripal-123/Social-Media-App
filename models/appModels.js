import mongoose from "mongoose";

const Schema = mongoose.Schema;

const createNotificationOnLike = async (like) => {
  const screamId = like.screamId;
  const sender = like.userHandle;
  const scream = await Screams.findById(screamId).exec();
  const receipient = scream.userHandle;

  const notification = {
    screamId: screamId,
    receipient: receipient,
    sender: sender,
    read: false,
    type: "like",
  };
  const newNotification = new Notifications(notification);
  await newNotification.save((err, doc) => {
    if (err) console.log(err);
  });
  return;
};

const createNotificationOnComment = async (comment) => {
  const screamId = comment.screamId;
  const sender = comment.userHandle;
  const scream = await Screams.findById(screamId).exec();
  const receipient = scream.userHandle;

  const notification = {
    screamId: screamId,
    receipient: receipient,
    sender: sender,
    read: false,
    type: "comment",
  };
  const newNotification = new Notifications(notification);
  await newNotification.save((err, doc) => {
    if (err) console.log(err);
  });
  return;
};

const screamSchema = Schema({
  body: {
    type: String,
  },
  userHandle: {
    type: String,
  },
  userImg: {
    type: String,
    default: "http://localhost:3000/uploads/default.png",
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: String,
    default: new Date().toISOString(),
  },
});

const userSchema = Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  imageUrl: {
    type: String,
    default: "http://localhost:3000/uploads/default.png",
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  created_at: {
    type: String,
    default: new Date().toISOString(),
  },
});

const commentSchema = Schema({
  userHandle: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  screamId: {
    type: String,
  },
  body: {
    type: String,
  },
  created_at: {
    type: String,
    default: new Date().toISOString(),
  },
});

commentSchema.post("save", createNotificationOnComment);
const likesSchema = Schema({
  userHandle: {
    type: String,
    require: true,
  },
  screamId: {
    type: String,
    require: true,
  },
});

likesSchema.post("save", createNotificationOnLike);

const notificationsSchema = Schema({
  receipient: {
    type: String,
  },
  sender: {
    type: String,
  },
  read: {
    type: Boolean,
  },
  screamId: {
    type: String,
  },
  type: {
    type: String,
  },
  created_at: {
    type: String,
    default: new Date().toISOString(),
  },
});

export const Screams = mongoose.model("Scream", screamSchema);
export const Users = mongoose.model("Users", userSchema);
export const Comments = mongoose.model("Comments", commentSchema);
export const Likes = mongoose.model("Likes", likesSchema);
export const Notifications = mongoose.model(
  "Notifications",
  notificationsSchema
);
