import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  prompt: string;
  keywords: string[];
}

export interface IDrill extends Document {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  prompt: { type: String, required: true },
  keywords: [{ type: String, required: true }]
});

const drillSchema = new Schema<IDrill>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  tags: {
    type: [String],
    required: true,
    default: []
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(questions: IQuestion[]) {
        return questions.length === 5;
      },
      message: 'Each drill must have exactly 5 questions'
    }
  }
}, {
  timestamps: true
});

// Create indexes
drillSchema.index({ tags: 1 });
drillSchema.index({ difficulty: 1 });

const Drill = mongoose.models.Drill || mongoose.model<IDrill>('Drill', drillSchema);

export default Drill;