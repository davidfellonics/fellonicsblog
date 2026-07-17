import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background",
  description: "A glossary of people and subjects mentioned in the Ffellonics essays, arranged alphabetically.",
};

export default function BackgroundPage() {
  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
        Background
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-8" />

      <p className="font-serif italic text-[#7c6f64] mb-10">
        A glossary of people and subjects mentioned in the essays, arranged alphabetically.
      </p>

      <div className="space-y-10">

        {/* A */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">A</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Algorithm</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A step-by-step set of instructions designed to solve a specific problem or
                perform a task. It takes input, processes it through a series of logical,
                well-defined rules, and produces an output. Algorithms power everything from
                simple math calculations to complex AI systems. They must be precise, finite,
                and effective.
              </p>
            </div>
          </div>
        </section>

        {/* B */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">B</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">
              Bohr, Niels{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(1885–1962)</span>
            </h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A Danish physicist and one of the founding fathers of quantum mechanics. In 1913,
                he proposed the revolutionary Bohr model of the atom, introducing quantised
                electron orbits and explaining atomic spectra. This laid the foundation for
                modern atomic theory and earned him the 1922 Nobel Prize in Physics.
              </p>
              <p>
                Bohr later developed the principle of complementarity, arguing that quantum
                phenomena can be understood through mutually exclusive but complementary classical
                concepts (wave and particle). He founded the Copenhagen Institute of Theoretical
                Physics, which became a global hub for quantum research.
              </p>
              <p>
                During World War II, he fled Nazi-occupied Denmark and contributed to the
                Manhattan Project, later advocating for international control of nuclear weapons.
                Bohr remains a towering figure in 20th-century science.
              </p>
            </div>
          </div>
        </section>

        {/* C */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">C</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Canalicchio Duals</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                Also known as the Canalicchio dual series, these form one of the two
                complementary sequences in Ffellonic geometry — a sphere-packing framework that
                reinterprets Platonic solids as emergent structures. Identical spheres follow a
                single local rule: symmetric nearest-neighbour attachment minimising free energy
                while preserving global symmetry. This generates a deterministic 12-level
                hierarchy of relational self-assembly, from dyads to close-packed lattices.
              </p>
              <p>
                The primary Ffellonic series connects sphere centres. At each level, the
                Canalicchio Dual is the dual form of the corresponding Ffellonic Form,
                constructed from radical centres of triplet spheres. This duality reorganises
                the five Platonic solids into two progressive sequences embedded in the unified
                hierarchy, revealing deeper correspondences with natural packings, crystals, and
                networks.
              </p>
              <div className="mt-6">
                <img
                  src="/canalicchio-dual-form.svg"
                  alt="Canalicchio Dual Form diagram"
                  className="w-full max-w-[480px] mx-auto block"
                />
              </div>
            </div>
          </div>
        </section>

        {/* D */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">D</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Dissipative Structure</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A self-organised system that maintains order by constantly dissipating — using
                and exporting — energy. While the universe trends toward disorder, certain open
                systems far from equilibrium can spontaneously create and sustain structured
                patterns, as long as energy flows through them. They export more disorder to
                their surroundings to pay for their local order.
              </p>
              <p>
                <strong>Key traits:</strong> open system, continuous energy input required,
                self-organising, emerges past a critical threshold.
              </p>
              <p>
                <strong>Examples:</strong> Bénard convection cells, hurricanes, living organisms,
                and oscillating chemical reactions.
              </p>
              <p>
                Coined by Ilya Prigogine, this concept explains how complexity and life can arise
                naturally.
              </p>
            </div>
          </div>
        </section>

        {/* E */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">E</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">
              Euclid{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(c. 300 BCE)</span>
            </h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                An ancient Greek mathematician who lived and worked in Alexandria, Egypt, during
                the reign of Ptolemy I. Often called the &ldquo;Father of Geometry,&rdquo; he is best
                known for his monumental treatise <em>Elements</em>, a 13-book compilation that
                organised and rigorously proved the mathematical knowledge of his time.
              </p>
              <p>
                <em>Elements</em> begins with definitions, axioms, and postulates, then builds an
                elegant deductive system covering plane geometry, number theory, irrational
                numbers, and solid geometry. Its logical structure — starting from self-evident
                truths and proceeding through theorems — became the model for mathematical
                reasoning for over two millennia.
              </p>
              <p>
                Almost nothing is known of Euclid&apos;s personal life; even his birthplace and exact
                dates remain uncertain. Later writers described him as a kind and modest teacher.
                His work was so influential that &ldquo;Euclidean geometry&rdquo; still refers to the
                familiar flat-space geometry taught in schools today. <em>Elements</em> was one of
                the first mathematical books printed after the invention of the printing press and
                remains a cornerstone of Western education and thought.
              </p>
            </div>
          </div>
        </section>

        {/* F */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">F</h2>

          {/* Ffellonic Form */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl text-[#0f2240]">Ffellonic Form</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A geometric structure created by connecting the centres of identical spheres that
                have self-assembled freely and naturally according to a single local rule:
                symmetric nearest-neighbour attachment that maximises contacts while minimising
                free energy.
              </p>
              <p>
                This process generates a deterministic 12-level hierarchy of relational order,
                beginning with a simple dyad (Level 1) and progressing through triangles,
                Platonic solids (tetrahedron, octahedron, icosahedron), spaceframes, and
                tessellations, culminating in the dense 12-fold FCC/HCP lattice (Level 12).
              </p>
              <p>
                Ffellonic Forms reveal how symmetry, coherence, and complex structure emerge
                purely from local sphere-to-sphere relations, providing a minimalist model of
                natural self-organisation in geometry, physics, and beyond.
              </p>
              <div className="mt-6">
                <img
                  src="/ffellonic-forms-collection.svg"
                  alt="Ffellonic Forms Collection diagram"
                  className="w-full max-w-[480px] mx-auto block"
                />
              </div>
            </div>
          </div>

          {/* Ffellonics */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl text-[#0f2240]">Ffellonics</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                Known as the geometry of relational emergence, Ffellonics is a minimalist
                geometric-philosophical framework developed by David Fell. Presented on ffell.com
                as a journal of geometric thought, it proposes that reality arises through
                identical spherical units following one simple local rule: symmetric
                nearest-neighbour attachment that maximises contacts while minimising Gibbs free
                energy.
              </p>
              <p>
                From isolated spheres in pre-relational potential, the first &ldquo;ontological
                touch&rdquo; (Level 1: dyad) initiates a deterministic, bottom-up self-assembly.
                This unfolds via a fixed 12-level hierarchy of growing symmetry and coordination:
                early stages yield triangles and the tetrahedron; intermediate levels produce
                Platonic and Archimedean solids; and the process reaches its thermodynamic ground
                state at Level 12 — the dense 12-fold FCC/HCP lattice, embodying maximum
                relational harmony and the 3D kissing number.
              </p>
              <p>
                As the geometry of relational emergence, Ffellonics positions itself as
                nature&apos;s &ldquo;living algorithm,&rdquo; bridging crystal formation, protein
                folding, biological self-organisation, and the emergence of consciousness as
                progressive relational depth. It resonates with free-energy principles, Taoist
                effortless action, and philosophies that prioritise connection over isolation.
              </p>
              <p>
                Emphasising spontaneous order, symmetry, and thermodynamics without top-down
                design, Ffellonics offers an elegant reference model for how simple local
                interactions generate hierarchical complexity, stability, and even awareness
                across physics, biology, and mind.
              </p>
            </div>
          </div>

          {/* Free Energy Principle */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl text-[#0f2240]">Free Energy Principle (FEP)</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                Developed by Karl Friston, the Free Energy Principle is a unifying mathematical
                theory in neuroscience and biology. It proposes that all living systems — from
                cells to brains — act to minimise &ldquo;free energy,&rdquo; an information-theoretic
                measure of surprise or uncertainty about their sensory inputs.
              </p>
              <p>
                The brain is viewed as a prediction machine that maintains a generative model of
                the world. It continuously minimises prediction errors in two ways: updating its
                beliefs (perception) or acting on the world to make it match predictions (active
                inference). By minimising variational free energy — an upper bound on surprise —
                organisms resist disorder and maintain their integrity.
              </p>
              <p>
                FEP explains perception, learning, action, and even consciousness under one
                framework and is increasingly applied to AI, psychiatry, and biology.
              </p>
            </div>
          </div>

          {/* Friston, Karl */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">
              Friston, Karl{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(born 12 July 1959)</span>
            </h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A British neuroscientist and theoretician widely regarded as one of the most
                influential figures in modern brain science. He is Professor of Neuroscience at
                University College London (UCL) and Scientific Director of the Wellcome Centre
                for Human Neuroimaging.
              </p>
              <p>
                Friston revolutionised neuroimaging by inventing statistical parametric mapping
                (SPM), voxel-based morphometry (VBM), and dynamic causal modelling (DCM) —
                tools now used in the vast majority of brain imaging studies worldwide.
              </p>
              <p>
                He is best known for developing the Free Energy Principle (FEP) and Active
                Inference, a unifying mathematical theory proposing that biological systems
                (including brains) maintain their existence by minimising &ldquo;surprise&rdquo; or
                variational free energy — essentially acting as prediction machines that
                constantly update their internal models of the world.
              </p>
              <p>
                His work spans psychiatry, theoretical neuroscience, physics-inspired statistics,
                and applications to AI. With over 1,000 papers and exceptionally high citation
                impact, Friston continues to shape fields from precision psychiatry to
                consciousness studies and next-generation artificial intelligence.
              </p>
            </div>
          </div>

        </section>

        {/* G */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">G</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Gibbs Free Energy (G)</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A key thermodynamic quantity that predicts whether a chemical reaction or process
                can occur spontaneously at constant temperature and pressure.
              </p>
              <div className="my-4 pl-5 border-l-2 border-[#ddd5c8]">
                <p className="font-sans text-sm text-[#0f2240] not-italic mb-3">
                  <strong>Formula:</strong> G = H &minus; TS
                  <br />
                  <span className="text-[#7c6f64]">(H = enthalpy, T = absolute temperature, S = entropy)</span>
                </p>
                <ul className="font-sans text-sm space-y-1 list-none pl-0">
                  <li><span className="text-[#0f2240]">ΔG &lt; 0</span> — Spontaneous (exergonic; releases free energy)</li>
                  <li><span className="text-[#0f2240]">ΔG &gt; 0</span> — Non-spontaneous (endergonic; requires energy input)</li>
                  <li><span className="text-[#0f2240]">ΔG = 0</span> — At equilibrium</li>
                </ul>
              </div>
              <p>
                It combines the system&apos;s enthalpy (heat content) and entropy (disorder) to
                measure the maximum useful work obtainable from a process. Developed by Josiah
                Willard Gibbs, it is central to chemistry, biology (e.g., ATP hydrolysis), and
                engineering. Unlike total energy, Gibbs Free Energy focuses on the portion
                available under real-world conditions.
              </p>
            </div>
          </div>
        </section>

        {/* K */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">K</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">
              Kauffman, Stuart{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(born 1939)</span>
            </h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                An American theoretical biologist, physician, and complex systems researcher
                renowned for his work on the origin of life and self-organisation. A MacArthur
                Fellow and emeritus professor of biochemistry at the University of Pennsylvania,
                he has also held positions at the University of Chicago, University of Calgary,
                and the Santa Fe Institute.
              </p>
              <p>
                Kauffman is best known for arguing that biological complexity arises as much from
                self-organisation and far-from-equilibrium dynamics as from Darwinian natural
                selection. He pioneered the use of random Boolean networks to model gene
                regulatory networks, proposing that cell types are dynamical attractors. He also
                developed the theory of autocatalytic sets for the spontaneous emergence of life
                and the concept of the &ldquo;adjacent possible&rdquo; to explain explosive innovation
                in evolution and the economy.
              </p>
              <p>
                His influential books include <em>The Origins of Order</em> (1993) and{" "}
                <em>At Home in the Universe</em>. Kauffman&apos;s ideas have shaped complexity
                science and continue to influence biology, philosophy, and systems theory.
              </p>
            </div>
          </div>
        </section>

        {/* L */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">L</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">
              Levin, Michael{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(born 1969)</span>
            </h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                An American developmental and synthetic biologist at Tufts University, where he
                is the Vannevar Bush Distinguished Professor of Biology. He directs the Allen
                Discovery Center at Tufts and the Tufts Center for Regenerative and
                Developmental Biology, and co-directs the Institute for Computationally Designed
                Organisms.
              </p>
              <p>
                Born in Moscow, Levin immigrated to Massachusetts in 1978. He holds dual B.S.
                degrees in computer science and biology from Tufts and a Ph.D. in genetics from
                Harvard.
              </p>
              <p>
                His research explores bioelectric signals that guide morphogenesis, regeneration,
                and cancer suppression. He is known for pioneering xenobots — living robots made
                from frog cells — and for advancing the study of basal cognition and collective
                intelligence across scales.
              </p>
              <p>
                In recent work (2025–2026), Levin has shown how learning increases causal
                emergence — the integration of components into a greater whole — in gene networks
                and AI agents, revealing deep links between learning, agency, and emergent minds.
              </p>
              <p>
                With over 400 publications, his interdisciplinary approach bridges biology,
                computation, and cognitive science, reshaping our understanding of life, form,
                and intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* P */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">P</h2>

          {/* Plato */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl text-[#0f2240]">
              Plato{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(c. 428–347 BCE)</span>
            </h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                An ancient Greek philosopher widely regarded as one of the most important thinkers
                in Western history. Born into an aristocratic Athenian family, he became a devoted
                student of Socrates and later the teacher of Aristotle.
              </p>
              <p>
                After Socrates&apos; execution, Plato founded the Academy in Athens, the Western
                world&apos;s first known institution of higher learning. Through his famous dialogues,
                he explored justice, beauty, love, and knowledge. His Theory of Forms proposed
                that the visible world is merely a shadow of eternal, perfect ideals.
              </p>
              <p>
                In <em>The Republic</em>, he envisioned an ideal state ruled by philosopher-kings.
                Plato&apos;s profound ideas on reality, ethics, and governance continue to shape
                philosophy, politics, and education more than two millennia later.
              </p>
            </div>
          </div>

          {/* Platonic Solids */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Platonic Solids</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                The five perfectly regular three-dimensional shapes — every face is the same
                polygon, every edge the same length, every vertex identical:
              </p>
              <ul className="font-serif space-y-1">
                <li><strong>Tetrahedron</strong> — 4 equilateral triangle faces (a pyramid with a triangular base)</li>
                <li><strong>Cube (Hexahedron)</strong> — 6 square faces</li>
                <li><strong>Octahedron</strong> — 8 equilateral triangle faces (two pyramids base-to-base)</li>
                <li><strong>Dodecahedron</strong> — 12 pentagonal faces</li>
                <li><strong>Icosahedron</strong> — 20 equilateral triangle faces</li>
              </ul>
              <p>
                Plato associated them with the classical elements — fire (tetrahedron), earth
                (cube), air (octahedron), water (icosahedron) — and the cosmos (dodecahedron).
                Euclid proved these five are the only ones that can exist. The constraint is
                simple: at least three faces must meet at each vertex, and the angles cannot
                add up to 360° or more, or the shape will not close into a solid.
              </p>
            </div>
          </div>

        </section>

        {/* R */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">R</h2>

          {/* Relational Emergence */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl text-[#0f2240]">Relational Emergence</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                When something new and meaningful arises not from individual parts, but from the
                ongoing connections and interactions between them.
              </p>
              <p>
                Imagine a party: people on their own are just individuals. But as they talk,
                laugh, and react to each other, a lively atmosphere appears that none possessed
                alone — it exists only in the relationships. The same principle holds for
                friendship, which emerges from shared moments, trust, and mutual exchange rather
                than residing inside any one person. Or a great band: the music that moves you
                comes from how the players listen and synchronise, not from the separate notes
                played in isolation.
              </p>
              <p>
                In everyday life, relational emergence explains team chemistry, group moods, and
                how extended interactions between people — or even between a person and an AI —
                can begin to feel like something more than the sum of their exchanges. The magic
                is not in the pieces. It is in the relating.
              </p>
              <p className="font-sans text-sm italic text-[#7c6f64]">
                Simple idea: many of life&apos;s best things are born in the space between us.
              </p>
            </div>
          </div>

          {/* Relational Self-Assembly */}
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Relational Self-Assembly</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                A bottom-up process where simple, identical units — think spheres — spontaneously
                form complex, ordered structures by following one local rule: attach to neighbours
                symmetrically to maximise contacts and minimise energy.
              </p>
              <p>
                No blueprint or external control is needed. Everything meaningful emerges purely
                from the relations between the units.
              </p>
            </div>
          </div>

        </section>

        {/* S */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">S</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Symmetry</h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                The quality of an object, system, or pattern that remains unchanged under certain
                transformations. In geometry it appears as reflection (mirror symmetry), rotation
                (turning an object so it looks identical), translation, or glide symmetry. A
                square has four lines of symmetry; a circle has infinite.
              </p>
              <p>
                In nature and biology, bilateral symmetry — left-right mirroring — is common in
                animals, aiding balance and movement. In physics, symmetries underlie fundamental
                laws: time symmetry leads to energy conservation.
              </p>
              <p>
                Art, architecture, and design use symmetry for beauty, harmony, and visual
                appeal. Ultimately, symmetry reveals hidden order and efficiency in the universe,
                from snowflakes to galaxies.
              </p>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}
