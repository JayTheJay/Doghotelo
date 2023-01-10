// take any errors and pass them to error handler via next 

module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    } 
}