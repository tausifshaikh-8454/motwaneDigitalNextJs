/** Eyebrow + heading pair used at the top of most sections. */
export function SectionHeading({
  eyebrow,
  heading,
  wide = false,
}: {
  eyebrow?: string;
  heading?: string;
  /** Allow the heading to run wider than the default 680px */
  wide?: boolean;
}) {
  if (!eyebrow && !heading) return null;
  return (
    <div className="text-center">
      {eyebrow && <p className="text-lg font-medium uppercase leading-[1.4] text-primary lg:text-eyebrow">{eyebrow}</p>}
      {heading && (
        <h2
          className={`mx-auto mt-3 ${wide ? "max-w-none" : "max-w-[680px]"} text-[22px] font-bold leading-[1.4] text-[#1a1a1a] md:mt-5 lg:text-h1`}
        >
          {heading}
        </h2>
      )}
    </div>
  );
}
