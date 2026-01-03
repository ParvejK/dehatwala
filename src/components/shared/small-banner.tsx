import { FC } from "react";

interface Props {
  title: string;
  content?: string;
  bgImage?: string;
}

const SmallBanner: FC<Props> = ({ title, content, bgImage = "/images/cutting.jpg" }) => {
  return (
    <header
      style={{ backgroundImage: `url(${bgImage})` }}
      className="hero min-h-[30vh] md:min-h-[40vh] bg-base-200 bg-no-repeat bg-center bg-cover bg-fixed"
    >
      <div className="hero-content text-center">
        <div className="max-w-[650px] text-white">
          <h1 className="text-xl md:text-5xl font-bold md:leading-[52px]">{title}</h1>
          <p className="text-base md:text-lg my-3 md:py-6">{content}</p>
        </div>
      </div>
    </header>
  );
};

export default SmallBanner;
