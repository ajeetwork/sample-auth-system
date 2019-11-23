const mongoose = require('mongoose');
const { transformMongooseToJSON } = require('./../helpers/transformMongooseToJSON');

const { Schema } = mongoose;

const statusSchema = new Schema({
  text: {
    type: String,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    hidden: ['__v', '_id'],
    transform: transformMongooseToJSON,
  },
});


const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
