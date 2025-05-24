export function Generatequiz() {
  const num1 = Math.floor(Math.random() * 100);
  const num2 = Math.floor(Math.random() * 100);
  const operator = ["*", "-", "+"][Math.floor(Math.random() * 3)];

  return {
    question: `${num1} ${operator} ${num2}`,
    num1,
    num2,
    operator,
  };
}
