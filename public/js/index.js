const country = document.getElementsByClassName("countries__country");
const ctd = document.getElementsByClassName("countries__detail");
const btn = document.getElementsByClassName("btn");

for (let i = 0; i < btn.length; i++) {
  btn[i].addEventListener("click", () => {
    ctd[i].classList.toggle("active");
  });
}
