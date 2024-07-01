const mongoose = require("mongoose");
const app = require('./app');


mongoose
  .connect(process.env.CONN_URI 
    // {useNewUrlParser: true}
  )
  .then((conn) => console.log(" Connection to Successful"))
  .catch((err)=> console.log(`An error occured ` + err) );
