import JoinCarouselBanner from "../../components/joinus/join-carousel-banner";
import StepForm from "../../components/joinus/step-form";

const data = [
  {
    id: 1,
    slogan: "Innovating the Future",
    slogan_image: "innovation.jpg",
  },
  {
    id: 2,
    slogan: "Empowering Progress",
    slogan_image: "empower.jpg",
  },
  {
    id: 3,
    slogan: "Building Excellence",
    slogan_image: "excellence.jpg",
  },
  {
    id: 4,
    slogan: "Shaping Tomorrow",
    slogan_image: "tomorrow.jpg",
  },
  {
    id: 5,
    slogan: "Shaping Tomorrow",
    slogan_image: "tomorrow.jpg",
  },
  {
    id: 6,
    slogan: "Shaping Tomorrow",
    slogan_image: "tomorrow.jpg",
  },
];

const JoinUs = () => {
  return (
    <div className="my-10 min-h-[60vh]">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex justify-center flex-col">
          <h3 className="text-center font-semibold text-xl md:text-3xl mb-3">Join with us</h3>
          <p className="text-center text-base md:text-lg">Join as Labour | Mistry | Labour Thekedar</p>
        </div>
        <div>
          <JoinCarouselBanner data={data} />
        </div>
        <div className="md:p-8 bg-accent rounded-lg">
          <div className="md:max-w-[80%] md:mx-auto">
            <StepForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
