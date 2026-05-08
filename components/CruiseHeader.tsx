export function CruiseHeader() {
  return (
    <header className="bg-cruise-header text-cruise-header-foreground px-6 py-5">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold italic tracking-tight uppercase">
        <span>Icon</span>
        <span className="flex flex-col text-[0.6em] leading-none font-bold not-italic">
          <span>of</span>
          <span>the</span>
        </span>
        <span>Seas</span>
      </h1>
    </header>
  );
}
