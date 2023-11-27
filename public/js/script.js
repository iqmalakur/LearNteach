const form = document.querySelector(".form-post");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const alert = form.querySelector(".form-error");

    const inputs = form.querySelectorAll("input, textarea, select");
    const body = {};
    inputs.forEach((input) => {
      if (input.getAttribute("type") === "checkbox") {
        body[input.getAttribute("name")] = input.checked;
      } else {
        body[input.getAttribute("name")] = input.value;
      }
    });

    const send = await fetch(form.getAttribute("action"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await send.json();

    if (!result.success) {
      if (alert) {
        alert.setAttribute("class", "form-error alert alert-danger");
        alert.setAttribute("role", "alert");
        alert.innerHTML = `
          <strong>${result.message}</strong>
          `;
      }
      document.querySelectorAll("input[type=password]")?.forEach((password) => {
        password.value = "";
      });
    } else {
      if (alert) {
        alert.setAttribute("class", "form-error");
        alert.setAttribute("role", "");
        alert.innerHTML = "";
      }
      location.href = result.redirect;
    }
  });
}

const wishlistCart = document.querySelectorAll("form.wishlist, form.cart");
wishlistCart.forEach((wc) => {
  wc.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (wc.getAttribute("method").toLowerCase() === "post") {
      const user = wc.querySelector("input[name=user]").value;
      const course = wc.querySelector("input[name=course]").value;

      const send = await fetch(wc.getAttribute("action"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, course }),
      });
      const result = await send.json();

      alert(result.message);
    } else if (wc.getAttribute("method").toLowerCase() === "delete") {
      const id = wc.querySelector("input[name=id]").value;

      const send = await fetch(wc.getAttribute("action"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await send.json();

      alert(result.message);
    }

    if (!location.href.endsWith("/course")) location.reload();
  });
});

const accordionButtons = document.querySelectorAll(".accordion-button");
if (accordionButtons) {
  accordionButtons.forEach((accordionButton) => {
    accordionButton.addEventListener("click", () => {
      const radio = accordionButton.querySelector("input[type=radio]");
      radio.checked = true;
    });
  });
}

const pictureForm = document.getElementById("picture-form");
if (pictureForm) {
  const pictureInput = document.getElementById("picture");

  pictureInput.addEventListener("input", async () => {
    const file = pictureInput.files[0];
    const formData = new FormData();

    formData.append("picture", file);

    const send = await fetch(pictureForm.getAttribute("action"), {
      method: "PUT",
      body: formData,
    });
    const result = await send.json();

    alert(result.message);

    if (result.success) {
      location.reload();
    }
  });
}

const userForm = document.getElementById("update-form");
if (userForm) {
  const username = document.getElementById("username").value;
  const titleName = document.getElementById("title-name");

  const labelName = document.getElementById("label-name");
  const labelEmail = document.getElementById("label-email");
  const labelPassword = document.getElementById("label-password");

  const inputName = document.getElementById("input-name");
  const inputEmail = document.getElementById("input-email");
  const inputPassword = document.getElementById("input-password");
  const inputConfirmPassword = document.getElementById(
    "input-confirm-password"
  );

  const editBtn = document.getElementById("edit-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const submitBtn = document.getElementById("save-btn");

  const editMode = () => {
    labelName.classList.add("d-none");
    labelEmail.classList.add("d-none");
    labelPassword.classList.add("d-none");

    inputName.classList.remove("d-none");
    inputEmail.classList.remove("d-none");
    inputPassword.classList.remove("d-none");

    cancelBtn.classList.remove("d-none");
    submitBtn.classList.remove("d-none");
    editBtn.classList.add("d-none");
  };

  const readMode = () => {
    labelName.classList.remove("d-none");
    labelEmail.classList.remove("d-none");
    labelPassword.classList.remove("d-none");

    inputName.classList.add("d-none");
    inputEmail.classList.add("d-none");
    inputPassword.classList.add("d-none");
    inputConfirmPassword.classList.add("d-none");

    cancelBtn.classList.add("d-none");
    submitBtn.classList.add("d-none");
    editBtn.classList.remove("d-none");
  };

  editBtn.addEventListener("click", editMode);
  cancelBtn.addEventListener("click", readMode);

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      username,
      name: inputName.value,
      email: inputEmail.value,
      password: inputPassword.value,
      confirmPassword: inputConfirmPassword.value,
    };

    const send = await fetch(userForm.getAttribute("action"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await send.json();

    alert(result.message);

    if (result.success) {
      titleName.innerText = result.data.name;
      labelName.innerText = result.data.name;
      labelEmail.innerText = result.data.email;

      readMode();
    }
  });

  inputPassword.addEventListener("keyup", () => {
    if (inputPassword.value.length > 0) {
      inputConfirmPassword.classList.remove("d-none");
    } else {
      inputConfirmPassword.classList.add("d-none");
    }
  });
}

const instructorRegisterForm = document.getElementById("instructor-register");
if (instructorRegisterForm) {
  const documentInput = document.getElementById("document");

  instructorRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = documentInput.files[0];
    const formData = new FormData();

    formData.append("document", file);

    const send = await fetch(instructorRegisterForm.getAttribute("action"), {
      method: "POST",
      body: formData,
    });
    const result = await send.json();

    if (result.success) {
      location.href = result.redirect;
    }

    alert(result.message);
  });
}
