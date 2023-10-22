require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

const mongodbUrl = url;

mongoose.connect(mongodbUrl);

// const userSchema = new Schema({
//   phone: {
//     type: String,
//     validate: {
//       validator: function (v) {
//         return /\d{3}-\d{3}-\d{4}/.test(v);
//       },
//       message: (props) => `${props.value} is not a valid phone number!`,
//     },
//     required: [true, "User phone number required"],
//   },
// });

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (numStr) {
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,})$/.test(numStr);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required"],
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
