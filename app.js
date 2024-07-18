const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const weather_api_key = require("./apikey");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the "public" directory

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const API_Key = weather_api_key;
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    API_Key +
    "";
  https
    .get(url, function (response) {
      console.log(response.statusCode);

      if (response.statusCode !== 200) {
        res.json({
          error: "Error fetching data from the weather API. Please try again.",
        });
        return;
      }

      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        console.log(weatherData);

        if (weatherData.cod !== 200) {
          res.json({ error: weatherData.message });
          return;
        }

        const temp = weatherData.main.temp;
        const location = weatherData.name;
        const icon = weatherData.weather[0].icon;
        const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.json({
          temp: temp,
          location: location,
          imgURL: imgURL,
        });
      });
    })
    .on("error", function (e) {
      console.error(e);
      res.json({
        error: "Error fetching data from the weather API. Please try again.",
      });
    });
});

app.listen(3000, function () {
  console.log("Server started at port 3000");
});
