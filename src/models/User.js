const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

userSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model('User', userSchema);
