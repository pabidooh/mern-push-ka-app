const express = require("express"); // require обеспечивает асинхронную загрузку модуля
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

const app = express(); //вызов экспресс функции
const socket = require("socket.io");
require("dotenv").config(); // для соединения с БД

app.use(cors());
app.use(express.json()); //для запросов POST и PUT, чтобы отправлять данные

mongoose // передаём .env 
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, //передаём новый синтаксический анализатоор
    useUnifiedTopology: true, //говорим, что хотим использовать унифицированную топологию
  })
  .then(() => {
    console.log("БД коннект фурычит"); //промис, выполняется, когда мы подкдючились к БД
  })
  .catch((err) => { //если есть ошибки, то ловим их
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () => //мы передадим функцию обратного вызова
  console.log(`Сервак стартовал на порте ${process.env.PORT}`) 
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
