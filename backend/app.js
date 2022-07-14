const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const path = require("path");
const { WaBot } = require("./utils/waBot");
const { PermissionData } = require("./middleware/DocRule");
const { verifyToken } = require("./middleware/VerifiyToken");
// const expressBusboy = require("express-busboy");
// const fileUpload = require("express-fileupload");
// expressBusboy.extend(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5500",
    ],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling", "flashsocket"],
    allowedHeaders: ["react-client"],
    credentials: true,
  },
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5500",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use("/public", express.static(path.join(__dirname, "public/images")));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());

const setEmit = (name, msg) => {
  io.emit(name, msg);
};

module.exports.setEmit = setEmit;

const port = process.env.PORT || 5000;

// Import WaBot
WaBot();

// End

// app.use(function (req, res, next) {
//   req.socket = io;
//   next();
// });

const deviceRouter = require("./routes/deviceRoute");
const branchRouter = require("./routes/branchRoute");
const userRouter = require("./routes/userRoute");
const cgRouter = require("./routes/customerGroupRoute");
const customerRoute = require("./routes/customerRoute");
const visitRoute = require("./routes/visitRoute");
const callSheetRoute = require("./routes/callSheetRoute");
const profileRoleRoute = require("./routes/roleProfileRoute");
const roleListRoute = require("./routes/roleListRoute");
const roleUserRoure = require("./routes/roleUserRoute");
const permissionRoute = require("./routes/permissionRoute");
app.use("/device", verifyToken, PermissionData, deviceRouter);
app.use("/branch", verifyToken, PermissionData, branchRouter);
app.use("/users", userRouter);
app.use("/customergroup", verifyToken, PermissionData, cgRouter);
app.use("/customer", verifyToken, PermissionData, customerRoute);
app.use("/visit", verifyToken, PermissionData, visitRoute);
app.use("/callsheet", verifyToken, PermissionData, callSheetRoute);
app.use("/roleprofile", verifyToken, PermissionData, profileRoleRoute);
app.use("/rolelist", verifyToken, PermissionData, roleListRoute);
app.use("/roleuser", verifyToken, PermissionData, roleUserRoure);
app.use("/permission", verifyToken, PermissionData, permissionRoute);

server.listen(port, () => {
  console.log(`Listening port : ${port}`);
});
