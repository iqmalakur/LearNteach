const profileBtn = document.getElementById("profile-button");
const profileContainer = document.getElementById("profile-container");
const profileMenu = profileContainer.querySelector(".profile-menu");

profileBtn.addEventListener("click", () => {
  profileContainer.classList.add("active");
});

profileContainer.addEventListener("click", (e) => {
  if (e.target === profileContainer) {
    profileContainer.classList.remove("active");
  }
});
