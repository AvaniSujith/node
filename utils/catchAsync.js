module.exports = fn => {
  // fn(req, res, next).catch(err => next(err));
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };

};