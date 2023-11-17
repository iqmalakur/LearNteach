const { Chat } = require("../models/Connection");

class CommunityService {
  constructor(io) {
    this.io = io;
  }

  join() {
    console.log("JOIN NIH YEE");
  }

  message(chat) {
    Chat.create({
      user: chat.user,
      community: chat.community,
      chat: chat.message,
      chat_date: chat.chat_date,
    });
  }

  leave() {
    console.log("BYE BRO");
  }
}

module.exports = CommunityService;
