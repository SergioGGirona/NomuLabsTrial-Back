import { Schema, model } from 'mongoose';
import { Post } from './posts';

const postSchema = new Schema<Post>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  overview: { type: String },
  createdAt: { type: Date, required: true },
  likes: [{ type: String }],
  ingredients: [String],
  referenceUrl: String,
  aproxTime: Number,
  steps: {
    arrange: String,
    boarding: String,
    complete: String,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

postSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const PostModel = model('Post', postSchema, 'posts');
