const dropdown = document.querySelector('.dropdown-menu');
const dropdownBtn = document.querySelector('.dropdown-toggle');

dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
});

window.addEventListener("click", function(e) {
  if (!e.target.closest(".dropdown")) {
    dropdown.classList.remove("show");
  }
});