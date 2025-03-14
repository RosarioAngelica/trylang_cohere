document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const showPasswordCheckbox = document.getElementById("show-password");
  const loginForm = document.getElementById("login-form");

  if (passwordInput && showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener("change", function () {
      passwordInput.type = this.checked ? "text" : "password";
    });
  }
});
