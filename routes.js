module.exports = function(app, passport) {
    var workDay = require('./models/workDay');
    var swap = require('./models/swap');
    var user = require('./models/user');
    var contact = require('./models/contact');
    var bodyParser = require('body-parser');
    var email;
    var dateFormat = require('dateformat');

    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    var stepLevel;

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
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });


  // process the login form
  // app.post('/login', do all our passport stuff here);


  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });



  // process the signup form
  // app.post('/signup', do all our passport stuff here);
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)

// rendering the redirected home page,
//displaying the link to approve shiftwaps by using isApproved boolean value
//sending user, count and flash message
  app.get('/profile', isLoggedIn, function(req, res) {
  swap.count({
    isApproved: false
  }, function(err, toapproved) {
    console.log(toapproved);

    res.render('profile.ejs', {
      user: req.user,
      toapproved: toapproved,
      message: req.flash('datamessage')
    });
  });
  req.session.user=user;
});

//a form request from profile page, take raw Json DATA to populate workdays
//needs to improve and validate insert***************************
  app.post('/loadJson', function(req, res) {
    var data = JSON.parse(req.body.jsonData);
    //console.log(data);
    workDay.collection.insertMany(data);
    res.redirect('/profile');
  });

//the viewall page , the initial rendering where just the dates are showed.
  app.get('/viewall', isLoggedIn, function(req, res) {
    res.render('viewall.ejs', {
      workDays: null,
      message: req.flash('shiftmessage')
    });
  });

// the edituser buttonclick from profile page,
//the email is retrive and user object is passed, to set shift name and workphone number.
  app.post('/findUser', isLoggedIn, function(req, res) {
    email = req.body.email_id;
    console.log(email);
    user.find(({
      'local.email': email
    }), function(err, resultSet) {
      if (err) {
        throw err;
        req.flash('userMessage', 'Error Encountered')
      }

      email = resultSet[0].local.email;
      var shiftName = resultSet[0].local.shiftName;
      var workPhone = resultSet[0].local.workPhone;
      var id = resultSet[0]._id;
      console.log(id + email + shiftName + workPhone);

      res.render('edituser.ejs', {
        'email': email,
        'shiftName': shiftName,
        'workPhone': workPhone,
        'id': id,
        message: req.flash('userMessage')
      });
    });
  });


//form from edit user, where we update data passed throug the form
//need to insert email and phone number validation + name validation. preferably a client side validation.
  app.post('/updateUser', isLoggedIn, function(req, res) {
  email = req.body.email;
  var shiftName = req.body.shiftName;
  var workPhone = req.body.workPhone;
  var Oid = req.body.Oid;
  console.log(Oid);
  var ObjectId = require('mongodb').ObjectID;
  console.log(Oid + email + shiftName + workPhone);

  var conditions = {
    "_id": ObjectId(Oid)
  };
  var update = {
    'local.shiftName': shiftName,
    'local.workPhone': workPhone,
    'local.email': email
  };
  user.findOneAndUpdate(conditions, update, function(err, doc) {
    if (err) {
      throw err;
      req.flash('edituserMessage', 'Update failed');
    }
    console.log(doc)
    req.flash('edituserMessage', 'update sucsessfull');
    res.render('edituser.ejs', {
      'email': email,
      'shiftName': shiftName,
      'workPhone': workPhone,
      'id': doc._id,
      message: req.flash('edituserMessage')
    });
  });
});


  app.get('/myshift', isLoggedIn, function(req, res) {
    workDay.distinct(("staff.name"), function(err, resultSet) {
      if (err) {
        throw err;
        req.flash('myshiftmessage', 'Error Encountered');
      }
      res.render('myshift.ejs', {
        'shiftdata': null,
        'resultSet': resultSet,
        message: req.flash('myshiftmessage')
      });
    });
  });

