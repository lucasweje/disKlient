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
      "authorization":localStorage.getItem("token")
    }

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
  Book: {
    addToBasket: (book) => {
      let basket = SDK.Storage.load("basket");

      //Has anything been added to the basket before?
      if (!basket) {
        return SDK.Storage.persist("basket", [{
          count: 1,
          book: book
        }]);
      }

      //Does the book already exist?
      let foundBook = basket.find(b => b.book.id === book.id);
      if (foundBook) {
        let i = basket.indexOf(foundBook);
        basket[i].count++;
      } else {
        basket.push({
          count: 1,
          book: book
        });
      }

      SDK.Storage.persist("basket", basket);
    },
    findAll: (cb) => {
      SDK.request({
        method: "GET",
        url: "/books",
        headers: {
          filter: {
            include: ["authors"]
          }
        }
      }, cb);
    },
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/books",
        data: data,
        headers: {authorization: SDK.Storage.load("tokenId")}
      }, cb);
    }
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
    current: () => {
      //return SDK.Storage.load("token");
        return localStorage.getItem("token");
    },
    logOut: () => {
      localStorage.removeItem("token"); //Sletter token når jeg logger ud
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

     //   SDK.Storage.persist("crypted", data);
        localStorage.setItem("token", data);
       // SDK.Storage.persist("userId", data.userId);
       // SDK.Storage.persist("user", data.user);


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
        const currentUser = SDK.User.current();
        if (currentUser) {
          $(".navbar-right").html(`
            <li><a href="my-page.html">Your orders</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
        } else {
          $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
        }
        $("#logout-link").click(() => SDK.User.logOut());
        cb && cb();
      });
    }
  },
  Storage: {
    prefix: "BookStoreSDK",
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