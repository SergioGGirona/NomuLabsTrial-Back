import { Schema, model } from 'mongoose';
import { Post } from './posts';

const postSchema = new Schema<Post>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  ingredients: [String],
  referenceUrl: String,
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
