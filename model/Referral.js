const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  // referal token by uuid
  referral: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserModal', 
    required: true 
  }
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
