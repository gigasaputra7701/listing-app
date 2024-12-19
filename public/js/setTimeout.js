document.addEventListener("DOMContentLoaded", function () {
  const alertElements = document.querySelectorAll(".alert-custom");

  alertElements.forEach((alertElement) => {
    setTimeout(function () {
      alertElement.classList.add("fade-out");

      alertElement.addEventListener("animationend", function () {
        if (alertElement) {
          const alertInstance = new bootstrap.Alert(alertElement);
          alertInstance.close();
        }
      });
    }, 3000); // 3s
  });
});
