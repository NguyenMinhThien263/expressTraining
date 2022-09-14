const express = require('express');
const app = express();
const router = express.Router();
var port  =3000;
app.get('/', (req, res) => {
    res.send("hi there!");
});
app.listen(process.env.PORT || port);
console.log("listening: " + (process.env.PORT || port));