const User = require("../models/userModel"); //вызов модели пользователя
const bcrypt = require("bcrypt");// шифрование пароля

module.exports.login = async (req, res, next) => {  
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Некорректный ник или пароль", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password); // сравниваем для проверки
    if (!isPasswordValid)
      return res.json({ msg: "Некорректный ник или пароль", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};//↑ переделанное ↓

module.exports.register = async (req, res, next) => { // тело точки асинхронного запроса
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username }); //проверка уникальности значений атрибутов уникальности
    if (usernameCheck)
      return res.json({ msg: "Кто-то уже зарегистрировался под этим ником", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Кто-то уже зарегистрировался под этой почтой", status: false });
    const hashedPassword = await bcrypt.hash(password, 10); // шифруемся, как можем
    const user = await User.create({ //инфо о пользователе, который был создан
      email,
      username,
      password: hashedPassword,
    });
    delete user.password; //убираем пароль пользователя, т.к. мы его зашифровали
    return res.json({ status: true, user });
  } catch (ex) {//при ошибке передавать и сообщать
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
