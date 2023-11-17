// Community Chat
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();
socket.emit("join");

socket.on("message", (chat) => {
  if (chat.user !== username.value) {
    updateChat(chat, "receiver");
  }
});

const chatContainer = document.querySelector(".chat-container");
const formChat = document.querySelector(".send-container form");
const chatField = formChat.querySelector("input[name=chat]");
const username = formChat.querySelector("input[name=username]");
const name = formChat.querySelector("input[name=name]");
const picture = formChat.querySelector("input[name=picture]");
const community = formChat.querySelector("input[name=community]");

chatContainer.scrollTo({
  left: 0,
  top: chatContainer.scrollHeight,
  behavior: "instant",
});

const updateChat = (chat, userStatus) => {
  const newChat = document.createElement("div");
  const align = userStatus === "sender" ? "end" : "start";
  const date = new Date();

  newChat.classList.add(
    "row",
    "text-dark",
    "justify-content-" + align,
    userStatus
  );

  newChat.innerHTML = `
  <div class="col chat rounded shadow position-relative my-1 p-3 text-${align}">
    <span class="text-warning fw-bold fs-5">${chat.user}</span>
    <p>${chat.message}</p>
    <span>${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}</span>
  </div>
  `;

  chatContainer.appendChild(newChat);

  chatContainer.scrollTo({
    left: 0,
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
};

formChat.addEventListener("submit", (e) => {
  e.preventDefault();

  if (chatField.value !== "") {
    const chat = {
      message: chatField.value,
      user: username.value,
      community: community.value,
      name: name.value,
      picture: picture.value,
      chat_date: new Date(),
    };

    chatField.value = "";
    chatField.focus();

    socket.emit("message", chat);
    updateChat(chat, "sender");
  }
});
