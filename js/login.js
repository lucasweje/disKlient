$(document).ready(() => {

    SDK.User.loadNav();

    $("#login-button").click(() => {

        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();

        SDK.User.login(email, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err) {
                window.alert("Login failed");
            } else {
                window.location.href = "index.html";
            }
        });

    });

    $("#create-button").click(() => {

        const firstName = $("#inputFirstName").val();
        const lastName = $("#inputLastName").val();
        const email = $("#inputEmail2").val();
        const password = $("#inputPassword2").val();
        const verifyPassword = $("#inputPassword3").val();

        SDK.User.createUser(firstName, lastName, email, password, verifyPassword, (err, data) => {
            if (err && err.xhr.status !== 200) {
                $(".form-group").addClass("has-error");
                window.alert("There was en error creating user");
            } else {
                window.location.href = "index.html";
            }
        });

    });

});