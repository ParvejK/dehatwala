import { twMerge } from "tailwind-merge";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

const HeadingPrimary = ({ children, className }: HeadingProps) => {
  return <h2 className={twMerge("text-[26px] font-bold mb-2 capitalize", className)}>{children}</h2>;
};

export default HeadingPrimary;
