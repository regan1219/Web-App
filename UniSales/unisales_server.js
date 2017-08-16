var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var Models = require('./model/models');
var bcrypt = require('bcrypt');
var app = express();
var SALT_WORK_FACTOR = 10;

app.use(express.static(__dirname + '/'));


// Set up to use a session
app.use(session({
  secret: 'super_secret',
  resave: false,
  saveUninitialized: false
}));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Include validator here
app.use(expressValidator());
//Render engine 
app.set('view engine', 'ejs');


// Function for post user
function postUser(req, res)
{
    console.log("Create User");
    if (!req.body.email || !req.body.password)
    {
        res.statusCode = 404;
        return res.send("Email or password is missing");
    }
    var request = new Models.User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname : req.body.lastname
    });

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    request.password = hash;

    request.save(function (err) {
          if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to create a user");
          }
          else
          {
                // Success: Send the updated user back
                findUserWithDoesntExistPossibility(res, {email:req.body.email});
          }
      });
}

// Function for get a user
function getUser(req, res) {
    var id = req.query.id;
    var email = req.query.email;
    if(id)
    {
        findUserWithDoesntExistPossibility(res, {_id:id});
    }
    else if (email)
    {
        findUserWithDoesntExistPossibility(res, {email:email});
    }
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid for getuser"});
    }
}

//login function
function login(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  Models.User.findOne({email: email}, function(err, user) {
        if (err)
        {
            throw err;
        }
        else if (!user)
        {
            console.log("Failed to find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
          // test a matching password
          var result = bcrypt.compareSync(password, user.password);
          if (result) {
              console.log("Password correct");
              req.session.email = req.body.email;
              req.session.uid = user._id;
              var fullname = user.firstname + " " + user.lastname;
              req.session.fullname = fullname;
              console.log(req.session);
              // res.render('user_info_page', {fullname : fullname});
              showUser(req,res); 
          } else {
              console.log("Password wrong");
              res.statusCode = 401;
              return res.send({error: "Login Failed"});
          }
        }
  });
  
}

//logout
function logout(req, res) {
  console.log('logging out ' + req.session.uid);
  req.session.destroy(function(err) {
    if (!err) {
      res.redirect('/search_result_page.html');
    }
  })
}

// get product
function getProduct(req, res) {
    var id = req.session.uid;
    if(id)
    {
	
        findProduct(res, {ownerid:id});
    }
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid for getproduct"});
    }
}

// change password
function changePass(req, res) {
   
    var id = req.session.uid;
    console.log("uid: " +  id)
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    if(id)
    {
        changeUserPassword(res, {_id:id}, hash);
    }
   
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid for changepassword"});
    }
}


// post a product
function postProduct(req, res)
{
    console.log("Create Product");

    var id = req.session.uid;
    
    console.log("uid: " +  id)
    if(id){
        var newproduct = new Models.Product({
            productname: req.body.productname,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            ownerid : id
        });
        newproduct.save(function (err) {
              if (err) {
                console.log(err);
                res.statusCode = 403;
                return res.send("Failed to create a product");
              }
              else
              {
                    // Success: Send the updated product back
                    findProduct(res, {ownerid : id, productname: req.body.productname,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description});
              }
          });
    }
}

//change a product
function changeProduct(req, res) {
    var uid = req.session.uid;
    var pid = req.body.pid;
    var productname = req.body.productname;
    var price = req.body.price;
    var category = req.body.category;
    var description = req.body.description;
    var condition = {}
  

    if(productname){
            condition.productname = productname;
        }

    if(price){
            condition.price = price;
        }

    if(category){
            condition.category = category;
        }

    if(description){
            condition.description = description;
        }


    
    if(uid)
    {
        changeProductStats(res, {_id: pid, ownerid: uid }, condition);
    }
   
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid for change product"});
    }
}


// delete a product
function deleteProduct(req, res) {

    Models.Product.deleteOne({
      ownerid: req.session.uid, _id: req.body.pid
    }, function(err, result) {
	if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.json("Failed to delete a product");
          }
          else if (result.deletedCount === 0){
          
            return res.json("Failed to delete a product");
           
        }
          else
          {
                return res.json("Delete successfully");
          }
    });
}

