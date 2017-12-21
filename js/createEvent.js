$(document).ready(() => {

    SDK.User.loadNav();


    // displays a message if user is trying to create event while not logged ind
    $("#createEventModalButton").click(() => {

        //checks if there has been a login by getting the token that would have been created
        if(localStorage.getItem("token")){

        } else{
            window.alert("You need to be logged in to create a new event.");
        }
    });

    $("#eventCreateButton").click(() => {

        // stores the input from the user
        const eventName = $("#inputEventName").val();
        const location = $("#inputLocation").val();
        const price = $("#inputPrice").val();
        const eventDate = $("#inputEventDate").val();
        const description = $("#inputDescription").val();

        // calls the appropiate method and provides data from the user
        SDK.Event.createEvent(eventName, location, price, eventDate, description, (err) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error")
            }

            else if (err) {
                window.alert("There was en error creating the event");
            } else {
                window.location.href = "events.html";
            }
        });

    });

});