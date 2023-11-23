const { Chat } = require("../models/Database");

class CommunityService {
  static onlineUsers = [];

  constructor(io) {
    this.io = io;
  }

  join(username) {
    if (!CommunityService.onlineUsers.includes(username)) {
      CommunityService.onlineUsers.push(username);
    }
  }

  message(chat) {
    Chat.create({
      user: chat.user,
      community: chat.community,
      chat: chat.message,
      chat_date: chat.chat_date,
    });
  }

  leave(username) {
    if (CommunityService.onlineUsers.includes(username)) {
      CommunityService.onlineUsers = CommunityService.onlineUsers.filter(
        (user) => user !== username
      );
    }
  }
}

module.exports = CommunityService;
