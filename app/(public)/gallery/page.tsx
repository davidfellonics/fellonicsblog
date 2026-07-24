import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual gallery of Ffellonics geometric work — diagrams, models, and mathematical art.",
};

const GALLERY_ITEMS: {
  src: string;
  alt: string;
  title: string;
  description: string;
}[] = [
  // Add items here, e.g.:
  // {
  //   src: "/gallery/my-image.jpg",
  //   alt: "Description of image",
  //   title: "Title of Work",
  //   description: "Text describing this piece of work.",
  // },
];

export default function GalleryPage() {
  return (
    <article className="mx-4 sm:mx-[100px] py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-3">
        Gallery
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-10" />

      {GALLERY_ITEMS.length === 0 ? (
        <p className="font-serif italic text-[#7c6f64] text-lg">
          Gallery coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.src} className="flex flex-col">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm border border-[#ddd5c8]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h2 className="font-serif text-lg text-[#0f2240] mt-4 mb-1">{item.title}</h2>
              <p className="font-serif text-sm text-[#555] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
