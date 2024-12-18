setTimeout(function () {
  let alertElement = document.getElementById("successAlert");
  alertElement.classList.add("fade-out");

  alertElement.addEventListener("animationend", function () {
    let alertInstance = new bootstrap.Alert(alertElement);
    alertInstance.close();
  });
}, 3000); // 3s
