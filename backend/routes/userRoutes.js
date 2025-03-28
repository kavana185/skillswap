const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure the path to your model is correct
const mongoose = require('mongoose'); 

// ✅ GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

// ✅ GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err });
    }
});

// 🚀 ✅ **POST - Create a New User**
router.post('/', async (req, res) => {
    try {
        const { name, email, password, skillsOffered, skillsWanted } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, Email, and Password are required!' });
        }
        const newUser = new User({ name, email, password, skillsOffered, skillsWanted });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
});

// Update user skills
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, 
            { new: true } // Returns updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
});


module.exports = router;
