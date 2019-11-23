const mongoose = require('mongoose');
const { omit } = require('lodash');

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
    transform: (doc, ret, options) => {
      const result = omit(ret, options.hidden);
      result.id = ret._id;
      return result;
    },
  },
});


const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
