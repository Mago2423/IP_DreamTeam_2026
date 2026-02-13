document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".quest-claim");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const message = button.dataset.message || "Quest claimed!";
            alert(message);
        });
    });
});
