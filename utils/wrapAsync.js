module.exports = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

/* tamre error handle karva kato wrapAsync function joye or try/catch */
// ahi try & catch vapryu che 
// aa fakt practice mate banavyu che 