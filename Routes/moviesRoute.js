const express = require("express");
const router = express.Router();

const {
  getHighestRated,
  getAllMovies,
  getSingleMovie,
  createNewMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
  getMovieByGenre,
} = require("../Controllers/moviesController");

router.route("/movieStats").get(getMovieStats);
router.route("/movieByGenre/:genre").get(getMovieByGenre);

router.route("/getHighestRated").get(getHighestRated, getAllMovies);
router
  .route("/")
  .get(getAllMovies)
  //validateBody will be called before creating new movie
  .post(createNewMovie);

router.route("/:id").get(getSingleMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
