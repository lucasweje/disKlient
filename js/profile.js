$(document).ready(() => {


    SDK.User.loadNav();
    const $ownEventsTable = $("#ownEventsTable");
    const $joinedEventsTable = $("#joinedEventsTable");


    SDK.User.current((error, res) => {

        var currentStudent = JSON.parse(res);

        // Puts data into the information box about the user
        $(".profile-info").html(`
          <dl>        
            <dt>Name</dt>
            <dd>${currentStudent.firstName} ${currentStudent.lastName}</dd>
            <dt>Email</dt>
            <dd>${currentStudent.email}</dd>
            <dt>ID</dt>
            <dd>${currentStudent.idStudent}</dd>
          </dl>
     `);

        // Finds all events where the currently logged in student is the owner
        SDK.Event.findAll((cb, events) => {
            events = JSON.parse(events);
            events.forEach((event) => {
                if (currentStudent.idStudent === event.owner) {
                    let eventHtml = `
                    <tr>
                        <td>${event.owner}</td>
                        <td>${event.eventName}</td>
                        <td>${event.price}</td>
                        <td>${event.location}</td>                 
                        <td>${event.eventDate}</td>
                        <td>${event.description}</td>
                                                
                        <td><button class="btn-sm btn-primary editEventButton" data-toggle="modal" data-target="#editEventModal" data-event-id-edit="${event.idEvent}">Edit</button></td>
                        <td><button class="btn-sm btn-danger deleteEventButton" data-event-id-delete="${event.idEvent}">Delete</button></td>
                    </tr>
                    `;
                    $ownEventsTable.append(eventHtml);
                }

            });

            $(".editEventButton").click(function () {

                const idEvent = $(this).data("event-id-edit");

                $("#eventEditSubmitButton").click(() => {
                    const eventName = $("#inputEventName").val();
                    const location = $("#inputLocation").val();
                    const price = $("#inputPrice").val();
                    const eventDate = $("#inputEventDate").val();
                    const description = $("#inputDescription").val();

                    SDK.Event.updateEvent(idEvent, eventName, location, price, eventDate, description, (err, data) => {
                        if (err && err.xhr.status === 401) {
                            $(".form-group").addClass("has-error")
                        }
                        else if (err) {
                            window.alert("There was en error editing the event");
                        } else {
                            window.location.href = "profile.html";
                        }
                    })

                });


            });

            $(".deleteEventButton").click(function () {

                const idEvent = $(this).data("event-id-delete");
                const event = events.find((event) => event.idEvent === idEvent);

                if(confirm("Are you sure you want to delete?")){
                    SDK.Event.deleteEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                        if (err && err.xhr.status === 401) {
                            $(".form-group").addClass("has-error")
                        }
                        else if (err) {
                            window.alert("There was en error deleting  the event");
                        } else {
                            window.location.href = "profile.html";
                        }
                    })
                } else {
                    alert("Your event was not deleted");
                }

            });

        });

        // gets the events the currently logged in student has joined
        SDK.User.getAttendingEvents((cb, events) => {
            events = JSON.parse(events);
            events.forEach((event) => {

                let eventHtml = `
                    <tr>
                        <td>${event.owner}</td>
                        <td>${event.eventName}</td>
                        <td>${event.price}</td>
                        <td>${event.location}</td>                 
                        <td>${event.eventDate}</td>
                        <td>${event.description}</td>
                        
                    </tr>
                    `;
                $joinedEventsTable.append(eventHtml);


            });
        });


    });


});