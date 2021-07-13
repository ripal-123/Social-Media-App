const screamContainer = document.querySelector("#scream-container");

const appendScream = (scream) => {
  const divRow = document.createElement("div");
  divRow.setAttribute("class", "row justify-content-center");
  const screamCard = document.createElement("div");
  screamCard.setAttribute("class", "scream media mb-4 rounded");
  const user = document.createElement("div");
  user.setAttribute("class", "user media-body");

  const userImg = document.createElement("img");
  userImg.setAttribute("class", "userImg mt-1 mr-2 ml-0  img-fluid");
  const userHandle = document.createElement("a");
  userHandle.setAttribute("class", "userHandle");
  const screamBody = document.createElement("p");
  screamBody.setAttribute("class", "screamBody");

  user.append(userHandle);
  user.append(screamBody);

  screamCard.append(userImg);
  screamCard.append(user);
  userImg.setAttribute("src", scream.userImg);
  screamBody.innerHTML = scream.body;
  userHandle.innerHTML = scream.userHandle;
  divRow.append(screamCard);
  screamContainer.append(divRow);
};
const getScreams = async () => {
  await fetch("http://localhost:3000/api/screams", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((scream) => appendScream(scream));
    });
};

const Login = document.querySelector("#login");
const goToLogin = () => {
  window.location = "http://localhost:3000/login";
};

Login.addEventListener("click", goToLogin);
window.addEventListener("load", getScreams);
