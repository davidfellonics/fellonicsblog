import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold font-sans text-[#111111] mb-4">404</h1>
      <p className="text-[#6b7280] text-lg mb-8">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="text-[#1a3a5c] font-sans font-medium underline hover:no-underline"
      >
        Back to FFellonics
      </Link>
    </div>
  );
}