app.get('/toApprove', isLoggedIn ,function(req,res){

var today = new Date();

var firstday=dateFormat(today,'mm/01/yyyy');
console.log(firstday);
swap.find({isApproved:false,firstDate:{$gte:firstday}},function(err,swaps){
  if(err)
  {
    throw err;
    req.flash('myswapmessage', 'Error Encountered');
  }

  res.render('toApprove.ejs',{
    'swaps':swaps,
    message:req.flash('myswapmessage')
  });
});
});

  app.post('/myshiftdates', isLoggedIn, function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var user1=req.user;
    console.log(user1.local.shiftName);
    var staff = user1.local.shiftName;

    console.log(staff);
    workDay.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      "staff.name": staff
    }, {
      "date": 1,
      "_id": 0,
      "staff.$": staff
    }, function(err, shiftdata) {
      if (err) {
        throw err;
        req.flash('myshiftmessage', 'Error Encountered');
      }
      if(shiftdata.length==0)
      {
        req.flash('myshiftmessage', 'No Data Found, Choose another set of dates.');
      }
          res.render('myshift.ejs', {
          'shiftdata': shiftdata,
          message: req.flash('myshiftmessage')
        });
      });
    });


  app.post('/rosterDates', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    //console.log(data);
    workDay.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }, function(err, workDays) {
      if (err) {
        throw err;
        req.flash('shiftmessage', 'Data Not Found')
      };
        res.render('viewall.ejs', {
        workDays: workDays,
        message: req.flash('shiftmessage')
      });
      //res.redirect('/viewall');
    });
  });

  app.get('/swapShift', isLoggedIn, function(req, res) {
    stepLevel = 1;
      workDay.distinct(("staff.name"), function(err, resultSet) {
      if (err) {
        throw err;
        req.flash('validationMessage', 'Error Encountered');
               }

      res.render('swapShift.ejs', {
        message: req.flash('validationMessage'),
        'stepLevel': stepLevel,
        'resultSet': resultSet
      });
    });
  });

//get form for delegate shift, rendering with staff names , and current username
app.get('/delegateShift',isLoggedIn, function(req, res) {
  var myName= req.user.local.shiftName;
  console.log(myName);
  workDay.distinct(("staff.name"), function(err, resultSet) {
    console.log(resultSet);
    req.session.selectStaff=resultSet;
    res.render('delegateShift.ejs', {
      'resultSet': resultSet,
      'myName':myName,
       message: ''
    });
  });
});

app.post('/delegateForm', function(req, res) {
  var firstName = req.user.local.shiftName;
  var date = req.body.startDate;
  var secondName = req.body.selectStaff;
  var shift = req.body.selectShift;
  var email = req.user.local.email;
  var myName= req.user.local.shiftName;
  var isAvailable = 1;
  workDay.find({date:date},{'staff':{$elemMatch:{'name':secondName}}, '_id':0},
  function(err,data)
  {
  //  console.log(JSON.stringify(data[0].staff[0].name));
    var temp= JSON.stringify(data);
    console.log(temp.length+temp);

    if(temp.length>14)
       isAvailable=0;
     workDay.find({ date: date, 'staff.shift': shift }, {'staff.$': firstName, 'date': 1 },  function(err, validateShift) {
      if (err) {
        throw err;
        req.flash('validationMessage', 'Error Encountered');
      }
      console.log(isAvailable+'outside');
      if ((firstName === validateShift[0].staff[0].name)&& isAvailable)
       {
        var delSwap = new swap({
          'firstShift': shift,
          'firstName': firstName,
          'firstDate': date,
          'secondShift': shift,
          'secondName': secondName,
          'secondDate': date,
          'submittedBy': email,
          'submitDate': new Date()
        });
        if (swap.collection.insert(delSwap))
         {
          req.flash('validationMessage', 'Shift located and Submitted for Approval');
        } else
        {
          req.flash('validationMessage', 'Error submitting shift for approval');
        }

      }
      else
      {
        req.flash('validationMessage', 'Selected Shift is invalid Or '+ secondName + ' already has a shift on the choosen day');
      }
      res.render('delegateShift.ejs', {
        'resultSet': req.session.selectStaff,
        'myName':myName,
         message: req.flash('validationMessage')
});
});

});
});

app.post('/approveswap', function(req,res){
var firstDate=req.body.firstDate;
var firstName=req.body.firstName;
var firstShift=req.body.firstShift;
var secondName=req.body.secondName;
var secondDate=req.body.secondDate;
var secondShift=req.body.secondShift;
var swapType=req.body.swapType;
var id=req.body.id;
console.log(req.body);

workDay.find({date:firstDate},function(err,day){
var firstday=new workDay();
firstday=day;
console.log(firstday[0].staff);
if(swapType ===" Delegated ")
{
  console.log("Delegation Choosen");
  workDay.update({'date':firstDate,'staff.shift':firstShift},{'$set':{'staff.$.name':secondName}},function(err,respon){console.log(respon);});


}
else
{
  console.log("Swapping choosen");
}

});








});

