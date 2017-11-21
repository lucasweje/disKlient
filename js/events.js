$(document).ready(() => {

    SDK.User.loadNav();
    //const currentUser = SDK.User.current();
    const $eventList = $("#event-list");

    /*$(".page-header").html(`
      <h1>Hi, ${currentUser.firstName} ${currentUser.lastName}</h1>
    `);*/


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
                                          
                                          <button class="btn-lg" id="join-event-button">Join event</button>
                                        </div>
                                    </div>

                            
               
                    `;

            $eventList.append(eventHtml)

        });

        $(".attend-button").click(function(){

            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id === eventId);
            window.alert(eventId);
            SDK.Event.addToAttendingEvents(event);



        });

    });

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