// Helper function for find user
function findUserWithDoesntExistPossibility(res, query)
{
    Models.User.find(query, function(err, users) {
        if (err)
        {
            throw err;
        }
        else if (!users.length)
        {
            console.log("Can't find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
            var result = {};
            result.email = users[0].email;
            result.firstname = users[0].firstname;
            result.lastname = users[0].lastname;
            console.log(JSON.stringify(result));
            return res.json(result);
        }
    });
}

//post comment function
function postComment(req, res)
{
    console.log("Create Comment");
    var request = new Models.Comment({
        title: req.body.title,
        message: req.body.message,
        product: req.body.product
    });
    request.save(function (err) {
        if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to create a comment");
        }
        else
        {
            findComment(res, {title:req.body.title});
        }

    });
}

function findUserIdByEmail(email)
{
    var query = {email : email};
    Models.User.find(query, function(err, users) {
        if (err)
        {
            throw err;
        }
        else if (!users.length)
        {
            console.log("Can't find the user");
            return -1;
        }
        else
        {
            console.log(users[0]._id);
            return users[0]._id;
        }
    });    
}
//post user comments
function postUserComments(req, res)
{
    console.log("Create User Comment");
    var userid;
    if (req.body.email)
    {
        Models.User.find({email : req.body.email}, function(err, users) {
        if (err)
        {
            throw err;
        }
        else if (!users.length)
        {
            console.log("Can't find the user");
            return -1;
        }
        else
        {
            console.log(users[0]._id);
            var request = new Models.UserComment(
                {
                    title: req.body.title,
                    message: req.body.message,
                    userid: users[0]._id
                }
            );
            request.save(function (err) {
                if (err) {
                    console.log(err);
                    res.statusCode = 403;
                    return res.send("Failed to create a user comment");
                }
                else
                {
                    findUserComment(res, {userid: req.body.userid});
                }
            }); 
         }
        });
    }
   
}
//find comment function
function findComment(res, query)
{
    Models.Comment.find(query, function(err, comments) {
        if (err)
        {
            throw err;
        }
        else if (!comments.length)
        {
            console.log("Can't find the comment(s)");
            res.statusCode = 404;
            return res.send("Failed to find the comment(s)");
        }
        else
        {
          console.log(JSON.stringify(comments));
          return res.json(comments);
        }
    });
}

function findUserComment(res, query)
{
    Models.UserComment.find(query, function(err, usercomments)
    {
        if(err)
        {
            throw err;
        }
        else
        {
          console.log(JSON.stringify(usercomments));
          return res.json(usercomments);            
        }
    });
}

// get comment function
function getComment(req, res)
{
    var productid = req.query.productid
    if(productid)
    {
        var query = {product: productid}
        findComment(res, query);
    }
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an productid for get comment"});
    }
}

// post category function
function postCategory(req, res)
{
    console.log("Create Category");
    var request = new Models.Category({
        name: req.body.name,
        parent_category: req.body.parent_category
    });
    request.save(function (err) {
        if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to create a category");
        }
        else
        {
            findCategoryWithDoesntExistPossibility(res, {name:req.body.name});
        }

    });
}

//helper function for finding a user with the possibility 
//such that the user may not exists
function findCategoryWithDoesntExistPossibility(res, query)
{
    Models.Category.find(query, function(err, categories) {
        if (err)
        {
            throw err;
        }
        else if (!categories.length)
        {
            console.log("Can't find the category");
            res.statusCode = 404;
            return res.send("Failed to find the category");
        }
        else
        {
          console.log(JSON.stringify(categories[0]));
          return res.json(categories[0]);
        }
    });
}

//function for find a product
function findProduct(res, query)
{
    Models.Product.find(query, function(err, products) {
        if (err)
        {
            throw err;
        }
        else if (!products.length)
        {
            console.log("Can't find the products");
            res.statusCode = 404;
            return res.send("Failed to find the products matching: " + query);
        }
        else
        {
            console.log(JSON.stringify(products));
            return res.json(products);
        }
    });
}

