export default function Footer() {
  return (
    <footer className="border-t border-[#ddd5c8] mt-20">
      <div className="mx-4 sm:mx-[100px] py-12 text-center">
        <p className="font-serif text-[#0f2240] text-xl tracking-tight">FFellonics</p>
        <div className="w-8 h-[1px] bg-[#b8862a] mx-auto my-4" />
        <p className="text-sm text-[#7c6f64] font-serif italic">Exploring geometry, one essay at a time.</p>
        <p className="text-xs text-[#9c8c7c] mt-6">
          © {new Date().getFullYear()} FFellonics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