app.post('/deleteswap', function(req,res){
var firstDate=req.body.firstDate;
var firstName=req.body.firstName;
var firstShift=req.body.firstShift;
var secondName=req.body.secondName;
var secondDate=req.body.secondDate;
var secondShift=req.body.secondShift;
});




//reaally long form for swapping including step level to check the step in form and validation form.
app.post('/validateStep1', function(req, res) {
      var name = req.body.selectStaff;
      var date = req.body.startDate;
      var shift = req.body.selectShift;
      var evaluvation = req.body.evaluvation;
      var email =req.user.local.email;
      console.log(email);

      if (evaluvation === '1') {
        console.log(evaluvation);
        //setting set levelto 1 to render diffrent forms, the value is set to 2 if a matching shift is found.
        stepLevel = 1;
        workDay.find({
          date: date,
          'staff.shift': shift
        }, {
          'staff.$': name,
          'date': 1
        }, function(err, validateShift) {
          if (err) {
            throw err;
            req.flash('validationMessage', 'Error Encountered');
          }
          console.log(validateShift[0]);
          if (name === validateShift[0].staff[0].name) {
            req.flash('validationMessage', 'Shift located - choose the second shift');
            stepLevel = 2;
          } else {
            req.flash('validationMessage', 'Couldnt locate Shift');
          }
          workDay.distinct(("staff.name"), function(err, resultSet) {
            res.render('swapShift.ejs', {
              message: req.flash('validationMessage'),
              'stepLevel': stepLevel,
              'resultSet': resultSet,
              'validateShift': validateShift
            });
          });
        });
      }
      if (evaluvation === '2') {
        var firstShift = req.body.firstShift;
        var firstName = req.body.firstName;
        var firstDate = req.body.firstDate;
        console.log(firstDate + firstName + firstShift);
        stepLevel = 2;
        workDay.find({
          date: date,
          'staff.shift': shift
        }, {
          'staff.$': name,
          'date': 1
        }, function(err, validateShift) {
          if (err) {
            throw err;
            req.flash('validationMessage', 'Error Encountered');
          }
          console.log(validateShift[0]);
          if (name === validateShift[0].staff[0].name) {
            req.flash('validationMessage', 'Shift located - Submit for approval');
            stepLevel = 3;
          } else {
            req.flash('validationMessage', 'Couldnt locate Second Shift- try again');
          }
          workDay.distinct(("staff.name"), function(err, resultSet) {
            res.render('swapShift.ejs', {
              message: req.flash('validationMessage'),
              'firstName': firstName,
              'firstShift': firstShift,
              'firstDate': firstDate,
              'stepLevel': stepLevel,
              'resultSet': resultSet,
              'validateShift': validateShift
            });
          });
        });

      }

      if (evaluvation === '3') {
        var firstShift = req.body.firstShift;
        var firstName = req.body.firstName;
        var firstDate = req.body.firstDate;
        var secondShift = req.body.secondShift;
        var secondName = req.body.secondName;
        var secondDate = req.body.secondDate;
        console.log(secondName + secondShift);
        var swap1 = new swap({
          'firstShift': firstShift,
          'firstName': firstName,
          'firstDate': firstDate,
          'secondShift': secondShift,
          'secondName': secondName,
          'secondDate': secondDate,
          'submittedBy': email,
          'submitDate': new Date()

        });
        if (swap.collection.insert(swap1)) {
          req.flash('validationMessage', 'Swap sumitted for approval');
        } else {
          req.flash('validationMessage', 'Error Encountered');
        }
        console.log(swap1);
        stepLevel = 1;
        workDay.distinct(("staff.name"), function(err, resultSet) {
          if (err) {
            throw err;
            req.flash('validationMessage', 'Error Encountered');
          }
          res.render('swapShift.ejs', {
            message: req.flash('validationMessage'),
            'stepLevel': stepLevel,
            'resultSet': resultSet
          });
        });
      }



});
// =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  function  validateShift ( name, shift, date, next)
  {
    console.log("calling validateShift");

  }

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}


//trying to create a function to serch if there is an existing shift matching the passed argument, returns bool