// function for change password
function changeUserPassword(res, query, newpass)
{
    Models.User.update(query, { $set: { password : newpass }}, function(err, result) {
        if (err)
        {
            throw err;
        }
        else if (result.n === 0)
        {
            console.log("Can't find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
            console.log(JSON.stringify(result));
     	    res.json("Password changed successfully");
        }
    });
}

// update product
function changeProductStats(res, query, newstats)
{
    Models.Product.update(query, { $set: newstats}, function(err, result) {
        if (err)
        {
            throw err;
        }
        else if (result.n === 0)
        {
            console.log("Can't find the product");
            res.statusCode = 404;
            return res.send("Failed to find the product");
        }
        else
        {
            console.log(JSON.stringify(result));
            res.statusCode = 200;
            findProduct(res, query);
        }
    });
}

// get product
function searchProduct(req, res) {
    
        console.log("Searching for products matching: " + JSON.stringify(req.body));
        findProduct(res, req.body);
}

// update a current existing product
function updateProduct(req,res) {
    var pid = req.params.pid;
    console.log("Updating product: " + pid);

    if(pid)
    {
        var query = {_id : pid}
        Models.Product.update(query, req.body, function(err, result){
            if (err) {throw err;}
            else if (!result) {
                console.log("Can't find product");
                res.statusCode=404;
                return res.send("Failed to find product");
            } else {
                console.log(JSON.stringify(result));
                return res.json("Product updated successfully");
            }
        });
    } 
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an product id"});
    }
}

// delete product function
function delProd(req,res) {
    var pid = req.params.pid;
    console.log("Delete product: "+ pid);

    Models.Product.deleteOne({_id: pid}, function(err, result) {

        if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to delete a product");
        }
        else
        {
            return res.send("Delete successfully");
        }
    });
}



function showProduct(req,res) {
    var query = { _id : req.params.pid };

    console.log("Finding and display product with query: " + JSON.stringify(query));

    Models.Product.findOne(query, (err, productresult) => {
        if (err || !productresult) {
            console.log(err);
            statusCode = 404;
            return res.redirect('/404.html');
        } else 
        {
            console.log(JSON.stringify(productresult));

            query = { _id : productresult.ownerid };
            Models.User.findOne(query, 'firstname lastname email', (err, userresult) => {
                if (err || !userresult) {
                    console.log(err);
                    statusCode = 404;
                    return res.redirect('/404.html');
                } else {
                    console.log(JSON.stringify(userresult));
                    return res.render('product_info', {product : productresult, user: userresult})
                }
            })

        }
    });
}

function showUser(req, res)
{
    console.log('Show user');
    var query = {};
    var uid;
    if (req.params.uid)
    {

        uid = req.params.uid
    }
    else
    {
        uid = req.session.uid
    }
    query._id = uid;
    Models.User.find(query, function(err, users) {
        if (err)
        {
            throw err;
        }
        else if (!users.length)
        {
            console.log("Can't find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
            var result = {};
            var user_info = {};
            user_info.email = users[0].email;
            var fullname = users[0].firstname + users[0].lastname;
            user_info.fullname = fullname;
            result.user = user_info;

            // Next Step: Search the users items
            Models.Product.find({ownerid : uid }, function(err, products) {
                if (err)
                {
                    throw err;
                }
                else
                {
                    result.products = products;
                    // Next Step: Show comments
                    Models.UserComment.find({userid: uid}, function(err, usercomments)
                    {
                        if(err)
                        {
                            throw err;
                        }
                        else
                        {
                            result.comments = usercomments;
                            console.log(JSON.stringify(result));
                            return res.render('user_info_page', result)    
                        }
                    });
                }
            });   
        }
    });    
}

// Endpoint setup
app.post('/user', postUser);
app.get('/user', getUser);
app.get('/login', (req,res) => {
    if(req.session.uid){
    //   var fullname = req.session.fullname;
    //   res.render('user_info_page', {user : fullname});
        showUser(req,res);
    }
    else{
    res.redirect('/login.html');
    }
})
app.post('/login', login);
app.get('/user/:uid', showUser);

app.put('/user', changePass);

app.get('/logout', logout);

app.post('/user/products', postProduct);
app.put('/user/products', changeProduct);
app.get('/user/products/all', getProduct);
app.delete('/user/products', deleteProduct);

// Product comments
app.post('/comment', postComment);
app.get('/comment', getComment);

app.post('/category', postCategory);

app.post('/products', searchProduct);
app.put('/products/:pid', updateProduct);
app.delete('/products/:pid', delProd);
app.get('/products/:pid', showProduct);

// User comments
app.post('/usercomments', postUserComments);

app.get('/', (req,res) => {
    res.redirect('/search_result_page.html');
})


/*TODO
app.get(/products/:pid)/
app.delete(/login)
app.get(/)
product info


*/
app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
