import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mainImage:{
    type:{
        url: String,
        localPath: String
    }
  },
  subImages: {
    type: [
      {
        url: String,
        localPath: String,
      },
    ],
    default: [],
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    trim: true
  },
  lastdateforregistration: {
    type: Date, // input formate should be like 2021-09-30
    required: true,
    trim: true
  },
  registerdStudents: {
    type: Number,
    trim: true
  },
  maxStudents: {
    type: Number,
    required: true,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isCloseRegistration: {
    type: Boolean,
    default: false
  },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
  timestamps: true
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
