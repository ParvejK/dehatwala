import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Shell for the booking dialogs — details, payment, review, book-again.
 *
 * The project had no shared modal (each caller built its own inline), which was
 * fine for one dialog and stops being fine at four: focus handling, Escape and
 * scroll locking would be reimplemented, slightly differently, in each.
 */
type ModalProps = {
  title: string;
  /** Small line under the title, e.g. the booking reference. */
  subtitle?: string;
  onClose: () => void;
  /** Wider shell for content with tables. */
  size?: "sm" | "md";
  children: React.ReactNode;
  /** Pinned to the bottom, outside the scrolling body. */
  footer?: React.ReactNode;
};

const Modal = ({ title, subtitle, onClose, size = "sm", children, footer }: ModalProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#0f1e57]/70 p-4"
      // Only a click that both starts and ends on the backdrop closes, so a
      // drag that ends outside the panel does not dismiss the dialog.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-modal-title"
        className={`flex max-h-[88vh] w-full flex-col overflow-hidden rounded-2xl border border-[#dce7fb] bg-white shadow-[0_28px_70px_-30px_rgba(15,30,87,0.65)] ${
          size === "md" ? "max-w-lg" : "max-w-sm"
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eef2f9] px-5 py-4">
          <div className="min-w-0">
            <h2 id="dashboard-modal-title" className="text-sm font-extrabold text-[#0f1e57]">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-[11px] font-bold text-[#0b3fc4]">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-[#63739a] transition hover:bg-[#f1f6ff] hover:text-[#0f1e57]"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="border-t border-[#eef2f9] px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
