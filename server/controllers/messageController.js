const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({ //ищет сообщения
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });//сортировка

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,//ищем сообщения текущего пользователя
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Сообщение успешно добавлено" });
    else return res.json({ msg: "Чёт не получилось в БД запушить(" });
  } catch (ex) {
    next(ex);
  }
};
