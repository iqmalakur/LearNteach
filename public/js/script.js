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
      alert.setAttribute("class", "form-error alert alert-danger");
      alert.setAttribute("role", "alert");
      alert.innerHTML = `
        <strong>${result.message}</strong>
        `;
    } else {
      alert.setAttribute("class", "form-error");
      alert.setAttribute("role", "");
      alert.innerHTML = "";
      location.href = result.redirect;
    }
  });
}

const wishlistCart = document.querySelectorAll("form.wishlist, form.cart");
wishlistCart.forEach((wc) => {
  wc.addEventListener("submit", async (e) => {
    e.preventDefault();

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
  });
});
