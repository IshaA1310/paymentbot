import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true, index: true, match: /^[0-9]{10,15}$/ },
    freeCredits: { type: Number, default: 100 },
    paidCredits: { type: Number, default: 0 },
    usedCredits: { type: Number, default: 0 }
  },{ timestamps: true }
);

//---------- VIRTUAL FIELD ---------- 
userSchema.virtual("availableCredits").get(function () {
  return this.freeCredits + this.paidCredits - this.usedCredits;
});

// Deduct 1 credit per chat
userSchema.methods.consumeCredit = function () {
  if (this.availableCredits <= 0) {
    throw new Error("No credits available");
  }
  this.usedCredits += 1;
};

// Add paid credits after payment
userSchema.methods.addPaidCredits = function (credits) {
  this.paidCredits += credits;
  console.log(this.paidCredits, "this.paidCredits")
};

// Static helper
userSchema.statics.findOrCreateByPhone = async function (phoneNumber) {
  let user = await this.findOne({ phoneNumber });
  if (!user) { 
    user = await this.create({ phoneNumber });
  }
  return user;
};

const User = mongoose.model("User", userSchema, "User");
export default User;
