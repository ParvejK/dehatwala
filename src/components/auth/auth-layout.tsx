import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export default function AuthLayout({ children, eyebrow, title, description }: AuthLayoutProps) {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.13),transparent_38%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-px w-[min(90vw,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

      <section className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white px-6 py-8 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.3)] sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
              <p className="mx-auto mt-3 max-w-md text-sm font-normal leading-6 text-slate-600 sm:text-base">{description}</p>
            </div>

            {children}

            <p className="mt-8 text-center text-xs font-normal leading-5 text-slate-500">
              By continuing, you agree to use DehatWala services responsibly and securely.
            </p>
          </div>
      </section>
    </main>
  );
}
