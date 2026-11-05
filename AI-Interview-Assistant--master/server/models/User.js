import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'Full Stack Engineer',
    },
    targetRole: {
      type: String,
      default: 'Senior Frontend Developer',
    },
    experience: {
      type: String,
      default: '3-5 years',
    },
    bio: {
      type: String,
      default: 'Software engineer passionate about building great products and preparing for technical interviews.',
    },
    avatar: {
      type: String,
      default: '',
    },
    stats: {
      interviewsCompleted: { type: Number, default: 0 },
      questionsAnswered: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      streakDays: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
