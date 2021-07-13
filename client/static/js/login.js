window.addEventListener("load", (e) => {
  const loginForm = document.querySelector("#credentials");
  loginForm.addEventListener("submit", (e) => {
    //e.preventDefault();
  });
});

const showPassword = document.querySelector("#showPassword");
function changePasswordField(event) {
  const password = document.querySelector("#password");
  password.type = event.srcElement.checked ? "text" : "password";
}
showPassword.addEventListener("click", changePasswordField);
