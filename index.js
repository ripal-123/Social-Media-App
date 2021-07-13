import express from "express";
import routes from "./routes/appRoutes";
import mongoose from "mongoose";
import cors from "cors";
import { clientRoutes } from "./client/clientRoutes";

const app = express();
const PORT = 3000;

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/CRMdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

//bodyParser Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
// Call Routes

routes(app);
clientRoutes(app);
// listen to PORT
app.listen(PORT, () => {
  console.log(`server is listening to PORT: ${PORT}`);
});
