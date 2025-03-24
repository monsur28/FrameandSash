export default function Section({ title, isOpen, onToggle, content }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300">
      <div className="flex justify-between items-center p-4 bg-teal-500 text-white rounded-t-lg">
        <h2 className="font-medium">{title}</h2>
        <button onClick={onToggle} className="text-sm hover:underline">
          {isOpen ? "Hide" : "Show more"}
        </button>
      </div>
      {isOpen && <div className="p-4 space-y-4">{content}</div>}
    </div>
  );
}
