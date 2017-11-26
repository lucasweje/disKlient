$(document).ready(() => {

    SDK.User.loadNav();

    $("#eventCreateButton").click(() => {

        const eventName = $("#inputEventName").val();
        const location = $("#inputLocation").val();
        const price = $("#inputPrice").val();
        const eventDate = $("#inputEventDate").val();
        const description = $("#inputDescription").val();





        SDK.Event.createEvent(eventName, location, price, eventDate, description, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error")
            }
            else if (err){
                console.log("An error happened")
                window.alert("There was en error creating the event");
            } else {
                window.location.href = "events.html";
            }
        });

    });

});