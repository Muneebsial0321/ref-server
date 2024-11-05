const nodemailer = require('nodejs-nodemailer-outlook');
console.log("sending email")

nodemailer.sendEmail({
  auth: {
    user: '', // Your Hotmail email address
    pass: '' // Your Hotmail password or app-specific password
  },
  from: '',
  to: 'muneeburrehmansial032168@gmail.com',
  subject: 'Password Reset OTP',
//   text: 'Your OTP for password reset is 123456.',
  // If you want to send HTML content, you can use the 'html' property instead
  html: '<p>Your OTP for password reset is <strong>123456</strong>.</p>',
  debug: true, // Enable debug output
  // Optional: add attachments
  // attachments: [
  //   { filename: 'file.txt', path: '/path/to/file.txt' }
  // ],
}, (err, info) => {
  if (err) {
    return console.log('Error occurred:', err);
  }
  console.log('Email sent:', info);
});
console.log("funcation added")
