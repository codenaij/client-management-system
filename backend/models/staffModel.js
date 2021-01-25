const mongoose = require('mongoose');
const validator = require('validator');

const staffSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Auth',
    required: true
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  maritalStatus: {
    type: String,
    required: [true, 'Marital Status is required'],
    enum: {
      values: ['single', 'married', 'divorced', 'other'],
      message: 'Marital Status can only be Single, Married, Divorced or Other'
    }
  },
  gender: {
    type: String,
    required: [true, 'Gender is required']
  },
  phone: {
    type: Number,
    required: [true, 'Phone number is required']
  },
  dob: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  addressGroup: {
    address: {
      type: String,
      required: [true, 'Please provide the address'],
      trim: true,
      maxlength: [60, 'The address should not be more than 60 characters']
    },
    nearestBusStop: {
      type: String,
      required: [true, 'Please provide your nearest Bus Stop'],
      trim: true,
      maxlength: [20, 'The address should not be more than 20 characters']
    },
    city: {
      type: String,
      required: [true, 'Please provide your city'],
      trim: true,
      maxlength: [20, 'The address should not be more than 20 characters']
    },
    stateOfResidence: {
      type: String,
      required: [true, 'Please provide your State of Residence'],
      trim: true,
      maxlength: [20, 'The address should not be more than 20 characters']
    },
    nationality: {
      type: String,
      required: [true, 'Please provide your country of origin'],
      trim: true,
      maxlength: [20, 'The address should not be more than 20 characters']
    },
    stateOfOrigin: {
      type: String,
      // required: [true, 'Please provide your State of Origin'],
      trim: true,
      maxlength: [20, 'The address should not be more than 20 characters']
    },
    localGovtArea: {
      type: String,
      // required: [true, 'Please state your Local Govement'],
      trim: true,
      maxlength: [20, 'The address should not be more than 20 characters']
    }
  },
  nextOfKin: {
    name: {
      type: String,
      required: [true, 'Please give full name of Next of Kin'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide the address'],
      trim: true,
      maxlength: [60, 'The address should not be more than 60 characters']
    },
    phone: {
      type: Number,
      required: [true, 'Phone number is required']
    }
  },
  staffIDNumber: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  salary: {
    type: Number
  },
  resumptionDate: {
    type: Date
  },
  qualification: [String],
  discipline: {
    type: String
    // required: true
  },
  certificatesUpload: [String]
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
