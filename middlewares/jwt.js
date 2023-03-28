const { expressjwt: jwt } = require('express-jwt');

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request headers
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") { // Ejemplo: Bearer kdjekdncewnoeiñfewf
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
});

const isAdmin = (req, res, next) => {
  // next(); check out what is going on with the middlewares
  console.log(req.payload);
  if (req.payload.role === 'admin') {
    next()
  } else {
    res.status(401).json({ message: 'User is not admin'})
    return;
  }
}

const isloggedIn = (req, res, next) => {
  if (req.payload && req.payload.sub) {
    next()
  } else {
    res.redirect("/auth/signup");
    return;
  }
}


module.exports = {
  isAuthenticated,isloggedIn,
  isAdmin
}


