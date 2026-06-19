export const prompts = [
  "Explain your dream job and why it matters to you.",
  "Should social media platforms be regulated?",
  "Describe a challenge you overcame and what it taught you.",
  "Pitch a new product that would improve daily life.",
  "What is one habit everyone should build?",
  "Argue for or against a four-day work week.",
  "Tell a story about a time you changed your mind.",
  "What makes a leader trustworthy?",
  "Explain a complex topic you understand in simple terms.",
  "Should schools teach financial literacy?",
  "Describe your ideal city of the future.",
  "What role should AI play in education?",
  "Convince a friend to try your favorite hobby.",
  "Talk about a book, film, or idea that influenced you.",
  "What is the most underrated skill in the workplace?",
  "How should people handle failure?",
  "Describe a meaningful tradition in your life.",
  "Should remote work remain common?"
];

export function getRandomPrompt() {
  return prompts[Math.floor(Math.random() * prompts.length)];
}
