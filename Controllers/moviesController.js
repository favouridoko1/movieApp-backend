const fs = require("fs");
const Movie = require("../Models/movieModel");
// const ApiFeatures = require("../utils/ApiFeatures")

// const movies = JSON.parse(fs.readFileSync("./data/data.json"));

const getHighestRated = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";
  next();
};

// ROUTES HANDLER
const getAllMovies = async (req, res) => {
  // Instatiate The class
  // const features = new ApiFeatures(Movie.find(), queryStr)

  let queryStr = JSON.stringify(req.query);
  // console.log(queryStr)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const queryObj = JSON.parse(queryStr);
  let query = Movie.find(queryObj);
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = await query.sort(sortBy);
  } else {
    query = await query.sort("-createdAt");
  }

  // Geting some error's
  // LIMITING FIELDS
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   console.log(fields);
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v");
  // }

  // Geting some error's
  // PAGINATION
  // const page = +req.query.page || 1;
  // const limit = +req.query.limit || 10;
  // // Page 1: 1-10 Page2: 11-20 page3: 21-30
  // const skip = (page-1)* limit
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const moviesCount = await Movie.countDocuments()
  //   if(skip >= moviesCount) {
  //     return new Error("This Page is not found!")
  //   }
  // }

  try {
    const movies = await query;
    // console.log(query);
    // query.sort('releaseYear', 'ratings')

    // const movies = await Movie.find(req.params)
    //                       .where('name')
    //                       .equal(req.query.name)
    //                       .where('');
    res
      .status(200)
      .json({ success: true, length: movies.length, data: { movies } });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getSingleMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({ success: true, data: { movie } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createNewMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: { movie } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: { movie } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie)
      res
        .status(400)
        .json({ success: false, message: `Movie with id ${id} Not found` });
    res.status(202).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Agregation Pipeline
const getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      // $match used to match or filter out some data
      { $match: { ratings: { $gte: 4.5 } } },

      // $group is used to group some documents together using some accumulator
      {
        $group: {
          _id: "$releaseYear",
          avgRatings: { $avg: "$ratings" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalPrice: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { minPrice: 1 } },
      { $match: { maxPrice: { $gte: 60 } } },
    ]);
    res.status(200).json({ success: true, length: stats.length, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Agregation Pipeline cont
const getMovieByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genre: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      // {$limit:6},
      { $match: { genre: genre } },
    ]);

    res
      .status(200)
      .json({ success: true, length: movies.length, data: movies });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHighestRated,
  getAllMovies,
  getSingleMovie,
  createNewMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
  getMovieByGenre,
};
