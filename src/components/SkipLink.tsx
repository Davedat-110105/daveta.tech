export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:bg-fg focus:px-4 focus:py-2 focus:text-base focus:font-medium focus:text-bg"
    >
      Skip to content
    </a>
  );
}
