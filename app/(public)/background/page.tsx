import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import type { GlossaryEntry } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Glossary",
  description: "A glossary of people and subjects mentioned in the Ffellonics essays, arranged alphabetically.",
};

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function renderWithLinks(text: string): React.ReactNode[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a key={m.index} href={m[2]} className="text-[#b8862a] hover:underline">
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function DbEntries({ letter, dbByLetter, afterTerm, beforeTerm }: {
  letter: string;
  dbByLetter: Record<string, GlossaryEntry[]>;
  afterTerm?: string;
  beforeTerm?: string;
}) {
  let entries = dbByLetter[letter] ?? [];
  if (afterTerm !== undefined) entries = entries.filter(e => e.term.toLowerCase() > afterTerm.toLowerCase());
  if (beforeTerm !== undefined) entries = entries.filter(e => e.term.toLowerCase() < beforeTerm.toLowerCase());
  return (
    <>
      {entries.map((entry) => (
        <div key={entry.id} id={slugify(entry.term)} className="border-t border-[#ddd5c8] pt-6 pb-6">
          <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
            {entry.term}
            {entry.date_range && (
              <span className="text-sm font-sans font-normal text-[#7c6f64] ml-2">{entry.date_range}</span>
            )}
          </h3>
          <div className="font-serif text-[#333] leading-relaxed space-y-3">
            {entry.body.split("\n\n").map((para, i) => <p key={i}>{renderWithLinks(para)}</p>)}
          </div>
        </div>
      ))}
    </>
  );
}

function DbLetterSections({ letters, dbByLetter }: { letters: string[]; dbByLetter: Record<string, GlossaryEntry[]> }) {
  const active = letters.filter((l) => (dbByLetter[l] ?? []).length > 0);
  if (active.length === 0) return null;
  return (
    <>
      {active.map((letter) => (
        <section key={letter}>
          <h2 className="font-serif text-2xl text-[#b8862a] mt-10 mb-4">{letter}</h2>
          <DbEntries letter={letter} dbByLetter={dbByLetter} />
        </section>
      ))}
    </>
  );
}

const STATIC_ENTRIES: { label: string; anchor: string }[] = [
  { label: "Algorithm", anchor: "algorithm" },
  { label: "Bohr, Niels", anchor: "bohr-niels" },
  { label: "Canalicchio Duals", anchor: "canalicchio-duals" },
  { label: "Dissipative Structure", anchor: "dissipative-structure" },
  { label: "Euclid", anchor: "euclid" },
  { label: "Ffellonic Form", anchor: "ffellonic-form" },
  { label: "Ffellonics", anchor: "ffellonics" },
  { label: "First Touch", anchor: "first-touch" },
  { label: "Free Energy Principle", anchor: "free-energy-principle" },
  { label: "Friston, Karl", anchor: "friston-karl" },
  { label: "Fuller, R. Buckminster", anchor: "fuller-r-buckminster" },
  { label: "Gibbs Free Energy", anchor: "gibbs-free-energy" },
  { label: "Kauffman, Stuart", anchor: "kauffman-stuart" },
  { label: "Levin, Michael", anchor: "levin-michael" },
  { label: "Ontology", anchor: "ontology" },
  { label: "Plato", anchor: "plato" },
  { label: "Platonic Solids", anchor: "platonic-solids" },
  { label: "Prigogine, Ilya", anchor: "prigogine-ilya" },
  { label: "Relational Emergence", anchor: "relational-emergence" },
  { label: "Relational Self-Assembly", anchor: "relational-self-assembly" },
  { label: "Symmetric Nearest-Neighbour Attachment", anchor: "symmetric-nearest-neighbour-attachment" },
  { label: "Symmetry", anchor: "symmetry" },
  { label: "Teleology", anchor: "teleology" },
  { label: "Vector Equilibrium", anchor: "vector-equilibrium" },
  { label: "Whitehead, Alfred North", anchor: "whitehead-alfred-north" },
];

async function getGlossaryEntries(): Promise<GlossaryEntry[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("glossary_entries")
      .select("*")
      .order("term", { ascending: true });
    return (data ?? []) as GlossaryEntry[];
  } catch {
    return [];
  }
}

