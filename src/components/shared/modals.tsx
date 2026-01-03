import { ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ServicesModalProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

const ServicesModal = forwardRef<HTMLDialogElement, ServicesModalProps>(({ title, children, className }, ref) => {
  return (
    <dialog ref={ref} id="my_modal_3" className={twMerge("modal", className)}>
      <div className="modal-box w-[50%] max-w-[800px]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <hr className="my-4" />
        <div className="gap-5 grid-cols-2 grid">{children}</div>
      </div>
    </dialog>
  );
});

export default ServicesModal;
