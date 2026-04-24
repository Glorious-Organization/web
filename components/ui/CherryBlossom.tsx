export default function CherryBlossom() {
  const blossom = (
    <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 2C24 2 28 10 28 14C28 18 26 20 24 22C22 20 20 18 20 14C20 10 24 2 24 2ZM2 24C2 24 10 20 14 20C18 20 20 22 22 24C20 26 18 28 14 28C10 28 2 24 2 24ZM46 24C46 24 38 28 34 28C30 28 28 26 26 24C28 22 30 20 34 20C38 20 46 24 46 24ZM24 46C24 46 20 38 20 34C20 30 22 28 24 26C26 28 28 30 28 34C28 38 24 46 24 46ZM8 8C8 8 14 12 16 16C18 20 18 22 17 24C15 23 13 22 11 18C9 14 8 8 8 8ZM40 8C40 8 34 14 32 18C30 22 30 24 31 24C33 23 35 20 37 16C39 12 40 8 40 8ZM8 40C8 40 14 36 18 34C22 32 24 32 24 31C22 29 18 28 14 30C10 32 8 40 8 40ZM40 40C40 40 34 34 30 32C26 30 24 30 24 31C26 33 30 34 34 32C38 30 40 40 40 40Z" />
    </svg>
  );

  return (
    <>
      {/* Top-left */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 w-64 h-64 opacity-[0.04] pointer-events-none -z-10 -translate-x-1/4 -translate-y-1/4 text-primary"
      >
        {blossom}
      </div>
      {/* Bottom-right */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-80 h-80 opacity-[0.04] pointer-events-none -z-10 translate-x-1/4 translate-y-1/4 rotate-45 text-primary"
      >
        {blossom}
      </div>
    </>
  );
}
