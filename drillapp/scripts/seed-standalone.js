const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-drills';

// Drill Schema
const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  prompt: { type: String, required: true },
  keywords: [{ type: String, required: true }]
});

const drillSchema = new mongoose.Schema({
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
      validator: function(questions) {
        return questions.length === 5;
      },
      message: 'Each drill must have exactly 5 questions'
    }
  }
}, {
  timestamps: true
});

// Sample drill data
const sampleDrills = [
  {
    title: "JavaScript Fundamentals",
    difficulty: "easy",
    tags: ["javascript", "basics", "programming"],
    questions: [
      {
        id: "q1",
        prompt: "What is the difference between let, const, and var in JavaScript?",
        keywords: ["scope", "hoisting", "reassignment", "declaration", "block"]
      },
      {
        id: "q2", 
        prompt: "Explain what a closure is in JavaScript.",
        keywords: ["function", "scope", "lexical", "enclosure", "variable"]
      },
      {
        id: "q3",
        prompt: "What is the purpose of the 'this' keyword in JavaScript?",
        keywords: ["context", "object", "function", "method", "binding"]
      },
      {
        id: "q4",
        prompt: "Describe the event loop in JavaScript.",
        keywords: ["asynchronous", "callback", "queue", "stack", "non-blocking"]
      },
      {
        id: "q5",
        prompt: "What are promises and how do they work?",
        keywords: ["asynchronous", "resolve", "reject", "then", "catch", "async", "await"]
      }
    ]
  },
  {
    title: "React Component Lifecycle",
    difficulty: "medium",
    tags: ["react", "components", "lifecycle"],
    questions: [
      {
        id: "q1",
        prompt: "Explain the difference between functional and class components in React.",
        keywords: ["function", "class", "state", "props", "hooks", "lifecycle"]
      },
      {
        id: "q2",
        prompt: "What is the Virtual DOM and how does it work?",
        keywords: ["virtual", "dom", "diff", "reconciliation", "rendering", "performance"]
      },
      {
        id: "q3",
        prompt: "Describe the React component lifecycle methods.",
        keywords: ["mount", "update", "unmount", "componentdidmount", "componentdidupdate", "componentwillunmount"]
      },
      {
        id: "q4",
        prompt: "What are React Hooks and why were they introduced?",
        keywords: ["hooks", "state", "effect", "context", "reducer", "functional"]
      },
      {
        id: "q5",
        prompt: "Explain the difference between useState and useEffect hooks.",
        keywords: ["state", "effect", "render", "side", "dependency", "cleanup"]
      }
    ]
  },
  {
    title: "Node.js and Express",
    difficulty: "medium",
    tags: ["nodejs", "express", "backend"],
    questions: [
      {
        id: "q1",
        prompt: "What is Node.js and what are its main features?",
        keywords: ["runtime", "javascript", "server", "asynchronous", "event", "non-blocking"]
      },
      {
        id: "q2",
        prompt: "Explain the Event-Driven Architecture in Node.js.",
        keywords: ["event", "loop", "emitter", "listener", "callback", "asynchronous"]
      },
      {
        id: "q3",
        prompt: "What is Express.js and why is it used?",
        keywords: ["framework", "middleware", "routing", "web", "application", "server"]
      },
      {
        id: "q4",
        prompt: "Describe middleware in Express.js.",
        keywords: ["middleware", "request", "response", "next", "chain", "function"]
      },
      {
        id: "q5",
        prompt: "What is the difference between app.use() and app.get() in Express?",
        keywords: ["use", "get", "middleware", "route", "http", "method"]
      }
    ]
  },
  {
    title: "Database Design and SQL",
    difficulty: "hard",
    tags: ["database", "sql", "design"],
    questions: [
      {
        id: "q1",
        prompt: "Explain the differences between SQL and NoSQL databases.",
        keywords: ["relational", "document", "schema", "scalability", "acid", "base"]
      },
      {
        id: "q2",
        prompt: "What are database normalization and its forms?",
        keywords: ["normalization", "1nf", "2nf", "3nf", "redundancy", "anomaly"]
      },
      {
        id: "q3",
        prompt: "Describe the different types of SQL joins.",
        keywords: ["join", "inner", "left", "right", "full", "outer", "cross"]
      },
      {
        id: "q4",
        prompt: "What are database indexes and how do they work?",
        keywords: ["index", "performance", "query", "b-tree", "lookup", "optimization"]
      },
      {
        id: "q5",
        prompt: "Explain ACID properties in database transactions.",
        keywords: ["atomicity", "consistency", "isolation", "durability", "transaction", "rollback"]
      }
    ]
  },
  {
    title: "System Design Fundamentals",
    difficulty: "hard",
    tags: ["architecture", "scalability", "design"],
    questions: [
      {
        id: "q1",
        prompt: "What is the difference between horizontal and vertical scaling?",
        keywords: ["scaling", "horizontal", "vertical", "load", "performance", "capacity"]
      },
      {
        id: "q2",
        prompt: "Explain the concept of load balancing.",
        keywords: ["load", "balancer", "distribution", "traffic", "server", "algorithm"]
      },
      {
        id: "q3",
        prompt: "What is caching and why is it important?",
        keywords: ["cache", "memory", "performance", "latency", "hit", "miss"]
      },
      {
        id: "q4",
        prompt: "Describe the concept of microservices architecture.",
        keywords: ["microservices", "monolithic", "service", "independent", "deployment", "communication"]
      },
      {
        id: "q5",
        prompt: "What is a Content Delivery Network (CDN)?",
        keywords: ["cdn", "content", "delivery", "edge", "cache", "global", "latency"]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create Drill model
    const Drill = mongoose.model('Drill', drillSchema);

    // Clear existing drills
    console.log('Clearing existing drills...');
    await Drill.deleteMany({});
    console.log('✅ Cleared existing drills');

    // Insert sample drills
    console.log('Inserting sample drills...');
    const insertedDrills = await Drill.insertMany(sampleDrills);
    console.log(`✅ Successfully inserted ${insertedDrills.length} drills`);

    // Log inserted drills
    console.log('\n📋 Inserted Drills:');
    insertedDrills.forEach((drill, index) => {
      console.log(`${index + 1}. ${drill.title} (${drill.difficulty}) - ${drill.tags.join(', ')}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();