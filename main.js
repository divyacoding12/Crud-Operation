// //import

// const express = require('express')
// const mongoose = require('mongoose');
// const session = require('express-session')

// const app = express();
// const PORT = process.env.PORT || 5500;

// //database connection
// mongoose.connect("mongodb://127.0.0.1:27017/node_crud");
// const db = mongoose.connection;
// db.on('error',(error)=>{console.log("error");})

// db.once('open',() =>{console.log('connect to the database')
// })


// //middleware
// app.use(express.urlencoded({extended:false}));
// app.use(express.json());


// app.use(session({
//     secret :'my_secret_key',
//     saveUninitialized:true,
//     resave:false
// }))

// app.use((req,res,next) =>{
// res.locals.message= req.session.message;
// delete req.session.message;
// next();
// })

// app.use(express.static("uploads"))
// //template engin
// app.set('view engine','ejs');

// //route prefix
// app.use("", require("./routers/routes.js"))

// app.listen(PORT,()=>{
//     console.log(`server starting at port:http://localhost:${PORT}`);
// })
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5500;

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/node_crud");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'my_secret_key',
  saveUninitialized: true,
  resave: false
}));

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

// Template engine setup (assuming EJS)
app.set('view engine', 'ejs');

// Route setup
app.use("", require("./routers/routes.js"))

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
