export const SAMPLE_COURSES = [
  {
    title: "JavaScript Fundamentals",
    slug: "javascript-fundamentals",
    description: "Learn JavaScript from scratch",
    modules: [
      {
        title: "Getting Started",
        order: 1,
        lessons: [
          {
            title: "Introduction to JavaScript",
            content: "JavaScript is a programming language...",
            type: "TEXT",
            order: 1
          },
          {
            title: "Variables and Data Types",
            content: "Understanding JavaScript variables...",
            type: "VIDEO",
            order: 2
          }
        ]
      }
    ]
  }
]
  export const COURSES = [
    {
      title: "JavaScript Fundamentals",
      slug: "javascript-fundamentals",
      description: "Learn the basics of JavaScript programming",
      modules: [
        {
          title: "Getting Started",
          order: 1,
          lessons: [
            {
              title: "Introduction to JavaScript",
              content: "JavaScript is a programming language...",
              order: 1,
              quiz: {
                title: "JavaScript Basics Quiz",
                questions: [
                  {
                    text: "What is JavaScript?",
                    type: "MULTIPLE_CHOICE",
                    options: ["Programming language", "Markup language", "Database"],
                    correctAnswer: "0",
                    explanation: "JavaScript is a programming language",
                    points: 2,
                    order: 1
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]