const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        // creates let token so it can be sent as header in the request
        // endpoints on the server require the token under the HeaderParam "Authorization"
        let token = {
            "Authorization": localStorage.getItem("token")
        };

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            // adds the token for the user who is currently logged in
            headers: token,
            contentType: "application/json",
            dataType: "json",
            // encrypts data before sending it
            data: JSON.stringify(SDK.Encryption.encrypt(JSON.stringify(options.data))),
            success: (data, status, xhr) => {
                // decrypts the data comming from the server
                cb(null, SDK.Encryption.decrypt(data), status, xhr);
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

            // request to /api/profile in StudentEndpoint where token is send as part of the headers
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

                localStorage.setItem("token", JSON.parse(data));


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

        // Navbar method from Jespers 'javascript-client'
        // Shows login if there is no currentUser, and logout and profile if there is
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                var currentUser = null;
                SDK.User.current((err, res) => {
                    currentUser = res;

                    if (currentUser) {
                        $(".navbar-right").html(`
                                 <li><a href="profile.html">Your profile</a></li>
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

    Encryption: {

        // XOR encryption method from https://github.com/KyleBanks/XOREncryption/blob/master/JavaScript/XOREncryption.js
        // Key has to match with server key
        encryptDecrypt(input) {

            // checks if there is anything before encrypting/decrypting
            if(input != undefined){

                var key = ['J', 'M', 'F']; //Can be any chars, and any size array
                var output = [];

                for (var i = 0; i < input.length; i++) {
                    var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                    output.push(String.fromCharCode(charCode));
                }

                return output.join("");

            } else {

                return input;
            }


        },

        encrypt: (encrypt) => {

            if (encrypt !== undefined && encrypt.length !== 0) {

                const fields = ['J', 'M', 'F'];
                let encrypted = '';
                for (let i = 0; i < encrypt.length; i++) {
                    encrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return encrypted;
            } else {
                return encrypt;
            }
        },
        decrypt: (decrypt) => {
            if (decrypt.length > 0 && decrypt !== undefined) {
                const fields = ['J', 'M', 'F'];
                let decrypted = '';
                for (let i = 0; i < decrypt.length; i++) {
                    decrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return decrypted;
            } else {
                return decrypt;
            }
        }

    }
};