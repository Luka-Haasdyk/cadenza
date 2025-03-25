export default function Entry({ id, title, text, date, track }) {
    return (
      <div className="p-4 border rounded-lg shadow-md mt-5 bg-white">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm mt-2">{date}</p>
      </div>
    );
  }