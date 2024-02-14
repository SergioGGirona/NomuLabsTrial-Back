import { Schema, model } from 'mongoose';
import { Comment } from './comments';

const commentSchema = new Schema<Comment>({
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: Date,
  likes: [{ type: String }],
});

commentSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const CommentModel = model('Comment', commentSchema, 'comments');
