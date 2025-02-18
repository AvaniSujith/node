// const fs = require('fs');


const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5',
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary, difficulty';
  next();
}


// class APIFeatures{
//   constructor(query, queryString){
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter(){
//      ///////////1) filtering
//   // const queryObj = {...req.query};
//   const queryObj = {...this.queryString };
//   const excludeFields = [ 'page', 'sort', 'limit', 'fields'];
//   excludeFields.forEach(el => delete queryObj[el]);



// // ////////2) advanced filtering
//   let queryStr = JSON.stringify(queryObj);
//   queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, match => `$${match}`);
//   console.log(JSON.parse(queryStr))
  
//   // console.log(req.query);

// //  const tours = await Tour.find({
// //   duration: 5,
// //   difficulty: 'easy'
// //  })

// // const query = Tour.find(JSON.parse(queryStr));

// // let query = Tour.find(JSON.parse(queryStr));
//     this.query.find(JSON.parse(queryStr));

//     return this;
//   }

//   sort(){
//     if(this.queryString.sort){
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     }else{
//       this.query = this.query.sort('-createdAt')
//     }

//     return this;

//   }

//   limitFields(){
//     if(this.queryString.fields){
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     }else{
//       this.query = this.query.select('-__v')
//     }
//     return this;
//   }

//   pagination(){
    
// const page = this.queryString.page * 1 || 1;
// const limit = this.queryString.limit * 1 || 100;
// const skip = (page - 1) * limit;

// // query = query.skip(2).limit(10);

// this.query = this.query.skip(skip).limit(limit);

// // if(this.queryString.page){

// //   const numTours = await Tour.countDocuments();
// //   if(skip >= numTours) throw new Error('This page does not exist');

// // }

// return this;

//   }
// }



// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

exports.getAllTours = catchAsync(async (req, res, next) => {
//   // console.log(req.requestTime);
// try{

//   // BUILD QUERY 

// //   ///////////1) filtering
// //   const queryObj = {...req.query};
// //   const excludeFields = [ 'page', 'sort', 'limit', 'fields'];
// //   excludeFields.forEach(el => delete queryObj[el]);



// // // ////////2) advanced filtering
// //   let queryStr = JSON.stringify(queryObj);
// //   queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, match => `$4{match}`);
// //   console.log(JSON.parse(queryStr))
  
// //   // console.log(req.query);

// // //  const tours = await Tour.find({
// // //   duration: 5,
// // //   difficulty: 'easy'
// // //  })

// // // const query = Tour.find(JSON.parse(queryStr));

// // let query = Tour.find(JSON.parse(queryStr));
  
///////////////sorting

// if(req.query.sort){
//   // query = query.sort(req.query.sort);
//   //sort('price ratingsAverage);



//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort('-createdAt');
// }

/////////////feild limiting
// if(req.query.fields){
//   const fields = req.query.fields.split(',').join(' ');
//   // query = query.select('name duration price')
//   query = query.select(fields);
// }else{
//   query = query.select('-__v');
// }

/////pagination

// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// // query = query.skip(2).limit(10);

// query = query.skip(skip).limit(limit);

// if(req.query.page){

//   const numTours = await Tour.countDocuments();
//   if(skip >= numTours) throw new Error('This page does not exist');

// }

  // const tours = await Tour.find().where('duartion').equals(5);

  /////////////// execute query

  // const query = Tour.find(queryObj)
  // const tours = await Tour.find(queryObj);

  /////3)execute

  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
  // }catch(err){
  // res.status(404).json({
  //   status: 'fail',
  //   message: err
  // })
});


exports.getTour = catchAsync(async (req, res, next) => {
  // try{
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return next(new appError('No tour found with taht is', 404));
    }
    res.status(200).json({
      status:'success',
      data: {
        tour
      }
    })
  // }catch(err){
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   })
  })
  // console.log(req.params);
  // const id = req.params.id * 1;n

  // const tour = tours.find(el => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
// };



exports.createTour = catchAsync(async (req, res, next) => {

  // const newTour = new Tour({})
  // newTour.save()

 const newTour = await Tour.create(req.body);

  // console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });

    // }catch(err){
    //   res.status(400).json({
    //     status: 'Fail',
    //     message: err
    //     // message: 'Invalid'
    //   })
    // }
  // );

  });

exports.updateTour = catchAsync(async (req, res, next) => {

  // try{
  // runValidators: true

  const tour = Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      // tour: '<Updated tour here...>'
      tour
    }
  });
// }catch(err){
//   res.status(400).json({
//     status: 'Fail',
//     message: err
//   })
});


exports.deleteTour = catchAsync(async (req, res, next) => {
  // try{
  // // const tour = 
  Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });

// }catch(err){
//   res.status(404).json({
//     status:'Fail',
//     message: err
//   })
})
// }


exports.getTourStats = catchAsync(async (req, res, next) => {
  // try{
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 }}
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" }, 
          numTours: { $sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'},

        },

        // $sort: {
        //   $sort : {avgPrice:1} 
        // },
        // {
        //   $match {_id: { $ne: 'EASY' }}
        // }
        $sort : { avgPrice:1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
         stats
      }
    })
 
})


// aggregation pipeline:Unwinding and projecting
 

exports.getMonthlyPlan = catchAsync (async (req, res, next) => {
  // try{

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
          }
        }
      },{
        $group: {
          _id: { $month: `$startDates`},
          numTourStarts: { $sum: 1},
          tours: { $push: `$name`}
        }
      },
      {
        $addFields: { month: `$_id`}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1}
      },
      {
        $limit: 6
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });


  // }catch(err){
  //   res.status(404).json({
  //     status: 'Fail',
  //     message: err
  //   })
  // }
})

