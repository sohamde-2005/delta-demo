// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }

// or
// module.exports = (fn)=> wrapAsync(fn){
//     return (req,res,next)=>{
//         fn(req,res,next).catch(next);
//     };
// };
//or
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = wrapAsync;