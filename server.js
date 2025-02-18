const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


// mongoose.connect(DB, 
mongoose
  // .connect(process.env.DATABASE_LOCAL,
  .connect(DB, {
    useNewUrlParser: true,
    userCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))
  // .catch(err =>  console.log('Error'))

// .then(con => {
//   console.log(con.connections);
//   console.log('DB connection successful!');
// })

// const tourSchema = new mongoose.Schema({
//   // name: String,
//   name: {
//     type: String,
//     required: [true, 'A tour must have a name'],
//     unique: true
//   },
//   // rating: Number,

//   rating: {
//     type: Number,
//     deafult: 4.5
//   },
//   // price: Number

//   price: {
//     type: Number,
//     required: [true, 'A tour must have a price']
//   }
// });

// const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 477
// })


// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('error 💀', err);
// });


const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1)
  })
  // process.exit(1);
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 🔥 SHUTTING DOWN...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1)
  })
})
// console.log(x)