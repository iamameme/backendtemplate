var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/charityapp'; // startrek is an example database name
var db = pgp(connectionString);

var AuthenticationClient = require('auth0').AuthenticationClient;
var auth0 = new AuthenticationClient({
  domain: 'iamameme.auth0.com'
});

/////////////////////
// Query Functions
/////////////////////

function getAllStarships(req, res, next) {
  db.any('SELECT * FROM micropayments')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all micropayments'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getStarship(req, res, next) {
  auth0.getProfile(req.query.accessToken, function (err, userInfo) {
    if (err) {
      // Handle error.
      res.status(200)
          .json({
            status: 'error',
            data: err,
            message: "Couldn't authenticate user"
          });
      console.log(err);
    }
    var id = req.params.id;
    db.any("SELECT * FROM micropayments WHERE user_id = '" + id + "'")
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved all starships for user'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  });
}

function createStarship(req, res, next) {
  auth0.getProfile(req.query.accessToken, function (err, userInfo) {
    if (err) {
      // Handle error.
      res.status(200)
          .json({
            status: 'error',
            data: err,
            message: "Couldn't authenticate user"
          });
      console.log(err);
    }

    req.body.amount = parseInt(req.body.amount);
      db.any('INSERT INTO micropayments(user_id, amount, timeadded)' +
          'values(${user_id}, ${amount}, current_timestamp)',
        req.body)
        .then(function () {
          res.status(200)
            .json({
              status: 'success',
              message: 'Inserted one starship'
            });
        })
        .catch(function (err) {
          return console.log(err);
        });
  });
  
}

function updateStarship(req, res, next) {
  auth0.getProfile(req.query.accessToken, function (err, userInfo) {
    if (err) {
      // Handle error.
      res.status(200)
          .json({
            status: 'error',
            data: err,
            message: "Couldn't authenticate user"
          });
      console.log(err);
    }

    db.none('UPDATE micropayments SET amount=$1 where user_id=$2',
      [parseInt(req.body.amount), req.body.user_id ])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated starship'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  });
}

function removeStarship(req, res, next) {
  auth0.getProfile(req.query.accessToken, function (err, userInfo) {
    if (err) {
      // Handle error.
      res.status(200)
          .json({
            status: 'error',
            data: err,
            message: "Couldn't authenticate user"
          });
      console.log(err);
    }

    var id = parseInt(req.params.id);
    db.result('DELETE FROM micropayments WHERE id = $1', id)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: 'Removed ${result.rowCount} micropayments'
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  });
}


/////////////
// Exports
/////////////

module.exports = {
    getAllStarships: getAllStarships,
    getStarship: getStarship,
    createStarship: createStarship,
    updateStarship: updateStarship,
    removeStarship: removeStarship
};
