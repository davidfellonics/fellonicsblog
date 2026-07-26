export default function Footer() {
  return (
    <footer className="border-t border-[#ddd5c8] mt-20">
      <div className="mx-4 sm:mx-[100px] py-12 text-center">
        <p className="font-serif text-[#0f2240] text-xl tracking-tight">FFellonics</p>
        <div className="w-8 h-[1px] bg-[#b8862a] mx-auto my-4" />
        <p className="text-sm text-[#7c6f64] font-serif italic">Exploring geometry, one essay at a time.</p>

        {/* X / Twitter */}
        <a
          href="https://x.com/ffellonicforms"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Ffellonics on X"
          className="inline-flex items-center justify-center mt-6 text-[#7c6f64] hover:text-[#0f2240] transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        <p className="text-xs text-[#9c8c7c] mt-6">
          © {new Date().getFullYear()} FFellonics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
