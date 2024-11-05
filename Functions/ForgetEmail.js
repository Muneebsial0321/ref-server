const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
// const User = require("../models/User"); // adjust path as needed

// Configure Nodemailer
// EMAIL=muneebS0321@outlook.com
// PASS=Muneeb@0321

var transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp-mail.outlook.com", // Use this host for Hotmail/Outlook
  port: 587, // Use port 587 for TLS
  secure: false, // Set to true for port 465, but use false for 587
  auth: {
      user: "mcorvit100@gmail.com",
      pass:  "Corvit@786"
  },  // Increase the connection and sending timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  secureConnection: false, // Use TLS
});
console.log({data:process.env.EMAIL})

// Send OTP route
// exports.forgotPassword = async (req, res) => {
const forgotPassword = async () => {
  const email  = 'muneeburrehmansial032168@gmail.com'
  // const { email } = req.body;
  
  try {
    // Check if the user exists
    // const user = await User.findOne({ email });
    // if (!user) return res.status(404).json({ message: "User not found" });
    
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log({otp})
    
    // Hash the OTP and store it temporarily
    // user.resetPasswordOTP = bcrypt.hashSync(otp, 10);
    // user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    // await user.save();
    
    // Send OTP via email
    const mailOptions = {
      from: "mcorvit100@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };
    
    // await transporter.sendMail(mailOptions);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error occurred:", error);
  }
  console.log("Email sent:", info.response);
});
    // res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log({error})
    // res.status(500).json({ message: "Server error" });
  }
};

forgotPassword()