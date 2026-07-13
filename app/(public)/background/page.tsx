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

        {/* P */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">P</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
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

      </div>
    </article>
  );
}
