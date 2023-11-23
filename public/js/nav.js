const profileContainer = document.getElementById("profile-container");

if (profileContainer) {
  const profileBtn = document.getElementById("profile-button");
  const profileMenu = profileContainer.querySelector(".profile-menu");
  const logoutBtn = profileMenu.querySelector("#logout-btn");

  profileBtn.addEventListener("click", () => {
    profileContainer.classList.add("active");
  });

  profileContainer.addEventListener("click", (e) => {
    if (e.target === profileContainer) {
      profileContainer.classList.remove("active");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    const request = await fetch("/logout", {
      method: "post",
    });
    const result = await request.json();
    document.location.href = result.redirect;
  });
}
