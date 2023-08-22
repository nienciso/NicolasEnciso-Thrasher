const express = require('express');
const indexRoutes = require("./routes/indexRoutes");
const app = express();
const PORT = 3000;

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/", indexRoutes);

app.use("/admin", require("./routes/adminRoutes"));



app.listen(PORT, ()=>{
    console.log("server ON",PORT);
});