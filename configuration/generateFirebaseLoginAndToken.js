// generates a firebase user/pass/token 

var Firebase = require('firebase');
var uuid = require('node-uuid');
var firebaseAddress = 'https://firstbuild-sandbox.firebaseio.com/'  //<---change to url you want
var ref;
var fs = require('fs');
var generatePassword = require('password-generator');
var Moniker = require('moniker');
var userName = generateUserName();
console.log(process.argv)
if (process.argv.length > 2){
    firebaseAddress = process.argv[2];
}
if (process.argv.length == 4){
    userName = process.argv[3];
}
ref = new Firebase(firebaseAddress);
createuser(userName);

function generateUserName(){
    var names = Moniker.generator([Moniker.adjective, Moniker.noun]);
    var shortName = names.choose();
    var user = shortName + "@firebase.com";
    return user;
}

function createuser(user) {

    var firebasePassword = generatePassword(8, true);
    // var names = Moniker.generator([Moniker.adjective, Moniker.noun]);
    // var shortName = names.choose();
    // var user = shortName + "@firebase.com";
    shortName = user.split('@')[0]

    console.log("attempt to create user: ", user);
    ref.createUser({
        email: user,
        password: firebasePassword
    }, function(error, userData) {
        if (error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
            }
            process.exit();
        } else {
            ref.authWithPassword({
                "email": user,
                "password": firebasePassword
            }, function(error, authData) {
                if (error) {
                    console.log("Firebase login failed", error);
                    process.exit(1);
                } else {
                    var config = {
                            "firebaseUrl":     firebaseAddress,
                            "token":           authData.token, 
                            "firebaseUsername":user,
                            "firebasePassword":firebasePassword,
                            "uuid":            uuid.v4()
                        }
                    fs.writeFile("firebaseconfig.json" + "." + shortName, JSON.stringify(config), function(err) {
                        if (err) {
                            console.log("Unable to create firebaseconfig.json");
                            process.exit(1);
                        } else {
                            console.log("created firebaseconfig.json" + "." + shortName);
                            process.exit();
                        }
                    });
                }
            });

        }
    });
}




