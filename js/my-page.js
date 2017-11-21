$(document).ready(() => {


    const $basketTbody = $("#basket-tbody");
  SDK.User.loadNav();


  SDK.User.current((error, res) => {

    var currentStudent = JSON.parse(res);

    $(".page-header").html(`
             <h1>Hi, ${currentStudent.firstName} <br> Your ID is: ${currentStudent.idStudent}</h1>
     `);

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
  });

});