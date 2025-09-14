// MongoDB initialization script
db = db.getSiblingDB('interview-drills');

// Create collections
db.createCollection('users');
db.createCollection('drills');
db.createCollection('attempts');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.attempts.createIndex({ userId: 1, createdAt: -1 });
db.drills.createIndex({ tags: 1 });
db.drills.createIndex({ difficulty: 1 });

// Insert sample drills
db.drills.insertMany([
  {
    title: "JavaScript Fundamentals",
    difficulty: "easy",
    tags: ["javascript", "basics", "frontend"],
    questions: [
      {
        id: "js1",
        prompt: "What is the difference between let, const, and var in JavaScript?",
        keywords: ["scope", "hoisting", "reassignment", "redeclaration"]
      },
      {
        id: "js2",
        prompt: "Explain the concept of closures in JavaScript.",
        keywords: ["closure", "function", "scope", "lexical"]
      },
      {
        id: "js3",
        prompt: "What is the 'this' keyword in JavaScript and how does it work?",
        keywords: ["this", "context", "binding", "arrow"]
      },
      {
        id: "js4",
        prompt: "Explain the difference between == and === in JavaScript.",
        keywords: ["equality", "strict", "type", "coercion"]
      },
      {
        id: "js5",
        prompt: "What are Promises in JavaScript and how do they work?",
        keywords: ["promise", "async", "await", "then", "catch"]
      }
    ]
  },
  {
    title: "React Hooks",
    difficulty: "medium",
    tags: ["react", "hooks", "frontend"],
    questions: [
      {
        id: "react1",
        prompt: "Explain the useState hook and how it works.",
        keywords: ["state", "hook", "component", "render"]
      },
      {
        id: "react2",
        prompt: "What is the useEffect hook and when would you use it?",
        keywords: ["effect", "side", "dependency", "cleanup"]
      },
      {
        id: "react3",
        prompt: "Explain the difference between useState and useReducer.",
        keywords: ["reducer", "state", "action", "dispatch"]
      },
      {
        id: "react4",
        prompt: "What are custom hooks and how do you create them?",
        keywords: ["custom", "hook", "reuse", "logic"]
      },
      {
        id: "react5",
        prompt: "Explain the useContext hook and its use cases.",
        keywords: ["context", "provider", "consumer", "global"]
      }
    ]
  },
  {
    title: "Node.js and Express",
    difficulty: "medium",
    tags: ["nodejs", "express", "backend"],
    questions: [
      {
        id: "node1",
        prompt: "What is the event loop in Node.js?",
        keywords: ["event", "loop", "asynchronous", "non-blocking"]
      },
      {
        id: "node2",
        prompt: "Explain the difference between process.nextTick() and setImmediate().",
        keywords: ["nexttick", "setimmediate", "phases", "queue"]
      },
      {
        id: "node3",
        prompt: "What are middleware functions in Express?",
        keywords: ["middleware", "request", "response", "next"]
      },
      {
        id: "node4",
        prompt: "How does Express handle routing?",
        keywords: ["routing", "route", "method", "parameter"]
      },
      {
        id: "node5",
        prompt: "Explain the concept of streams in Node.js.",
        keywords: ["stream", "pipe", "chunk", "flow"]
      }
    ]
  },
  {
    title: "Database Design",
    difficulty: "hard",
    tags: ["database", "mongodb", "schema"],
    questions: [
      {
        id: "db1",
        prompt: "Explain the difference between SQL and NoSQL databases.",
        keywords: ["sql", "nosql", "relational", "document"]
      },
      {
        id: "db2",
        prompt: "What are MongoDB indexes and how do they improve performance?",
        keywords: ["index", "performance", "query", "optimization"]
      },
      {
        id: "db3",
        prompt: "Explain the concept of database normalization.",
        keywords: ["normalization", "schema", "redundancy", "anomaly"]
      },
      {
        id: "db4",
        prompt: "What is database sharding and when would you use it?",
        keywords: ["sharding", "scaling", "partition", "distributed"]
      },
      {
        id: "db5",
        prompt: "Explain the ACID properties in database systems.",
        keywords: ["acid", "atomicity", "consistency", "isolation", "durability"]
      }
    ]
  },
  {
    title: "System Design",
    difficulty: "hard",
    tags: ["architecture", "scalability", "design"],
    questions: [
      {
        id: "sys1",
        prompt: "Explain the difference between horizontal and vertical scaling.",
        keywords: ["scaling", "horizontal", "vertical", "performance"]
      },
      {
        id: "sys2",
        prompt: "What is a load balancer and how does it work?",
        keywords: ["load", "balancer", "distribution", "traffic"]
      },
      {
        id: "sys3",
        prompt: "Explain the concept of caching in web applications.",
        keywords: ["cache", "performance", "redis", "memory"]
      },
      {
        id: "sys4",
        prompt: "What are microservices and what are their advantages?",
        keywords: ["microservices", "architecture", "independent", "deployment"]
      },
      {
        id: "sys5",
        prompt: "Explain the CAP theorem and its implications.",
        keywords: ["cap", "consistency", "availability", "partition"]
      }
    ]
  }
]);

print("Database initialized with sample data");