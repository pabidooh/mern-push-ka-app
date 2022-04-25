const express = require("express"); // require обеспечивает асинхронную загрузку модуля
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth"); //(27 стр)
const messageRoutes = require("./routes/messages");// маршрут сообщения

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

app.use("/api/auth", authRoutes); // маршрут внутри пользовательских маршрутов 
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () => //мы передадим функцию обратного вызова
  console.log(`Сервак стартовал на порте ${process.env.PORT}`) 
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", //передаём в соет сервер, который мы создали
    credentials: true, // учётные данные 
  },
});

global.onlineUsers = new Map(); //глобальный объект ввод - вывод для сокет ио
io.on("connection", (socket) => { //точка соединения, получение сокета внутри обратного вызова
  global.chatSocket = socket; //глобальный чат, равный сокету
  socket.on("add-user", (userId) => { //точка сокета, чтобы добавить пользователя с ИД
    onlineUsers.set(userId, socket.id); //установили состояние онлайн для пользователя и сокета
  });

  socket.on("send-msg", (data) => { //захват данных, которые мы передаём 
    const sendUserSocket = onlineUsers.get(data.to); // если пользователь в сети, то отправим сокет
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);//хранение сокета чата внутри глобального сокета, устанавливаем соединение
      //возьмем индификатор Пользователя и текущий ид сокета и устанавливаем его внутри карты
    }//если второй пользователь онлайн, то сообщение запишется в БД и чат обновится без прерывания сервера
    //если он офлайн, то сообщение будет сохранено в БД, и при открытии стр отобразиться
  });
});
