import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { Client } from "../../types";

const ClientCard = ({ data }: { data: Client }) => {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <img
        src={`${VITE_IMAGE_PATH_URL}/client/${data.client_image}`}
        alt=""
        className="w-[120px] h-[120px] rounded-full block mb-5"
      />
      <article className="mb-10">
        <h3 className="text-base leading-5 font-semibold text-primary mt-3">{data.name}</h3>
        <small className="text-xs font-base text-gray-400 block mb-3">
          {data.company}, {data.designation}
        </small>
        <p className="text-xs font-normal">{data.content}</p>
      </article>
    </div>
  );
};

export default ClientCard;
