$(document).ready(() => {

    SDK.User.loadNav();
    const $eventList = $("#event-list");
    const $seeAttendingStudents = $("#seeAttendingStudents");

    SDK.Event.findAll((cb, events) => {

        //If statement checks if there is a token (a log in has been successful)
        //Displays events if yes
        if (localStorage.getItem("token")) {
            events = JSON.parse(events);
            events.forEach((event) => {
                const eventHtml = `           
                   
                                       <div class="col-md-4">
                                         <div class="jumbotron">
                                          <h2><u>${event.eventName}</u></h2>
                                          <p><b>Date:</b> ${event.eventDate}</p>
                                          <p><b>Price:</b> ${event.price}</p>
                                          <p><b>Location:</b> ${event.location}</p>
                                          <p><b>Description:</b> ${event.description}</p>
                                          
                                          <button class="btn-sm btn-primary joinEventButton" data-event-id-join="${event.idEvent}">Join event</button>
                                          <button class="btn-sm btn-primary seeAttendingStudents" 
                                                    data-event-id-see="${event.idEvent}" 
                                                    data-toggle="modal" data-target="#attendingStudentsModal">See who is participating
                                          </button>
                                        </div>
                                    </div>
               
                    `;

                $eventList.append(eventHtml)

            });
        }
        else {
            $eventList.html(`
                    <div class="col-md-12">
                        <div class="jumbotron">
                            <h1 align="center"> Log in to see events</h1>
                        </div>
                    </div>
                    `);
        }


        $(".joinEventButton").click(function () {

            // Takes the specific data that the buttons which if refers to provides
            const idEvent = $(this).data("event-id-join");
            // Does a find method on the array 'events' that comes from the findAll method in sdk.js
            // finds the event with the matching idEvent
            const event = events.find((event) => event.idEvent === idEvent);


            SDK.Event.joinEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error")
                }
                else if (err) {
                    window.alert("There was en error joining the event");
                } else {
                    window.location.href = "events.html";
                    window.alert("Event joined!");
                }
            });


        });


        $(".seeAttendingStudents").click(function () {

            var idEvent = $(this).data("event-id-see");

            SDK.Event.getAttendingStudents(idEvent, (cb, students) => {
                if (students) {
                    students = JSON.parse(students);
                    students.forEach((student) => {

                        const attendingStudentsHtml = `           
                                                          
                                          <p>${student.firstName} ${student.lastName}</p>
            
                    `;

                        $seeAttendingStudents.append(attendingStudentsHtml)
                    });
                } else {
                    $("#seeAttendingStudents").html("Either no one is attending this event, or there was en error.");
                }


            });


        });

    });

    // clear the modal after having seen who is participating
    $("#clearModalText").click(function () {
        $("#seeAttendingStudents").html("");
    });

});