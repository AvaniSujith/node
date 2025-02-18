const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    // name: String,
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, 
      maxlength: [40, 'A tour name must have less or equal than 40 char'],
      minlength: [10, 'A tour must have atleast 10 char'],
    //   validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,

    duration: {
        type: Number,
        required: [ true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, ' A tour must have a group size']
    },
    difficulty:{
        type: String,
        required: [true, 'a tour must have a grouop size'],
        trim:true,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty should be either easy, medium or difficult'
        }
    },
    // rating: Number,
  
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Max number must be 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    // price: Number
  
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount:{
        type: Number,
        validate:{

            validator: function(val){
                //this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: `Discount price ({VALUE}) should be below regular price`
        }

    } ,
    summary: {
        type: String,
        trim: true,
        required: [true, 'a tour must have a description']
    },
    description: {
        type:String,
        trim: true
    },
    imageCover: {
        type:String,
        required: [true, 'A tour must hava a cover image']
    },
    image: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type : Boolean,
        default : false
    }
  },
{
    toJSON: { virtuals:  true},
    toObject : { virtuals: true}
}

);

  tourSchema.virtual('durtionWeeks').get(function(){
    return this.duration / 7;
  });


//  *************************** DOCUMENT MIDDLEWARE ***************************
//  runs before .save() and .create()


//   tourSchema.pre('save', function(){
//     console.log(this)
//   })

tourSchema.pre('save', function(next){

    this.slug = slugify(this.name, { lower: true});
    next();
       
}); 

// tourSchema.pre('save', function(next){
//     console.log('Will save document');
//     next();
// })


// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// });


// ************************** QUERY MIDDLEWARE ***********************************

// tourSchema.pre('find', function(next){
    
//     this.find({ secretTour: {$ne: true}})
//     next();

// });

tourSchema.pre(/^find/, function(next){
    
    this.find({ secretTour: {$ne: true}});

    this.start = Date.now();
    next();

});

tourSchema.post(/^find/, function(docs, next){

    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    console.log(docs);
    next();

});


// ******************AGGRERGATION MIDDLEWARE************

tourSchema.pre('aggregate', function(next){

    this.pipeline().unshift({ $match: { $ne:  true}})
    console.log(this.pipeline());
    next();
})

  
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

tourSchema.pre('save',function(){
    console.log()
});

