import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  qid: string;
  text: string;
}

export interface IAttempt extends Document {
  _id: string;
  userId: string;
  drillId: string;
  answers: IAnswer[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  qid: { type: String, required: true },
  text: { type: String, required: true }
});

const attemptSchema = new Schema<IAttempt>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  drillId: {
    type: String,
    required: true,
    ref: 'Drill'
  },
  answers: {
    type: [answerSchema],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Create indexes
attemptSchema.index({ userId: 1, createdAt: -1 });

const Attempt = mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', attemptSchema);

export default Attempt;