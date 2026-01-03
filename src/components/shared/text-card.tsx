interface Props {
  id: string;
  icon: string;
  description: string;
}

interface TextCardProps {
  data: Props;
}

const TextCard = ({ data }: TextCardProps) => {
  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body items-center justify-center flex-col gap-2">
        <img src={data.icon} alt="service image" className="w-16 h-16 object-contain" />
        <h2 className="text-sm font-normal capitalize text-center">{data.description}</h2>
      </div>
    </div>
  );
};

export default TextCard;
