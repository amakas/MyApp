import express from 'express';
import User from '../models/user.js';

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id, '-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, username, bio, email, location, phoneNumber, profession } = req.body;
    try {
        const updateFields = {
      firstname,
      lastname,
      username,
      bio,
      email,
      location,
      phoneNumber,
      profession
    };

    if (req.file) {
      updateFields.profilePicture = `/uploads/${req.file.filename}`; 
    }

    const user = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true
    });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const  deleteUser = async (req,res) => {
    const {id} = req.params;

    try{
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        await User.findByIdAndDelete(id)
        res.status(200).json({message:"Account deleted", success:true})
    } catch(error){
        console.error('Error deleting user')
        res.status(500).json({message: 'Internal server error'})
    }
}