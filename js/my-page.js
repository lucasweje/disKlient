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
                        
                        <td><button class="btn-sm btn-danger">Delete</button></td>
                    </tr>
                    `;
                  $ownEventsTable.append(eventHtml);
              }

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
                        
                        <td><button class="btn-sm btn-danger">Delete</button></td>
                    </tr>
                    `;
                  $joinedEventsTable.append(eventHtml);


          });
      });



  });

});