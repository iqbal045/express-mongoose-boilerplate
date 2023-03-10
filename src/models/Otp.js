const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    expire_at: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

otpSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
  },
});

exports.Otp = mongoose.model('Otp', otpSchema);
