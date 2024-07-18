
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const user = require('../models/user');
const fs=require('fs');
const { type } = require('os');
const { log } = require('console');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage }).single("image");

// POST route to add a new user
router.post("/add", upload, async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename
    });

    await newUser.save();

    req.session.message = {
      type: 'success',
      message: 'User added successfully'
    };

    return res.redirect('/');
  } catch (err) {
    console.error('Error adding user:', err);
    req.session.message = {
      type: 'error',
      message: 'Failed to add user'
    };
    return res.redirect('/');
  }
});

// GET route to fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render('index', {
      title: 'Home Page',
      users: users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.json({ message: err.message });
  }
});

// GET route to render the add_user form
router.get("/add", (req, res) => {
  res.render('add_user', { title: "Add User" });
});

//edit an user router
router.get('/edit/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      req.session.message = {
        type: 'error',
        message: 'User not found'
      };
      return res.redirect('/');
    }
    res.render('edit_users', {
      title: "Edit User",
      user: user
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    req.session.message = {
      type: 'error',
      message: 'Failed to fetch user'
    };
    return res.redirect('/');
  }
});

//update user routes
router.post('/update/:id', upload, async (req, res) => {
  let id = req.params.id;
  let new_image = '';

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/' + req.body['old-image']);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body['old-image'];
  }

  try {
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: 'success',
      message: 'User updated successfully'
    };
    res.redirect('/');
  } catch (err) {
    console.error('Error updating user:', err);
    req.session.message = {
      type: 'error',
      message: 'Failed to update user'
    };
    res.redirect('/');
  }
});

//delete user roouter
router.get('/delete/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id).exec();
    if (user.image !== '') {
      try {
        fs.unlinkSync('./uploads/' + user.image);
      } catch (err) {
        console.log(err);
      }
    }
    req.session.message = {
      type: 'success',
      message: 'User deleted successfully'
    };
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting user:', err);
    req.session.message = {
      type: 'error',
      message: 'Failed to delete user'
    };
    res.redirect('/');
  }
});

module.exports = router;
