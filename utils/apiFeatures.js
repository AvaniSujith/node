
class APIFeatures{
    constructor(query, queryString){
      this.query = query;
      this.queryString = queryString
    }
  
    filter(){
       ///////////1) filtering
    // const queryObj = {...req.query};
    const queryObj = {...this.queryString };
    const excludeFields = [ 'page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
  
  
  
  // ////////2) advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, match => `${match}`);
    console.log(JSON.parse(queryStr))
    
    // console.log(req.query);
  
  //  const tours = await Tour.find({
  //   duration: 5,
  //   difficulty: 'easy'
  //  })
  
  // const query = Tour.find(JSON.parse(queryStr));
  
  // let query = Tour.find(JSON.parse(queryStr));
      this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort(){
      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      }else{
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
  
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      }else{
        this.query = this.query.select('-__v')
      }
      return this;
    }
  
    pagination(){
      
  const page = this.queryString.page * 1 || 1;
  const limit = this.queryString.limit * 1 || 100;
  const skip = (page - 1) * limit;
  
  // query = query.skip(2).limit(10);
  
  this.query = this.query.skip(skip).limit(limit);
  
  // if(this.queryString.page){
  
  //   const numTours = await Tour.countDocuments();
  //   if(skip >= numTours) throw new Error('This page does not exist');
  
  // }
  
  return this;
  
    }
  }
  
  module.exports = APIFeatures;