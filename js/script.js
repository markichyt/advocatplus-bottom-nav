/* Unclaimed page — quiz foot-in-the-door behaviour. No deps. */
(function () {
    "use strict";

    function initQuizContinue() {
        var btn = document.querySelector("[data-quiz-continue]");
        if (!btn) return;
        var quiz = btn.closest(".uc-quiz");
        if (!quiz) return;

        var checkboxes = quiz.querySelectorAll('input[type="checkbox"][name="practice"]');
        if (!checkboxes.length) return;

        // Make the Continue button "wake up" once at least one option is chosen,
        // and pass the selected practice areas as a query param to the quiz URL.
        var baseUrl = btn.getAttribute("href") || "#";
        var dimmed = btn.getAttribute("data-dimmed-href") || baseUrl;

        function update() {
            var selected = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) selected.push(checkboxes[i].value);
            }
            if (selected.length === 0) {
                btn.classList.add("is-disabled");
                btn.setAttribute("aria-disabled", "true");
                btn.setAttribute("href", dimmed);
            } else {
                btn.classList.remove("is-disabled");
                btn.removeAttribute("aria-disabled");
                var sep = baseUrl.indexOf("?") >= 0 ? "&" : "?";
                btn.setAttribute("href", baseUrl + sep + "practice=" + encodeURIComponent(selected.join(",")));
            }
        }

        for (var c = 0; c < checkboxes.length; c++) {
            checkboxes[c].addEventListener("change", update);
        }

        // Block click if no answer selected — keeps user on page until they pick.
        btn.addEventListener("click", function (e) {
            var any = false;
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) { any = true; break; }
            }
            if (!any) {
                e.preventDefault();
                var hint = quiz.querySelector(".uc-quiz__hint");
                if (hint) {
                    hint.style.color = "#e14949";
                    hint.textContent = "Please select at least one practice area to continue.";
                }
            }
        });

        update();
    }

    function init() { initQuizContinue(); }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
