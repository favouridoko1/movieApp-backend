const mongoose = require("mongoose");
const fs = require('fs');
const moviesSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is a required field"],
    unique: true,
    maxlength: [100, "Movie title must not have more than 100 characters"],
    minlength: [4, "Movie title must not be less than 4 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: [true, "duration is a required field"],
  },
  ratings: {
    type: Number,
    // min: [1, "raings must be 1.0 or above."],
    // max: [10, "raings must be 10 or below."]
    // validate: {
    //   validator: function(value){
    //     return value >= 1 && value <= 10
    //   },
    //   message: "ratings ({VALUE})must not be above 1 and below 10"
    // }
    
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "release year is a required field"],
  },
  releaseDate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
    // select to false exclude the createdAt field from being shown in the result
    select: false,
  },
  genres: {
    type: [String],
    required: [true, "genres field is requried"],
    // Enum is a validator that indicate values which is accessable field
    // enum: {
    //   value:["Action", "Adventure", "Thriller", "Drama", "Crime", "Romance", "Comedy", "Biography", "Sci-fi", "Suspense"],
    //   message: "This genre does not exist"

    // }
  },
  directors: {
    type: [String],
    required: [true, "directors field is requried"],
  },
  coverImage: {
    type: String,
    required: [true, "image field is requried"],
  },
  actors: {
    type: [String],
    required: [true, "actors field is requried"],
  },
  price: {
    type: Number,
    required: [true, "price field is requried"],
  },
},
// Optional argument
{
  toJSON: {virtual: true},
  toObject: {virtual: true}
});

// Mongoose middlewares
// Document MiddleWare
// Executes preHook edits the document before it is saved .save() .create()
moviesSchema.pre('save', function(next){
  // this.createdBy= "FAVOURIDOKO";
  console.log(this);
  next();
})
// Executes the preHook edits the document after it is saved .save() .create()
moviesSchema.post('save', function(doc, next){
  const content = `A new movie with name ${doc.name} has being created by ${doc.createdBy}\n`
  fs.writeFileSync('../txt/log.txt', content, { flag: "a"}, (err)=> {
    console.log(err.message);
    next()
  });
  console.log(this);
  next()
})

// Query middleware allows us to run a function before and after a query
moviesSchema.pre(/^find/, function(next){
  this.find({releaseDate:{$lte:Date.now()}});
  this.startTime = Date.now();
  next()
});
moviesSchema.post(/^find/, function(docs,next){
  this.find({releaseDate:{$lte:Date.now()}});
  this.endTime = Date.now();
  console.log(`Query took ${this.endTime - this.startTime} miliseconds`)
  next()
});

// Aggregate Middleware
moviesSchema.pre('aggregate', function(next){

  next()
})

// Vitual properties are not actually present in the DOM
moviesSchema.virtual('durationInHours').get(function(){
  return this.duration / 60;
})

const Movie = mongoose.model('Movie', moviesSchema);

module.exports = Movie;
