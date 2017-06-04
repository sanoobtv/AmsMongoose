module.exports = function(app, passport) {
var workDay  = require('./models/workDay');
var bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var resultSet=  workDay.distinct(("staff.name"), function(err,resultSet)
 {
   if (err)
    {
        throw err;
    }
    console.log(resultSet);
return resultSet;
  //  res.render('myshift.ejs', { 'shiftdata' : null, 'resultSet' : resultSet , message: req.flash('myshiftmessage') });
});

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);


        app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });



    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', { user : req.user , message: req.flash('datamessage') });
    });

    app.post('/loadJson', function(req, res){
      var data = JSON.parse(req.body.jsonData);
      //console.log(data);
      workDay.collection.insertMany(data);
      res.redirect('/profile');
    });
    app.get('/viewall', isLoggedIn, function(req, res) {
        res.render('viewall.ejs', { workDays : null , message: req.flash('shiftmessage') });
        //console.log(workDays);
    });

    app.get('/myshift', isLoggedIn, function(req, res) {
        workDay.distinct(("staff.name"), function(err,resultSet)
       {
         if (err)
          {
              throw err;
              req.flash('myshiftmessage','Error Encountered')
          }

          console.log(resultSet);
          res.render('myshift.ejs', { 'shiftdata' : null, 'resultSet' : resultSet , message: req.flash('myshiftmessage') });
      });
    });
//db.workdays.find({"staff.name":"Sanu"},{"date":1,"staff.$":"Sanu","_id":0}).pretty(){"date":1,"staff.$":"Sanu"}
   app.post('/myshiftdates', isLoggedIn, function(req, res) {
        var startDate=req.body.startDate;
        var endDate=req.body.endDate;
        var staff=req.body.selectStaff;
        console.log(resultSet);
        workDay.find({date:{$gte:startDate,$lte:endDate},"staff.name":staff},{"date":1,"_id":0,"staff.$":staff}, function(err,shiftdata)
       {
         if (err)
          {
              throw err;
              req.flash('myshiftmessage','Error Encountered')
          }

          console.log(JSON.stringify(shiftdata));
          res.render('myshift.ejs', { 'resultSet' : resultSet, 'shiftdata' : shiftdata , message: req.flash('myshiftmessage') });
      });
    });

    app.post('/rosterDates', function(req, res){
      var startDate = req.body.startDate;
      var endDate = req.body.endDate;
      //console.log(data);
      workDay.find({date:{$gte:startDate,$lte:endDate}}, function(err, workDays) {
        if (err) {throw err; req.flash('shiftmessage', 'Data Not Found')};
     console.log(workDays[0].staff.length);
     res.render('viewall.ejs', { workDays : workDays , message: req.flash('shiftmessage') });
     //res.redirect('/viewall');
  });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });





};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
