type SuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
};

export function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question}
          onClick={() => onSelect(question)}
          className="rounded-full border border-slate-700 bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-400 hover:text-cyan-300"
        >
          {question}
        </button>
      ))}
    </div>
  );
}