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
            "Authorization": localStorage.getItem("token")
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
                        include: ["events"]
                    }
                }
            }, cb);
        },

        createEvent: (eventName, location, price, eventDate, description, cb) => {
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

        joinEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    price: price,
                    location: location,
                    description: description,
                    eventDate: eventDate,
                },
                url: "/events/join",
                method: "POST"
            }, (err, data) => {

                if (err) return cb(err);

                cb(null, data);

            });
        },

        updateEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    location: location,
                    price: price,
                    eventDate: eventDate,
                    description: description,
                },
                method: "PUT",
                url: "/events/" + idEvent + "/update-event"
            }, cb);
        },

        deleteEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    location: location,
                    price: price,
                    eventDate: eventDate,
                    description: description,
                },
                method: "PUT",
                url: "/events/" + idEvent + "/delete-event"
            }, cb);
        },

        getAttendingStudents: (idEvent, cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + idEvent + "/students"
            }, cb);
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
            SDK.request({
                method: "GET",
                url: "/staffs"
            }, cb);
        },

        getAttendingEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                url: "/students/" + localStorage.getItem("idStudent") + "/events"
            }, cb);
        },
        current: (cb) => {

            // request til /api/profile i StudentEndpoint får at vi data om student fra token
            SDK.request({
                url: "/students/profile",
                method: "GET"
            }, (err, data) => {

                if (err) return cb(err);

                //saves the currentStudents ID for later use
                localStorage.setItem("idStudent", JSON.parse(data).idStudent);

                cb(null, data);
            });


        },

        logOut: (cb) => {
            SDK.request({
                method: "POST",
                url: "/students/logout",
            }, (err, data) => {
                if (err) {
                    return cb(err);
                }
                cb(null, data);
            });

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
                    $("#logout-link").click(() => {
                        SDK.User.logOut((err, data) => {
                            if (err && err.xhr.status === 401) {
                                $(".form-group").addClass("has-error");
                            } else {
                                localStorage.removeItem("token");
                                localStorage.removeItem("idStudent");
                                window.location.href = "login.html";
                            }
                        });
                    });
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