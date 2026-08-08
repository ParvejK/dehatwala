const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <header>
    <h1 className="text-xl font-extrabold tracking-tight text-[#0f1e57] sm:text-2xl">{title}</h1>
    <p className="mt-1.5 text-xs leading-6 text-[#63739a] sm:text-[13px]">{description}</p>
  </header>
);

export default SectionHeader;
