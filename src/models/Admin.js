const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'moderator'],
      default: 'moderator',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

adminSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
  },
});

exports.Admin = mongoose.model('Admin', adminSchema);
