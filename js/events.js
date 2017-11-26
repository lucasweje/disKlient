$(document).ready(() => {

    SDK.User.loadNav();
    //const currentUser = SDK.User.current();
    const $eventList = $("#event-list");


    SDK.Event.findAll((cb, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventHtml = `           
                   
                                       <div class="col-md-4">
                                         <div class="jumbotron">
                                          <h2><u>${event.eventName}</u></h2>
                                          <p><b>Owner:</b> ${event.owner}</p>
                                          <p><b>Price:</b> ${event.price}</p>
                                          <p><b>Location:</b> ${event.location}</p>
                                          <p><b>Description:</b> ${event.description}</p>
                                          
                                          <button class="btn-sm btn-primary joinEventButton" data-event-id="${event.idEvent}">Join event</button>
                                          <button class="btn-sm btn-primary seeAttendingStudents" data-event-id2="${event.idEvent}">See who is participating</button>
                                        </div>
                                    </div>
               
                    `;

            $eventList.append(eventHtml)




        });

        $(".joinEventButton").click(function() {

            const idEvent = $(this).data("event-id");
            const event = events.find((event) => event.idEvent === idEvent);

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

            var idEvent = $(this).data("event-id2");

            console.log();

            SDK.Event.getAttendingStudents(idEvent, (cb, students) => {
                if(students){
                    students = JSON.parse(students);
                    students.forEach((student) => {
                        console.log(student.firstName);
                    });
                } else {
                    console.log("No one is attending this event :(");

                }



            });


        });

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