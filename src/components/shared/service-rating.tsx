interface rating {
  name: string;
  rating: number;
}
interface ServiceRatingProps {
  rating: number;
  reviews: rating[];
}

const ServiceRating = ({ rating, reviews }: ServiceRatingProps) => {
  return (
    <div className="flex items-center">
      <div className="rating">
        {Array.from({ length: 5 }, (_, index) => (
          <input
            key={index}
            type="radio"
            name="rating-2"
            readOnly
            className={`mask mask-star-2 rating-xs ${rating > index ? "bg-orange-400" : "bg-gray-300"}`} // Active stars are orange, others are gray
          />
        ))}
      </div>
      <p>({reviews.length})</p>
    </div>
  );
};

export default ServiceRating;
