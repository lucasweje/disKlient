$(document).ready(() => {


  SDK.User.loadNav();
  const $ownEventsTable = $("#ownEventsTable");
  const $joinedEventsTable = $("#joinedEventsTable");


  SDK.User.current((error, res) => {

    var currentStudent = JSON.parse(res);


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

              console.log(idEvent);

              $("#eventEditSubmitButton").click(() => {
                  const eventName = $("#inputEventName").val();
                  const location = $("#inputLocation").val();
                  const price = $("#inputPrice").val();
                  const eventDate = $("#inputEventDate").val();
                  const description = $("#inputDescription").val();

                  console.log(eventName);

                  SDK.Event.updateEvent(idEvent, eventName, location, price, eventDate, description, (err, data) => {
                      if (err && err.xhr.status === 401) {
                          $(".form-group").addClass("has-error")
                      }
                      else if (err){
                          console.log("An error happened")
                          window.alert("There was en error editing the event");
                      } else {
                          window.location.href = "my-page.html";
                      }
                  })

              });




          });

          $(".deleteEventButton").click(function () {

              const idEvent = $(this).data("event-id-delete");
              const event = events.find((event) => event.idEvent === idEvent);

              SDK.Event.deleteEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                  if (err && err.xhr.status === 401) {
                      $(".form-group").addClass("has-error")
                  }
                  else if (err){
                      console.log("An error happened")
                      window.alert("There was en error deleting  the event");
                  } else {
                      window.location.href = "my-page.html";
                  }
              })

          });

      });

      SDK.User.getAttendingEvents((cb, events) =>{
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