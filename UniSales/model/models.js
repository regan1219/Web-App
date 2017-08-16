var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect('mongodb://localhost/unisaleServer');
autoIncrement.initialize(connection);
// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    _id: Number,
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstname: {
      type: String,
      default: ""
    },
    lastname: {
      type: String, 
      default: ""
    },
    password: {
      type: String,
      required: true
    },
    __v: { 
        type: Number, 
        select: false
    }
  },
  {
      _id: false
  },
  {
    collection: 'user'
  }
);

var CommentSchema = new Schema (
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    product: {
      type: Number,
      required: true
    },
    __v: { 
        type: Number, 
        select: false
    }
  }
);

var UserCommentSchema = new Schema (
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    userid: {
      type: Number,
      required: true
    },
    __v: { 
        type: Number, 
        select: false
    }
  },
  {
    collection: 'usercomments'
  }
);


var CategorySchema = new Schema (
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    parent_category: {
      type: String
    }
  }
);

var ProductSchema = new Schema(
  {
    _id: Number,
   
    productname: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true
    },
    category: {
      type:String,
      required: true  
    },
     ownerid: { 
        type: Number, 
        required: true
    },
    description: {
      type: String,
      requires: true    
    },
     __v: { 
        type: Number, 
        select: false
    }
  },
  {
      _id: true
  },
  {
    collection: 'product'
  }
);


UserSchema.plugin(autoIncrement.plugin, 'User');
ProductSchema.plugin(autoIncrement.plugin, 'Product');
// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = {
  User: mongoose.model('users', UserSchema),
  Comment: mongoose.model('comments', CommentSchema),
  Category: mongoose.model('categories', CategorySchema),
  Product: mongoose.model('products', ProductSchema),
  UserComment: mongoose.model('usercomments', UserCommentSchema)};
