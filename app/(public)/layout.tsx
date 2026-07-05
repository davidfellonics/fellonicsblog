import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f9f6f2]">
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
