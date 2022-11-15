
const { Schema, model }  = require('mongoose');

const contacts = new Schema({
    name: {
      type: String,
      required: [true, 'please enter the name for contact'],
    },
    email: {
      type: String,
      required: [true, 'please enter the email for contact'],

    },
    phone: {
      type: String,
      required: [true, 'please enter the phone number for contact'],

    },
    favorite: {
      type: Boolean,
      default: false,
  },
  owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  });

const Contacts = model("contacts", contacts);
module.exports = Contacts;