export default async function BackgroundPage() {
  const dbEntries = await getGlossaryEntries();

  const dbByLetter: Record<string, GlossaryEntry[]> = {};
  for (const entry of dbEntries) {
    const letter = entry.term[0].toUpperCase();
    if (!dbByLetter[letter]) dbByLetter[letter] = [];
    dbByLetter[letter].push(entry);
  }

  const dbIndexEntries = dbEntries.map(e => ({ label: e.term, anchor: slugify(e.term) }));
  const allIndexEntries = [...STATIC_ENTRIES, ...dbIndexEntries].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const indexByLetter: Record<string, { label: string; anchor: string }[]> = {};
  for (const entry of allIndexEntries) {
    const letter = entry.label[0].toUpperCase();
    if (!indexByLetter[letter]) indexByLetter[letter] = [];
    indexByLetter[letter].push(entry);
  }
  const indexLetters = Object.keys(indexByLetter).sort();

  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
        Glossary
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-8" />

      <p className="font-serif italic text-[#7c6f64] mb-8">
        A glossary of people and subjects mentioned in the essays, arranged alphabetically.
      </p>

      <nav className="mb-12 border border-[#ddd5c8] rounded-lg p-5 bg-[#faf8f5]">
        {indexLetters.map(letter => (
          <div key={letter} className="mb-4">
            <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#b8862a] mb-1">{letter}</div>
            {indexByLetter[letter].map(entry => (
              <div key={entry.anchor}>
                <a href={`#${entry.anchor}`} className="font-serif text-sm text-[#0f2240] hover:text-[#b8862a] hover:underline transition-colors">
                  {entry.label}
                </a>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="space-y-10">

        {/* A */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">A</h2>
          <DbEntries letter="A" dbByLetter={dbByLetter} beforeTerm="Algorithm" />
          <div id="algorithm" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Algorithm</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                A step-by-step set of instructions designed to solve a specific problem or
                perform a task. It takes input, processes it through a series of logical,
                well-defined rules, and produces an output. Algorithms power everything from
                simple math calculations to complex AI systems. They must be precise, finite,
                and effective.
              </p>
            </div>
          </div>
          <DbEntries letter="A" dbByLetter={dbByLetter} afterTerm="Algorithm" />
        </section>

        {/* B */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">B</h2>
          <DbEntries letter="B" dbByLetter={dbByLetter} beforeTerm="Bohr, Niels" />
          <div id="bohr-niels" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Bohr, Niels{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(1885–1962)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="B" dbByLetter={dbByLetter} afterTerm="Bohr, Niels" />
        </section>

        {/* C */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">C</h2>
          <DbEntries letter="C" dbByLetter={dbByLetter} beforeTerm="Canalicchio Duals" />
          <div id="canalicchio-duals" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Canalicchio Duals</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="C" dbByLetter={dbByLetter} afterTerm="Canalicchio Duals" />
        </section>

        {/* D */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">D</h2>
          <DbEntries letter="D" dbByLetter={dbByLetter} beforeTerm="Dissipative Structure" />
          <div id="dissipative-structure" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Dissipative Structure</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="D" dbByLetter={dbByLetter} afterTerm="Dissipative Structure" />
        </section>

        {/* E */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">E</h2>
          <DbEntries letter="E" dbByLetter={dbByLetter} beforeTerm="Euclid" />
          <div id="euclid" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Euclid{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(c. 300 BCE)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="E" dbByLetter={dbByLetter} afterTerm="Euclid" />
        </section>

        {/* F */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">F</h2>

          <DbEntries letter="F" dbByLetter={dbByLetter} beforeTerm="Ffellonic Form" />
          {/* Ffellonic Form */}
          <div id="ffellonic-form" className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Ffellonic Form</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="F" dbByLetter={dbByLetter} afterTerm="Ffellonic Form" beforeTerm="Ffellonics" />
          {/* Ffellonics */}
          <div id="ffellonics" className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Ffellonics</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="F" dbByLetter={dbByLetter} afterTerm="Ffellonics" beforeTerm="First Touch" />
          {/* First Touch */}
          <div id="first-touch" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              First Touch (First Ontological Touch)
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                The first touch (also called the first ontological touch) is Level 1 — the
                foundational event of the entire Ffellonic system.
              </p>
              <p>
                It occurs when two previously isolated, identical spheres make contact for the
                first time. Before this moment, the spheres exist only in pure potential: no
                structure, no relation, no order, no &ldquo;reality&rdquo; in the meaningful sense.
                The instant they touch:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>A shared boundary is created.</li>
                <li>Relation itself is born.</li>
                <li>
                  The single local rule activates (symmetric nearest-neighbour attachment that
                  maximises contacts while minimising free energy).
                </li>
                <li>The 12-level hierarchy is set in motion.</li>
              </ul>
              <p>
                From this one irreversible contact, the whole progression toward the stable 12-fold
                FCC/HCP lattice (Level 12) is already latent. Ffellonics therefore treats the first
                touch as the true beginning of ordered, relational existence:{" "}
                <em>&ldquo;From one touch comes everything.&rdquo;</em>
              </p>
            </div>
          </div>

          <DbEntries letter="F" dbByLetter={dbByLetter} afterTerm="First Touch" beforeTerm="Free Energy Principle" />
          {/* Free Energy Principle */}
          <div id="free-energy-principle" className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Free Energy Principle (FEP)</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="F" dbByLetter={dbByLetter} afterTerm="Free Energy Principle" beforeTerm="Friston, Karl" />
          {/* Friston, Karl */}
          <div id="friston-karl" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Friston, Karl{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(born 12 July 1959)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="F" dbByLetter={dbByLetter} afterTerm="Friston, Karl" beforeTerm="Fuller, R. Buckminster" />
          {/* Fuller, R. Buckminster */}
          <div id="fuller-r-buckminster" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              Fuller, R. Buckminster{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(1895–1983)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                R. Buckminster Fuller (1895–1983) was an American architect, designer, inventor,
                systems theorist, and futurist. He popularized the geodesic dome — lightweight,
                strong spherical structures based on triangular networks — and coined
                &ldquo;ephemeralization&rdquo; (doing more with less). His Dymaxion inventions
                (house, car, map) and &ldquo;Spaceship Earth&rdquo; philosophy aimed at efficient
                design for all humanity. In <em>Synergetics</em>, he explored whole-system
                behaviours, tetrahedral geometry, closest sphere packing, the isotropic vector
                matrix (linked to 12-around-1 coordination), and tensegrity. Carbon fullerenes
                (buckyballs) were later named for their resemblance to his domes.
              </p>
              <p>
                Ffellonics (Geometry of Relational Emergence) is a modern framework of a 12-level
                hierarchy in which identical spheres self-assemble by symmetric nearest-neighbour
                attachment that maximises contacts and minimises free energy. It progresses from a
                dyad (Level 1) through Platonic solids to the stable FCC/HCP lattice (Level 12,
                maximum 12-fold coordination). It is explicitly a natural extension of Fuller&apos;s
                sphere-packing vision in <em>Synergetics</em>, formalizing his ideas of closest
                packing, tetrahedral systems, and hierarchical geometric efficiency into a clear
                process of relational emergence linking geometry, thermodynamics, and order.
              </p>
            </div>
          </div>

          <DbEntries letter="F" dbByLetter={dbByLetter} afterTerm="Fuller, R. Buckminster" />
        </section>

        {/* G */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">G</h2>
          <DbEntries letter="G" dbByLetter={dbByLetter} beforeTerm="Gibbs Free Energy" />
          <div id="gibbs-free-energy" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Gibbs Free Energy (G)</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="G" dbByLetter={dbByLetter} afterTerm="Gibbs Free Energy" />
        </section>

        <DbLetterSections letters={["H", "I", "J"]} dbByLetter={dbByLetter} />

        {/* K */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">K</h2>
          <DbEntries letter="K" dbByLetter={dbByLetter} beforeTerm="Kauffman, Stuart" />
          <div id="kauffman-stuart" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Kauffman, Stuart{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(born 1939)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="K" dbByLetter={dbByLetter} afterTerm="Kauffman, Stuart" />
        </section>

        {/* L */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">L</h2>
          <DbEntries letter="L" dbByLetter={dbByLetter} beforeTerm="Levin, Michael" />
          <div id="levin-michael" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Levin, Michael{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(born 1969)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="L" dbByLetter={dbByLetter} afterTerm="Levin, Michael" />
        </section>

        <DbLetterSections letters={["M", "N"]} dbByLetter={dbByLetter} />

        {/* O */}
        <section>
          <h2 className="font-serif text-2xl text-[#b8862a] mt-10 mb-4">O</h2>
          <DbEntries letter="O" dbByLetter={dbByLetter} beforeTerm="Ontology" />
          {/* Ontology */}
          <div id="ontology" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              Ontology
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                Ontology is the philosophical study of the nature of being, existence, and reality.
                It examines what entities exist, their categories, and interrelations.
              </p>
              <p>
                In computer science and artificial intelligence, an ontology is a formal
                specification of concepts, properties, and relationships within a domain, used to
                enable knowledge sharing and reasoning by machines.
              </p>
            </div>
          </div>
          <DbEntries letter="O" dbByLetter={dbByLetter} afterTerm="Ontology" />
        </section>

        {/* P */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">P</h2>

          <DbEntries letter="P" dbByLetter={dbByLetter} beforeTerm="Plato" />
          {/* Plato */}
          <div id="plato" className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Plato{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(c. 428–347 BCE)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="P" dbByLetter={dbByLetter} afterTerm="Plato" beforeTerm="Platonic Solids" />
          {/* Platonic Solids */}
          <div id="platonic-solids" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Platonic Solids</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="P" dbByLetter={dbByLetter} afterTerm="Platonic Solids" beforeTerm="Prigogine, Ilya" />
          {/* Prigogine, Ilya */}
          <div id="prigogine-ilya" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">
              Prigogine, Ilya{" "}
              <span className="text-sm font-sans font-normal text-[#7c6f64]">(1917–2003)</span>
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                A Russian-Belgian physical chemist and Nobel laureate renowned for his pioneering
                work on non-equilibrium thermodynamics and complex systems. Born in Moscow on
                25 January 1917, he emigrated with his family to Belgium as a child amid the
                Russian Revolution. He studied at the Free University of Brussels, earning his
                doctorate in 1941–42, and became a Belgian citizen in 1949. Prigogine spent much
                of his career at the Université Libre de Bruxelles and later at the University
                of Texas at Austin.
              </p>
              <p>
                His most significant contribution was the theory of dissipative structures —
                coherent, self-organising systems that emerge and persist far from thermodynamic
                equilibrium through continuous exchanges of energy and matter with their
                environment. This groundbreaking idea explained how order can arise from chaos in
                open systems, challenging classical equilibrium thermodynamics and illuminating
                phenomena from chemical oscillations to biological and social processes.
              </p>
              <p>
                Prigogine was awarded the 1977 Nobel Prize in Chemistry &ldquo;for his
                contributions to non-equilibrium thermodynamics, particularly the theory of
                dissipative structures.&rdquo; He also received the Francqui Prize (1955) and
                Rumford Medal (1976). His work bridged chemistry, physics, and complexity
                science, influencing fields from self-organisation to the philosophy of time and
                irreversibility. He passed away in Brussels on 28 May 2003.
              </p>
            </div>
          </div>

          <DbEntries letter="P" dbByLetter={dbByLetter} afterTerm="Prigogine, Ilya" />
        </section>

        <DbLetterSections letters={["Q"]} dbByLetter={dbByLetter} />

        {/* R */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">R</h2>

          <DbEntries letter="R" dbByLetter={dbByLetter} beforeTerm="Relational Emergence" />
          {/* Relational Emergence */}
          <div id="relational-emergence" className="border-t border-[#ddd5c8] pt-6 space-y-2 mb-8">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Relational Emergence</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="R" dbByLetter={dbByLetter} afterTerm="Relational Emergence" beforeTerm="Relational Self-Assembly" />
          {/* Relational Self-Assembly */}
          <div id="relational-self-assembly" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Relational Self-Assembly</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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

          <DbEntries letter="R" dbByLetter={dbByLetter} afterTerm="Relational Self-Assembly" />
        </section>

        {/* S */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">S</h2>

          <DbEntries letter="S" dbByLetter={dbByLetter} beforeTerm="Symmetric" />
          {/* Symmetric Nearest-Neighbour Attachment */}
          <div id="symmetric-nearest-neighbour-attachment" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              Symmetric Nearest-Neighbour Attachment Under Free-Energy Minimisation
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                Symmetric nearest-neighbour attachment under free-energy minimisation is the single
                local rule that generates the entire ordered hierarchy in Ffellonics.
              </p>
              <p>
                Whenever a new sphere joins an existing cluster it follows three preferences at the
                same time. First, it attaches only to the closest available sphere or spheres — it
                does not leap across empty space. Second, the position it chooses must keep the
                overall arrangement as balanced and regular as possible; lopsided or irregular
                placements are avoided if a more even option exists. Third, among those nearest and
                symmetric possibilities, it selects the one that most reduces the system&apos;s
                free energy. Free energy is a measure of tension, instability and inefficiency;
                nature prefers the more relaxed and stable arrangement.
              </p>
              <p>
                Because every new sphere obeys this same simple rule, order emerges spontaneously.
                No external blueprint or top-down plan is required. From the first contact onward,
                the rule alone produces the progressive sequence of increasingly coordinated
                structures, culminating in the final, fully balanced lattice in which every sphere
                is harmoniously related to its neighbours.
              </p>
            </div>
          </div>

          <DbEntries letter="S" dbByLetter={dbByLetter} afterTerm="Symmetric Nearest" beforeTerm="Symmetry" />
          {/* Symmetry */}
          <div id="symmetry" className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240]">Symmetry</h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
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
          <DbEntries letter="S" dbByLetter={dbByLetter} afterTerm="Symmetry" />
        </section>

        {/* T */}
        <section>
          <h2 className="font-serif text-2xl text-[#b8862a] mt-10 mb-4">T</h2>
          <DbEntries letter="T" dbByLetter={dbByLetter} beforeTerm="Teleology" />
          {/* Teleology */}
          <div id="teleology" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              Teleology
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                Teleology is the philosophical study of purpose, ends, or final causes — explaining
                things by their goals rather than only by mechanical causes.
              </p>
              <p>
                Ffellonics shows a clear naturalistic teleology. From the first ontological touch
                (Level 1), identical spheres follow one local rule: symmetric attachment that
                maximises contacts while minimising free energy. This rule already contains an
                &ldquo;implicit destiny&rdquo; that drives the system through a fixed 12-level
                hierarchy toward the stable 12-fold FCC/HCP lattice (maximum coordination, minimum
                tension).
              </p>
              <p>
                The process is irreversible and end-directed purely by thermodynamics and
                symmetry — no external designer or vital force is required. This is a form of{" "}
                <strong>immanent teleology</strong> (or <em>teleonomy</em>): the system behaves as
                if aiming at its ground state because that configuration is the global free-energy
                minimum under the governing constraints.
              </p>
            </div>
          </div>
          <DbEntries letter="T" dbByLetter={dbByLetter} afterTerm="Teleology" />
        </section>

        <DbLetterSections letters={["U"]} dbByLetter={dbByLetter} />

        {/* V */}
        <section>
          <h2 className="font-serif text-2xl text-[#b8862a] mt-10 mb-4">V</h2>
          <DbEntries letter="V" dbByLetter={dbByLetter} beforeTerm="Vector Equilibrium" />
          {/* Vector Equilibrium */}
          <div id="vector-equilibrium" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              Vector Equilibrium (VE)
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                Vector Equilibrium (VE) is Buckminster Fuller&apos;s name for the
                cuboctahedron — the unique polyhedron in which all vectors from the centre to
                the 12 vertices equal the edge lengths. It arises naturally from closest-packing
                12 equal spheres around a central sphere and represents perfect omnidirectional
                force balance (zero net tension or compression).
              </p>
              <p>
                The relation with Ffellonics is direct and is an explicit sequential extension of
                Fuller&apos;s sphere-packing synergetics. The VE is the local geometry of every
                unit&apos;s 12-neighbour coordination in Ffellonics&apos; terminal ground
                state — the thermodynamic and relational equilibrium of maximum harmony and
                efficiency.
              </p>
            </div>
          </div>
          <DbEntries letter="V" dbByLetter={dbByLetter} afterTerm="Vector Equilibrium" />
        </section>

        {/* W */}
        <section>
          <h2 className="font-serif text-2xl text-[#b8862a] mt-10 mb-4">W</h2>
          <DbEntries letter="W" dbByLetter={dbByLetter} beforeTerm="Whitehead, Alfred North" />
          {/* Whitehead, Alfred North */}
          <div id="whitehead-alfred-north" className="border-t border-[#ddd5c8] pt-6 pb-6">
            <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
              Whitehead, Alfred North (1861–1947)
            </h3>
            <div className="font-serif text-[#333] leading-relaxed space-y-3">
              <p>
                Alfred North Whitehead (1861–1947) was a distinguished English mathematician,
                logician, and philosopher whose work profoundly shaped 20th-century thought. Born
                in Ramsgate, Kent, he studied at Trinity College, Cambridge, where he later taught
                mathematics and became a Fellow. Whitehead is best known for co-authoring the
                monumental three-volume <em>Principia Mathematica</em> (1910–1913) with Bertrand
                Russell, an ambitious attempt to ground mathematics in formal logic. This landmark
                work, though immensely influential, consumed over a decade of their collaboration.
              </p>
              <p>
                After tragedy and intellectual shifts, Whitehead moved to Harvard University in
                1924 at age 63, where he developed his mature metaphysical system known as{" "}
                <strong>process philosophy</strong> (or process-relational philosophy). Rejecting
                the traditional Western view of reality as composed of static substances or
                &ldquo;things,&rdquo; he portrayed the universe as a dynamic, interconnected web
                of becoming — momentary events (<em>actual occasions</em>) in constant creative
                advance, interwoven through relations and creativity.
              </p>
              <p>
                His major philosophical works, including <em>Science and the Modern World</em>{" "}
                (1925), <em>Process and Reality</em> (1929), and <em>Adventures of Ideas</em>{" "}
                (1933), offered a holistic vision integrating science, aesthetics, education, and
                religion. Whitehead&apos;s thought continues to influence theology, ecology,
                education, and speculative philosophy today.
              </p>
            </div>
          </div>
          <DbEntries letter="W" dbByLetter={dbByLetter} afterTerm="Whitehead, Alfred North" />
        </section>

        <DbLetterSections letters={["X", "Y", "Z"]} dbByLetter={dbByLetter} />

      </div>
    </article>
  );
}
