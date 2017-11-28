$(document).ready(() => {

    SDK.User.loadNav();
    //const currentUser = SDK.User.current();
    const $eventList = $("#event-list");
    const $seeAttendingStudents = $("#seeAttendingStudents");


    SDK.Event.findAll((cb, events) => {
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

        $(".joinEventButton").click(function() {

            const idEvent = $(this).data("event-id-join");
            const event = events.find((event) => event.idEvent === idEvent);

            console.log(idEvent);
            console.log(event);

            SDK.Event.joinEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error")
                }
                else if (err){
                    console.log("An error happened")
                    window.alert("There was en error joining the event");
                } else {
                    window.location.href = "events.html";
                }
            });


        });

        //Måske ryk ud af findAll metoden
        $(".seeAttendingStudents").click(function(){

            var idEvent = $(this).data("event-id-see");

            console.log(idEvent);

            SDK.Event.getAttendingStudents(idEvent, (cb, students) => {
                if(students){
                    students = JSON.parse(students);
                    students.forEach((student) => {
                        console.log(student.firstName);

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

    $("#clearModalText").click(function () {
        $("#seeAttendingStudents").html("");
    });





    // Maybe not needed
    $("#attend-modal").on("shown.es.modal", () => {
        const mineEvents = SDK.Storage.load("mineEvents");
        const $modalTbody = $("#modal-tvody");
        mineEvents.forEach((entry) => {
            $modalTbody.append(`
      <tr>
      <td>${entry.event.eventName}</td>
      <td>${entry.count}</td>
      <td>kr. ${entry.event.price}</td>
      <td>kr. 0</td>
      </tr>
      
      `)
        });
    });
});