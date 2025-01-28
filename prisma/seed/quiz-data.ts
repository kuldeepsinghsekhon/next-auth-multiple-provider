export const SAMPLE_QUIZZES = [
    {
      title: "JavaScript Basics Quiz",
      lessonId: "javascript-intro",
      questions: [
        {
          text: "What is JavaScript?",
          type: "multiple-choice",
          options: JSON.stringify([
            "A programming language",
            "A markup language",
            "A styling language",
            "A database"
          ]),
          answer: "0",
          order: 1,
          points: 2
        },
        {
          text: "Which keyword is used to declare variables in JavaScript?",
          type: "multiple-choice",
          options: JSON.stringify([
            "var, let, const",
            "variable, const",
            "dim, set",
            "declare, var"
          ]),
          answer: "0",
          order: 2,
          points: 2
        }
      ]
    },
    {
      title: "React Components Quiz",
      lessonId: "react-components",
      questions: [
        {
          text: "What is a React component?",
          type: "multiple-choice",
          options: JSON.stringify([
            "A reusable piece of UI",
            "A database table",
            "A styling framework",
            "A JavaScript library"
          ]),
          answer: "0",
          order: 1,
          points: 2
        },
        {
          text: "How do you create a functional component in React?",
          type: "multiple-choice",
          options: JSON.stringify([
            "function MyComponent() {}",
            "class MyComponent {}",
            "const MyComponent = []",
            "var MyComponent = {}"
          ]),
          answer: "0",
          order: 2,
          points: 2
        }
      ]
    }
  ]