import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: [true, "Username is required"],
    trim: true,
    minLength: 2,
    maxLength: 50

  }, 
    email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true, 
  lowercase: true
  , 
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);},
      message: props => `${props.value} is not a valid email address!`
    }
  }
  ,
    password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 6,
  },
}, { timestamps: true });   

const User = mongoose.model("User", userSchema);

export default User;
