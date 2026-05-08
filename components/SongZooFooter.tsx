export function SongZooFooter() {
  return (
    <footer className="flex items-center justify-center gap-2 py-4 text-xs text-foreground">
      <span
        aria-hidden
        className="inline-block size-4 rounded-full bg-accent-red ring-1 ring-black/10"
      />
      <span>
        Powered by <span className="font-semibold">SongZoo</span>
      </span>
    </footer>
  );
}
