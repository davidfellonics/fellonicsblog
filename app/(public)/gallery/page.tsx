import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual gallery of Ffellonics geometric work — diagrams, models, and mathematical art.",
};

export default function GalleryPage() {
  return (
    <article className="mx-4 sm:mx-[100px] py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-3">
        Gallery
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-10" />

      <div className="space-y-20">

        {/* Platonic Solids Composition 51 */}
        <div className="border-t border-[#ddd5c8] pt-10">
          <img
            src="/gallery/platonic-solids-composition-51.svg"
            alt="Platonic Solids Composition 51"
            className="w-full max-w-[720px] mx-auto block mb-8"
          />
          <div className="max-w-[680px] mx-auto">
            <h2 className="font-serif text-2xl text-[#0f2240] mb-4">
              Platonic Solids — Composition 51
            </h2>
            <div className="font-serif text-[#333] leading-relaxed space-y-4">
              <p>
                The Platonic solids are five special three-dimensional shapes that are as perfectly
                balanced and symmetrical as any solid object can be. Every face is exactly the same
                regular polygon, every edge is the same length, and the same number of faces meet at
                every corner. Because of this, you can turn or flip the shape so that any face, edge
                or corner lands exactly where another one was.
              </p>
              <p>There are only five of them:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>the tetrahedron (a pyramid made of four equal triangles),</li>
                <li>the cube (six equal squares),</li>
                <li>the octahedron (eight equal triangles),</li>
                <li>the dodecahedron (twelve equal pentagons),</li>
                <li>the icosahedron (twenty equal triangles).</li>
              </ul>
              <p>
                No other solid shape works this way. Each one has a matching &ldquo;partner&rdquo;
                shape (its dual) that fits together with it perfectly, and the tetrahedron is its own
                partner.
              </p>
              <p>
                What makes them special is their extreme symmetry. You can rotate them in many
                different ways and they still look identical. No other everyday solid objects have
                this level of perfect balance.
              </p>
              <p>
                The ancient philosopher Plato linked them to the basic elements of the world: the
                tetrahedron to fire, the cube to earth, the octahedron to air, the icosahedron to
                water, and the dodecahedron to the whole cosmos. Even today these shapes show up
                wherever nature or design needs the highest possible symmetry — inside viruses,
                crystals and certain carbon molecules.
              </p>
              <p>
                In short, the Platonic solids are the purest examples of three-dimensional symmetry
                that exist.
              </p>
            </div>
          </div>
        </div>

        {/* Composition 56 */}
        <div className="border-t border-[#ddd5c8] pt-10">
          <img
            src="/gallery/composition-56.png"
            alt="Composition 56 — Platonic Solid Duals"
            className="w-full max-w-[720px] mx-auto block mb-8"
          />
          <div className="max-w-[680px] mx-auto">
            <h2 className="font-serif text-2xl text-[#0f2240] mb-4">
              Composition 56
            </h2>
            <div className="font-serif text-[#333] leading-relaxed space-y-4">
              <p>
                To understand the full potential of the Platonic solids, you need to see that they
                are not simply five separate shapes. They form two linked series of three duals each.
              </p>
              <p>
                One series is the tetrahedron, the octahedron and the icosahedron. The other is the
                tetrahedron (which is dual to itself), the cube and the dodecahedron.
              </p>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
