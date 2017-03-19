// Initialize Firebase
var config = {
    apiKey: "AIzaSyAMATZkmgiTzhKVpQljIhhw90BUNElPBDM",
    authDomain: "trainschedule-87577.firebaseapp.com",
    databaseURL: "https://trainschedule-87577.firebaseio.com",
    storageBucket: "trainschedule-87577.appspot.com",
    messagingSenderId: "992195066751"
};
firebase.initializeApp(config);

var database = firebase.database();

$(".table").on("click", ".delete-row", function () {
    $(this).closest('tr').remove();
    var childKey = $(this).attr('data-row');
    database.ref().child(childKey).remove();
});

$().ready(function () {

    //When Submit is Clicked
    $("#submit-train").on("click", function (e) {
        e.preventDefault();

        //Store inputs as object
        var train = {
            name: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTime: $("#first-time").val().trim(),
            frequency: $("#frequency").val().trim()
        };

        //push to firebase
        database.ref().push(train);

        //empty form
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

    });

    database.ref().on("child_added", function (snap) {

        //Do some math
        var frequency = snap.val().frequency;
        var startTime = moment(snap.val().firstTime, "H:m");

        //Set moment variables
        var timeFound = false;
        var nextArrival = startTime;
        var now = moment();
        var minutesAway;

        //Get next arrival time
        while(timeFound === false){
            if(moment(nextArrival, "H:m", true).isValid()){
                if(nextArrival >= now){
                    timeFound = true;
                    //Get minutes until next arrival
                    minutesAway = moment(nextArrival).diff(now, 'minutes');
                }
                else {
                    nextArrival.add(frequency, 'm');
                }
            }
            else {
                break;
            }

        }

        //Create Row
        var newRow = $('<tr data-name="' + snap.name + '">');
        newRow.append($('<td>' + snap.val().name + '</td>'));
        newRow.append($('<td>' + snap.val().destination + '</td>'));
        newRow.append($('<td>' + snap.val().frequency + '</td>'));
        newRow.append($('<td>' + nextArrival.format("h:mm A") + '</td>'));
        newRow.append($('<td>' + minutesAway + '</td>'));
        newRow.append($('<td><button class="delete-row" data-row = "' + snap.getKey() + '"><span class="glyphicon glyphicon-remove"></span></button>'));

        //Add to table
        $('.table').append(newRow);
    });

});