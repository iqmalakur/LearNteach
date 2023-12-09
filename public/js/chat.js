// Community Chat
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

const chatContainer = document.querySelector(".chat-container");
const formChat = document.querySelector(".send-container form");
const chatField = formChat.querySelector("textarea[name=chat]");
const username = formChat.querySelector("input[name=username]");
const name = formChat.querySelector("input[name=name]");
const picture = formChat.querySelector("input[name=picture]");
const community = formChat.querySelector("input[name=community]");

socket.emit("join", username.value);

socket.on("message", (chat) => {
  if (chat.user !== username.value && chat.community == community.value) {
    updateChat(chat, "receiver");
  }
});

const instructor = document.querySelector(
  ".list-group-item.instructor .user-status"
);
const memberList = document.querySelector(".members");
const members = memberList.querySelectorAll(
  ".list-group-item.member .user-status"
);

const changeStatus = (statusElement, onlineUsers) => {
  const container = statusElement.parentElement.parentElement;
  const username = statusElement.querySelector(".visually-hidden").innerText;
  if (onlineUsers.includes(username)) {
    container.classList.add("text-dark");
    container.classList.remove("text-secondary");
    container.classList.add("online");
    container.classList.remove("offline");
    statusElement.classList.remove("bg-danger");
    statusElement.classList.add("bg-success");
  } else {
    container.classList.add("text-secondary");
    container.classList.remove("text-dark");
    container.classList.add("offline");
    container.classList.remove("online");
    statusElement.classList.remove("bg-success");
    statusElement.classList.add("bg-danger");
  }
};

socket.on("onlineUsers", (onlineUsers) => {
  changeStatus(instructor, onlineUsers);

  members.forEach((member) => {
    changeStatus(member, onlineUsers);
  });
  const online = Array.from(memberList.querySelectorAll(".online")).filter(
    (el) => !el.querySelector(".name").innerText.startsWith(name.value)
  );
  const offline = Array.from(memberList.querySelectorAll(".offline"));

  online.sort((a, b) =>
    a.querySelector(".name").innerText < b.querySelector(".name").innerText
      ? -1
      : 1
  );
  offline.sort((a, b) =>
    a.querySelector(".name").innerText < b.querySelector(".name").innerText
      ? -1
      : 1
  );

  const me = memberList.querySelector(".me");
  memberList.innerHTML = "";

  if (me) memberList.appendChild(me);
  online.forEach((el) => memberList.appendChild(el));
  offline.forEach((el) => memberList.appendChild(el));
});

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
  <div class="col-1 ${
    userStatus === "receiver" ? "order-1 text-end" : "order-2 text-start"
  }">
    <img src="/img/profiles/${
      chat.picture
    }" class="rounded-circle mt-4" style="width: 32px; height: 32px;" />
  </div>
  <div class="col ${
    userStatus === "receiver" ? "order-2" : "order-1"
  } chat rounded position-relative my-2 p-3 text-${align}">
    <span class="fw-bold">${chat.name}</span>
    <p class="mt-2">${chat.message}</p>
    <span class="chat-date">${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}</span>
  </div>
  `;

  chatContainer.appendChild(newChat);

  chatContainer.scrollTo({
    left: 0,
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
};

chatField.addEventListener("keydown", (e) => {
  if (!e.shiftKey && e.key === "Enter") {
    e.preventDefault();
    formChat.querySelector("button[type=submit]").click();
  }
});

formChat.addEventListener("submit", (e) => {
  e.preventDefault();

  if (chatField.value !== "") {
    const message = chatField.value
      .replaceAll("&", "&amp;")
      .replace(/<[^>]*>;/gim, (subStr) => subStr.replaceAll("/", "&sol;"))
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\\*", "&ast;")
      .replaceAll("\\_", "&lowbar;")
      .replaceAll("\\~", "&tilde;")
      .replaceAll("\n", "<br/>")
      .replace(
        /\*[^*]*\*/gim,
        (subStr) => `<strong>${subStr.replace(/\*/g, "")}</strong>`
      )
      .replace(/_[^_]*_/gim, (subStr) => `<em>${subStr.replace(/_/g, "")}</em>`)
      .replace(
        /~[^~]*~/gim,
        (subStr) => `<del>${subStr.replace(/~/g, "")}</del>`
      )
      .replace(
        /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gim,
        (subStr) => `<a href="${subStr}">${subStr}</a>`
      );

    const chat = {
      message,
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

const btnDetails = document.querySelectorAll("button.btn-detail-profile");
const modalDetail = document.getElementById("detailProfile");

btnDetails.forEach((btnDetail) => {
  btnDetail.addEventListener("click", () => {
    const name = btnDetail
      .querySelector(".name")
      .innerText.replace(" (Me)", "");
    const username = btnDetail.querySelector(".visually-hidden").innerText;
    const picture = btnDetail.querySelector("img").getAttribute("src");

    modalDetail.querySelector(".detail-picture").setAttribute("src", picture);
    modalDetail.querySelector(".detail-name").innerText = name;
    modalDetail.querySelector(".detail-username").innerText = `@${username}`;
  });
});

const loadChatBtn = document.querySelector("#load-chat button");
if (loadChatBtn) {
  loadChatBtn.addEventListener("click", async () => {
    let firstChat = document.querySelector(".chat-container > .row");
    const id = firstChat.querySelector("input[name=id]");

    const send = await fetch(
      `/community/${community.value}?before=${id.value}`
    );
    const result = await send.json();
    const chats = result.chats;

    chats.forEach((chat) => {
      const newChat = document.createElement("div");
      const userStatus =
        chat.User.username === username.value ? "sender" : "receiver";
      const align = userStatus === "sender" ? "end" : "start";
      const date = new Date(chat.chat_date);

      newChat.classList.add(
        "row",
        "text-dark",
        "justify-content-" + align,
        userStatus
      );

      newChat.innerHTML = `
      <div class="col-1 ${
        userStatus === "receiver" ? "order-1 text-end" : "order-2 text-start"
      }">
        <img src="/img/profiles/${
          chat.User.picture
        }" class="rounded-circle mt-4" style="width: 32px; height: 32px;" />
      </div>
      <div class="col ${
        userStatus === "receiver" ? "order-2" : "order-1"
      } chat rounded position-relative my-2 p-3 text-${align}">
        <span class="fw-bold">${chat.User.name}</span>
        <p class="mt-2">${chat.chat}</p>
        <span class="chat-date">${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}</span>
        <input type="hidden" name="id" value="${chat.id}" />
      </div>
      `;

      chatContainer.insertBefore(newChat, firstChat);
      firstChat = newChat;
    });

    if (!result.next) {
      loadChatBtn.remove();
    }
  });
}
