const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Test Must Have a Title'] 
    },
    description: String,
    questions: [
        {
            questionText: { 
                type: String, 
                required: [true, 'Enter the question']  
            },
            options: [{  // e.g., ["A", "B", "C", "D"]
                type: String, 
                required: [true, 'Enter the options'] 
            }], 
            correctAnswer: {  // index of correct option
                type: Number, 
                required: [true, 'Enter the correct answer'] 
            } 
        }
    ],
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    examDuration:{
        type: Number,
        default: 120 // 2 hours
    }
});

testSchema.pre('save', function(next) {
    if (this.endTime <= this.startTime) {
        return next(new Error('End time must be after start time'));
    }
    next();
});

testSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Attempt').deleteMany({ test: this._id });
  next();
});

module.exports = mongoose.model('Test', testSchema);