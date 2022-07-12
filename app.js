const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const API_Key = config.APP_ID;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query
        + "&units=" + units + "&appid=" + API_Key + "";
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const temp = weatherData.main.temp;
            console.log(temp);
            const location = weatherData.name;
            console.log(location);
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<h1>Temp at your location: " + temp + " &degC");
            res.write("<br>Location: " + location + "</h1>");
            res.write("<img src=" + imgURL + ">");
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log("server started at port 3000");
});