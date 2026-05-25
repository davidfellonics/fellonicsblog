export default function Footer() {
  return (
    <footer className="border-t border-[#e5e7eb] mt-20">
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="font-bold font-sans text-[#111111] text-lg">Fellonics</p>
        <p className="text-sm text-[#6b7280] mt-1">Exploring geometry, one post at a time.</p>
        <p className="text-xs text-[#6b7280] mt-4">
          © {new Date().getFullYear()} Fellonics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
