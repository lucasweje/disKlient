const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {


    /*let headers = {};
    if (options.headers) {
      Object.keys(options.headers).forEach((h) => {
        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
      });
    }*/

    let token = {
      "Authorization":localStorage.getItem("token")
    };

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: token,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(options.data),
      success: (data, status, xhr) => {
        cb(null, data, status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
  Event: {
    findAll: (cb, events) => {
      SDK.request({
        method: "GET",
        url: "/events",
          headers: {
            filter: {
                include:["events"]
            }
          }
      }, cb);
    },
      createEvent: (eventName, price, location, description, eventDate, cb) => {
          SDK.request({
              data: {
                  eventName: eventName,
                  price: price,
                  location: location,
                  description: description,
                  eventDate: eventDate,
              },
              url: "/events",
              method: "POST"
          }, (err, data) => {

              if (err) return cb(err);

              cb(null, data);

          });
      },

  },
    Author: {
    findAll: (cb) => {
      SDK.request({method: "GET", url: "/authors"}, cb);
    }
  },
  Order: {
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/orders",
        data: data,
        headers: {authorization: SDK.Storage.load("tokenId")}
      }, cb);
    },
    findMine: (cb) => {
      SDK.request({
        method: "GET",
        url: "/orders/" + SDK.User.current().id + "/allorders",
        headers: {
          authorization: SDK.Storage.load("tokenId")
        }
      }, cb);
    }
  },
  User: {
    findAll: (cb) => {
      SDK.request({method: "GET", url: "/staffs"}, cb);
    },
    current: (cb) => {
          //return SDK.Storage.load("user")
//        return localStorage.getItem("token")

        // request til /api/profile i StudentEndpoint får at vi student på kun token???

        SDK.request({
            url: "/students/profile",
            method: "GET"
        }, (err, data) => {

            if (err) return cb(err);

            cb(null, data);
        });


// {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJVc2VyIjoibHVjQHdlamUuZGsiLCJpc3MiOiJTVEZVIiwiZXhwIjoxNTExMTI0ODc2ODIwfQ.6GP8YoGE1Pm_ZrNyBu7pe_SYcfbknviCrl0Mjo_P5eD7C4BZJOd_zeyWdNFMdbY0eSJcoOglWlWhrj2NsUIyjA"}
//           eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJVc2VyIjoibHVjQHdlamUuZGsiLCJpc3MiOiJTVEZVIiwiZXhwIjoxNTExMDg3NjQ5NzcyfQ.iFTfENmlJZZUqMxquzMyCOGKNi76ypNhQQnOgtOMVmnIy3kh2XRq8BrBRV3NmU9JgQDJkLeBcufAfWvNQWl0KQ
    },
    logOut: () => {
      //localStorage.removeItem("token"); //Sletter token når jeg logger ud
      SDK.Storage.remove("token");
      SDK.Storage.remove("idStudent");
      SDK.Storage.remove("user");
      window.location.href = "index.html";
    },
    login: (email, password, cb) => {
      SDK.request({
        data: {
          email: email,
          password: password
        },
        url: "/login",
        method: "POST"
      }, (err, data) => {

        //On login-error
        if (err) return cb(err);

       // console.log(data);
        localStorage.setItem("token", data);

        cb(null, data);

      });
    },
    createUser: (firstName, lastName, email, password, verifyPassword, cb) => {
      SDK.request({
          data: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
              verifyPassword: verifyPassword
          },
          url: "/register",
          method: "POST"
      }, (err, data) => {

        //On create error?
        if (err) return cb(err);

        cb(null, data);

      });
    },
    loadNav: (cb) => {
      $("#nav-container").load("nav.html", () => {
        var currentUser = null;
        SDK.User.current((err, res) => {
          currentUser = res;

          if (currentUser) {
                $(".navbar-right").html(`
            <li><a href="my-page.html">Your profile</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
            } else {
                $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
            }
            $("#logout-link").click(() => SDK.User.logOut());
        });

        cb && cb();
      });
    }
  },
  Storage: {
    prefix: "",
    persist: (key, value) => {
      window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
      const val = window.localStorage.getItem(SDK.Storage.prefix + key);
      try {
        return JSON.parse(val);
      }
      catch (e) {
        return val;
      }
    },
    remove: (key) => {
      window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
  }
};