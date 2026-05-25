const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      <div className="rating pointer-events-none">
        {Array.from({ length: 5 }, (_, index) => (
          <input
            key={index}
            type="radio"
            readOnly
            className={`mask mask-star-2 rating-xs ${rating > index ? "bg-orange-400" : "bg-gray-300"}`}
          />
        ))}
      </div>
      <p>({rating})</p>
    </div>
  );
};

export default Rating;
