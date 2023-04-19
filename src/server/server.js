const app = require("./index");

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('listening on port 8080!');
})