const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({path: './'})
const Movies = require('../Models/movieModel');
const movies = JSON.parse(fs.readFileSync('../data/import-dev-data.js', 'utf-8'));

mongoose
  .connect(process.env.CONN_URI, {
    useNewUrlParser: true,
  })
  .then((conn) => console.log("DB connection successful"))
  .catch((err) => console.log("An error occured: " + err));


  // DELETE EXISTING MOVIE FROM COLLECTION 
  const deleteMovies = async ()=> {
    try {
        const movie = await create(movies);
        console.log("Data successfully imported")
    } catch (error) {
        console.log(error.message)
    }
  }

  // IMPORT EXISTING MOVIE FROM COLLECTION 
  const importMovies = async ()=> {
    try {
        const movie = await deleteMany();
        console.log("Data successfully deleted")
    } catch (error) {
        console.log(error.message)
    }
    process.exit()
  }
  if(process.argv[2]=== "--import") {
    return importMovies();
  } else if(process.argv[2]==="--delete") {
    return deleteMovies();
  }

