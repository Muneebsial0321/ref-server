const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UserModal = require("../model/User");
const Point = require('../model/Point')
const Referral = require('../model/Referral');


const JWT_SECRET = "12@345%6789";

// Create New User 
const handleNewUser = async (req, res) => {
    console.log("siging in")
    // console.log({findUser:req.body})
    try {
        const approved = "false";
        const blocked = "false";
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const User = await UserModal.create({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hashedPassword,
            referral: req.body.referral,
            isApproved: approved,
            isBlocked: blocked
        })

        if (req.body.referral!=null) {
            console.log(req.body.referral)
            const findUser = await Referral.findOne(
                { referral: req.body.referral }  // Search criteria
            );
            // 0cd40be7-3e76-47b8-93c2-fdb0f7c9bf13
            const updatePoints = await Point.findOneAndUpdate(
                { userId: findUser.userId },  
                { $inc: { point: 85 } },  
                { new: true }  
            )
            console.log({ findUser, updatePoints })

        }
        const newPoint = await Point.create({
            userId: User._id,
            point: 100
        });
        res.status(201).json({ User })
    }
    catch (error) {
        console.log(error)
        res.send({ status: "User Already Created" })
    }

};

// Get All Approved Users
const handleGetApprovedUsers = async (req, res) => {
    try {
        // Find all users where isApproved is "true"
        const approvedUsers = await UserModal.find({ isApproved: "true" });

        res.status(200).json(approvedUsers);
    } catch (error) {
        console.log('Error fetching approved users:', error);
        res.status(500).json({ error: 'Failed to retrieve approved users' });
    }
};


// Login User 
const handleLogin = async (req, res) => {
    console.log(req.body);
    try {
        const User = await UserModal.findOne({ email: req.body.email });
        // console.log({User})

        if (!User) {
            return res.status(404).json({ status: 'error', msg: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, User.password);

        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', msg: "Invalid credentials" });
        }

        const userPoints = await Point.findOne({ userId: User._id });
        

        if (!userPoints) {
            return res.status(404).json({ status: 'error', msg: "Points not found for this user" });
        }

        const userReferral = await Referral.findOne({ userId: User._id });
        console.log({userReferral})
        // if (!userReferral) {
        //     return res.status(404).json({ status: 'error', msg: "Points not found for this user" });
        // }

        const token = jwt.sign(
            {
                userId: User._id,
                email: User.email,
            },
            JWT_SECRET // No expiration set here
        );

        res.status(200).json({
            token, // Send the token to the client
            status: "Ok",
            msg: "User Login Successfully",
            User,
            points: userPoints || 0,
            referral: userReferral || null
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error", error });
    }
};

// Update Specific User Point 
const handleUpdatePoint = async (req, res) => {
    console.log("updating points")
    const { id } = req.params; // Extract userId from route params
    const { point } = req.body; // Extract the new point value from request body

    try {
        const existingPoint = await Point.findOne({ userId: id });
        if (!existingPoint) {
            return res.status(404).json({ status: 'error', msg: "User points not found" });
        }
        const updatedPoints = existingPoint.point + +point;
        existingPoint.point = updatedPoints;
        await existingPoint.save(); // Save the updated document
        res.status(200).json({
            status: "Ok",
            msg: "Points updated successfully",
            points: existingPoint
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Update User By Id
const handleUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await UserModal.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    // email: req.body.email,
                    password: req.body.password
                }
            },
            { new: true } // To return the updated document
        );

        if (updatedUser) {
            res.status(200).json({ updatedUser, message: "User updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating user" });
    }
}

// Get All User 
const handleAllUser = async (req, res) => {
    try {
        const user = await UserModal.find()
        res.status(200).json(user)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "User Fetching Error" })
    }
}

// Get User By ID
const handleUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("User ID received:", userId);

        const user = await UserModal.findById(userId);
        const userPoint = await Point.findOne({ userId: userId });
        const userReferral = await Referral.findOne({ userId: userId });

        if (user) {
            res.status(200).json({ user, point: userPoint, referral: userReferral });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Block User By Id 
const handleBlockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Update user's `isBlocked` status to true
        const user = await UserModal.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }  // Returns the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User blocked successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error blocking user" });
    }
};

// UnBlock User By Id 
const handleUnBlockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Update user's `isBlocked` status to false
        const user = await UserModal.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }  // Returns the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User unblocked successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error unblocking user" });
    }
};

const getAllReferals = async (req, res) => {
    try {
        const refs = await Referral.find({});
        res.status(200).json({ refs });
    }
    catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
 
const getMyReferals = async(req,res) =>{
    console.log(req.params.id)  
    const ref = await Referral.findOne({userId:req.params.id})
    console.log({ref})
    if(ref){
        const users = await UserModal.find({referral:ref.referral})
        const filteredData = users.filter((e)=>e!=null)
        return   res.json({count:filteredData.length,data:filteredData})
    }
    res.json({count:0,data:[]})
}

const getAllBlockedUsers = async (req,res)=>{
    const data = await UserModal.find({isBlocked:"true"})
}



module.exports = {
    handleNewUser,
    handleLogin,
    handleUpdateUser,
    handleAllUser,
    handleUserById,
    handleUpdatePoint,
    handleGetApprovedUsers,
    handleBlockUser,
    handleUnBlockUser,
    getAllReferals,
    getMyReferals 
} 