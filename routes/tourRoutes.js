const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController')
// const catchAsync = require('./../utils/catchAsync')


const router = express.Router();

// router.param('id', tourController.checkID);

router
   .route('/top-5-cheap')
   .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  // .get(catchAsync(tourController.getAllTours))

  // .get(tourController.getAllTours)

  .get(authController.protect, tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;