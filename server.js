var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 8080;
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var obj = {};
app.locals.obj = obj;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/:time", function(req, res, next){
    var a = req.params.time;

    if(Number(a) && a.split("").length >= 13){ // unix
        var date = new Date(Number(a) * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() - 1;
        var day = "0" + date.getDate();
        var natural = months[month] + " " + day.substr(-2) + ", " + year;
        obj.natural = natural;
        obj.unix = a;
        res.render("result");
        return;
    }

    var url = a.replace(/%20|,/g, " "); // natual

    if(url.split(" ").length < 2){
        app.locals.warn = "Page not Found!";
        next();
        return;
    }

    var year = url.match(/(\d){4}/);
    if (!year) {
        app.locals.warn = "You forgot to insert the year!";
        next();
        return;
    }

    var month = url.match(/[a-zA-Z]+/);
    if (!month) {
        app.locals.warn = "You forgot to insert the month!";
        next();
        return;
    }
    month[0] = month[0].charAt(0).toUpperCase() + month[0].slice(1).toLowerCase();

    var day = url.split(" ").find(function(elem){
        return Number(elem) <= 31; 
    });
    if (!day) {
        app.locals.warn = "You forgot to insert the day!";
        next();
        return;
    }
    day = "0" + day;

    var natural = month[0] + " " + day.substr(-2) + ", " + year[0];

    var numMonth;
    months.forEach(function(elem, i){
        if(elem === month[0]){
            numMonth = i + 1;
        }
    });
    var trueTime = year[0] + " " + numMonth + " " + day.substr(-2);
    if(!numMonth){
        app.locals.warn = "Bad Month format!";
        next();
        return;
    };

    obj.natural = natural;
    obj.unix = new Date(trueTime).getTime();
    //console.log(new Date(obj.unix));
    res.render("result");
});

app.use(function(req, res){
    res.status(404).render("404");
});

app.listen(port, function(){
    console.log("The app is running")
});