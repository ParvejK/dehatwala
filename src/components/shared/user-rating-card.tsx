import { useState } from "react";
import { Review } from "../../types";
import Rating from "./ratings";

interface UserRatingCardProp {
  reviews: Review[];
}

const UserRatingCard = ({ reviews }: UserRatingCardProp) => {
  const [showAll, setShowAll] = useState(false);
  const ratingsToShow = 10;

  // Determine the reviews to display
  const displayedReviews = showAll ? reviews : reviews.slice(0, ratingsToShow);

  return (
    <div>
      {displayedReviews.map((review, index) => (
        <div key={index} className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex justify-center items-center text-lg font-medium uppercase">
            {review.name.slice(0, 1)}
          </div>
          <div className="flex-1">
            <div className="flex gap-5 items-center mb-3">
              <h3 className="text-base font-semibold">{review.name}</h3>
              <Rating rating={review.rating} />
            </div>
            <p className="text-sm leading-7">{review.review_comments}</p>
          </div>
        </div>
      ))}

      {/* Show more/less button */}
      {reviews.length > ratingsToShow && (
        <div className="my-[60px] flex justify-center items-center">
          <button onClick={() => setShowAll(!showAll)} className="btn btn-link">
            {showAll ? "View less Reviews" : "View all Reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserRatingCard;

// ------------ OLD Reviews code --------------------------
// import { Review } from "../../types";
// import Rating from "./ratings";

// interface UserRatingCardProp {
//   review: Review;
// }

// const UserRatingCard = ({ review }: UserRatingCardProp) => {
//   return (
//     <div className="flex gap-3">
//       <div className="w-10 h-10 bg-black text-white rounded-full flex justify-center items-center text-lg font-medium uppercase">
//         {review.name.slice(0, 1)}
//       </div>
//       <div>
//         <div className="flex gap-5 items-center mb-3">
//           <h3 className="text-base font-semibold">{review.name}</h3>
//           <Rating rating={review.rating} />
//         </div>
//         <p className="text-sm leading-7">{review.review_comments}</p>
//       </div>
//     </div>
//   );
// };

// export default UserRatingCard;
