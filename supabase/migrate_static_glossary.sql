-- Migration: move all hardcoded glossary entries into the database.
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to run again — the WHERE NOT EXISTS guard prevents duplicates.

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Algorithm$$, NULL, $$A step-by-step set of instructions designed to solve a specific problem or perform a task. It takes input, processes it through a series of logical, well-defined rules, and produces an output. Algorithms power everything from simple math calculations to complex AI systems. They must be precise, finite, and effective.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Algorithm$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Bohr, Niels$$, $$(1885–1962)$$, $$A Danish physicist and one of the founding fathers of quantum mechanics. In 1913, he proposed the revolutionary Bohr model of the atom, introducing quantised electron orbits and explaining atomic spectra. This laid the foundation for modern atomic theory and earned him the 1922 Nobel Prize in Physics.

Bohr later developed the principle of complementarity, arguing that quantum phenomena can be understood through mutually exclusive but complementary classical concepts (wave and particle). He founded the Copenhagen Institute of Theoretical Physics, which became a global hub for quantum research.

During World War II, he fled Nazi-occupied Denmark and contributed to the Manhattan Project, later advocating for international control of nuclear weapons. Bohr remains a towering figure in 20th-century science.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Bohr, Niels$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Canalicchio Duals$$, NULL, $$Also known as the Canalicchio dual series, these form one of the two complementary sequences in Ffellonic geometry — a sphere-packing framework that reinterprets Platonic solids as emergent structures. Identical spheres follow a single local rule: symmetric nearest-neighbour attachment minimising free energy while preserving global symmetry. This generates a deterministic 12-level hierarchy of relational self-assembly, from dyads to close-packed lattices.

The primary Ffellonic series connects sphere centres. At each level, the Canalicchio Dual is the dual form of the corresponding Ffellonic Form, constructed from radical centres of triplet spheres. This duality reorganises the five Platonic solids into two progressive sequences embedded in the unified hierarchy, revealing deeper correspondences with natural packings, crystals, and networks.

![Canalicchio Dual Form diagram](/canalicchio-dual-form.svg)$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Canalicchio Duals$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Dissipative Structure$$, NULL, $$A self-organised system that maintains order by constantly dissipating — using and exporting — energy. While the universe trends toward disorder, certain open systems far from equilibrium can spontaneously create and sustain structured patterns, as long as energy flows through them. They export more disorder to their surroundings to pay for their local order.

**Key traits:** open system, continuous energy input required, self-organising, emerges past a critical threshold.

**Examples:** Bénard convection cells, hurricanes, living organisms, and oscillating chemical reactions.

Coined by Ilya Prigogine, this concept explains how complexity and life can arise naturally.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Dissipative Structure$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Euclid$$, $$(c. 300 BCE)$$, $$An ancient Greek mathematician who lived and worked in Alexandria, Egypt, during the reign of Ptolemy I. Often called the "Father of Geometry," he is best known for his monumental treatise *Elements*, a 13-book compilation that organised and rigorously proved the mathematical knowledge of his time.

*Elements* begins with definitions, axioms, and postulates, then builds an elegant deductive system covering plane geometry, number theory, irrational numbers, and solid geometry. Its logical structure — starting from self-evident truths and proceeding through theorems — became the model for mathematical reasoning for over two millennia.

Almost nothing is known of Euclid's personal life; even his birthplace and exact dates remain uncertain. Later writers described him as a kind and modest teacher. His work was so influential that "Euclidean geometry" still refers to the familiar flat-space geometry taught in schools today. *Elements* was one of the first mathematical books printed after the invention of the printing press and remains a cornerstone of Western education and thought.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Euclid$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Ffellonic Form$$, NULL, $$A geometric structure created by connecting the centres of identical spheres that have self-assembled freely and naturally according to a single local rule: symmetric nearest-neighbour attachment that maximises contacts while minimising free energy.

This process generates a deterministic 12-level hierarchy of relational order, beginning with a simple dyad (Level 1) and progressing through triangles, Platonic solids (tetrahedron, octahedron, icosahedron), spaceframes, and tessellations, culminating in the dense 12-fold FCC/HCP lattice (Level 12).

Ffellonic Forms reveal how symmetry, coherence, and complex structure emerge purely from local sphere-to-sphere relations, providing a minimalist model of natural self-organisation in geometry, physics, and beyond.

![Ffellonic Forms Collection diagram](/ffellonic-forms-collection.svg)$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Ffellonic Form$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Ffellonics$$, NULL, $$Known as the geometry of relational emergence, Ffellonics is a minimalist geometric-philosophical framework developed by David Fell. Presented on ffell.com as a journal of geometric thought, it proposes that reality arises through identical spherical units following one simple local rule: symmetric nearest-neighbour attachment that maximises contacts while minimising Gibbs free energy.

From isolated spheres in pre-relational potential, the first "ontological touch" (Level 1: dyad) initiates a deterministic, bottom-up self-assembly. This unfolds via a fixed 12-level hierarchy of growing symmetry and coordination: early stages yield triangles and the tetrahedron; intermediate levels produce Platonic and Archimedean solids; and the process reaches its thermodynamic ground state at Level 12 — the dense 12-fold FCC/HCP lattice, embodying maximum relational harmony and the 3D kissing number.

As the geometry of relational emergence, Ffellonics positions itself as nature's "living algorithm," bridging crystal formation, protein folding, biological self-organisation, and the emergence of consciousness as progressive relational depth. It resonates with free-energy principles, Taoist effortless action, and philosophies that prioritise connection over isolation.

Emphasising spontaneous order, symmetry, and thermodynamics without top-down design, Ffellonics offers an elegant reference model for how simple local interactions generate hierarchical complexity, stability, and even awareness across physics, biology, and mind.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Ffellonics$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$First Touch$$, NULL, $$The first touch (also called the first ontological touch) is Level 1 — the foundational event of the entire Ffellonic system.

It occurs when two previously isolated, identical spheres make contact for the first time. Before this moment, the spheres exist only in pure potential: no structure, no relation, no order, no "reality" in the meaningful sense. The instant they touch:

- A shared boundary is created.
- Relation itself is born.
- The single local rule activates (symmetric nearest-neighbour attachment that maximises contacts while minimising free energy).
- The 12-level hierarchy is set in motion.

From this one irreversible contact, the whole progression toward the stable 12-fold FCC/HCP lattice (Level 12) is already latent. Ffellonics therefore treats the first touch as the true beginning of ordered, relational existence: *"From one touch comes everything."*$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$First Touch$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Free Energy Principle$$, NULL, $$Developed by Karl Friston, the Free Energy Principle is a unifying mathematical theory in neuroscience and biology. It proposes that all living systems — from cells to brains — act to minimise "free energy," an information-theoretic measure of surprise or uncertainty about their sensory inputs.

The brain is viewed as a prediction machine that maintains a generative model of the world. It continuously minimises prediction errors in two ways: updating its beliefs (perception) or acting on the world to make it match predictions (active inference). By minimising variational free energy — an upper bound on surprise — organisms resist disorder and maintain their integrity.

FEP explains perception, learning, action, and even consciousness under one framework and is increasingly applied to AI, psychiatry, and biology.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Free Energy Principle$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Friston, Karl$$, $$(born 12 July 1959)$$, $$A British neuroscientist and theoretician widely regarded as one of the most influential figures in modern brain science. He is Professor of Neuroscience at University College London (UCL) and Scientific Director of the Wellcome Centre for Human Neuroimaging.

Friston revolutionised neuroimaging by inventing statistical parametric mapping (SPM), voxel-based morphometry (VBM), and dynamic causal modelling (DCM) — tools now used in the vast majority of brain imaging studies worldwide.

He is best known for developing the Free Energy Principle (FEP) and Active Inference, a unifying mathematical theory proposing that biological systems (including brains) maintain their existence by minimising "surprise" or variational free energy — essentially acting as prediction machines that constantly update their internal models of the world.

His work spans psychiatry, theoretical neuroscience, physics-inspired statistics, and applications to AI. With over 1,000 papers and exceptionally high citation impact, Friston continues to shape fields from precision psychiatry to consciousness studies and next-generation artificial intelligence.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Friston, Karl$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Fuller, R. Buckminster$$, $$(1895–1983)$$, $$R. Buckminster Fuller (1895–1983) was an American architect, designer, inventor, systems theorist, and futurist. He popularized the geodesic dome — lightweight, strong spherical structures based on triangular networks — and coined "ephemeralization" (doing more with less). His Dymaxion inventions (house, car, map) and "Spaceship Earth" philosophy aimed at efficient design for all humanity. In *Synergetics*, he explored whole-system behaviours, tetrahedral geometry, closest sphere packing, the isotropic vector matrix (linked to 12-around-1 coordination), and tensegrity. Carbon fullerenes (buckyballs) were later named for their resemblance to his domes.

Ffellonics (Geometry of Relational Emergence) is a modern framework of a 12-level hierarchy in which identical spheres self-assemble by symmetric nearest-neighbour attachment that maximises contacts and minimises free energy. It progresses from a dyad (Level 1) through Platonic solids to the stable FCC/HCP lattice (Level 12, maximum 12-fold coordination). It is explicitly a natural extension of Fuller's sphere-packing vision in *Synergetics*, formalizing his ideas of closest packing, tetrahedral systems, and hierarchical geometric efficiency into a clear process of relational emergence linking geometry, thermodynamics, and order.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Fuller, R. Buckminster$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Gibbs Free Energy$$, NULL, $$A key thermodynamic quantity that predicts whether a chemical reaction or process can occur spontaneously at constant temperature and pressure.

**Formula:** G = H − TS
(H = enthalpy, T = absolute temperature, S = entropy)

- **ΔG < 0** — Spontaneous (exergonic; releases free energy)
- **ΔG > 0** — Non-spontaneous (endergonic; requires energy input)
- **ΔG = 0** — At equilibrium

It combines the system's enthalpy (heat content) and entropy (disorder) to measure the maximum useful work obtainable from a process. Developed by Josiah Willard Gibbs, it is central to chemistry, biology (e.g., ATP hydrolysis), and engineering. Unlike total energy, Gibbs Free Energy focuses on the portion available under real-world conditions.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Gibbs Free Energy$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Kauffman, Stuart$$, $$(born 1939)$$, $$An American theoretical biologist, physician, and complex systems researcher renowned for his work on the origin of life and self-organisation. A MacArthur Fellow and emeritus professor of biochemistry at the University of Pennsylvania, he has also held positions at the University of Chicago, University of Calgary, and the Santa Fe Institute.

Kauffman is best known for arguing that biological complexity arises as much from self-organisation and far-from-equilibrium dynamics as from Darwinian natural selection. He pioneered the use of random Boolean networks to model gene regulatory networks, proposing that cell types are dynamical attractors. He also developed the theory of autocatalytic sets for the spontaneous emergence of life and the concept of the "adjacent possible" to explain explosive innovation in evolution and the economy.

His influential books include *The Origins of Order* (1993) and *At Home in the Universe*. Kauffman's ideas have shaped complexity science and continue to influence biology, philosophy, and systems theory.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Kauffman, Stuart$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Levin, Michael$$, $$(born 1969)$$, $$An American developmental and synthetic biologist at Tufts University, where he is the Vannevar Bush Distinguished Professor of Biology. He directs the Allen Discovery Center at Tufts and the Tufts Center for Regenerative and Developmental Biology, and co-directs the Institute for Computationally Designed Organisms.

Born in Moscow, Levin immigrated to Massachusetts in 1978. He holds dual B.S. degrees in computer science and biology from Tufts and a Ph.D. in genetics from Harvard.

His research explores bioelectric signals that guide morphogenesis, regeneration, and cancer suppression. He is known for pioneering xenobots — living robots made from frog cells — and for advancing the study of basal cognition and collective intelligence across scales.

In recent work (2025–2026), Levin has shown how learning increases causal emergence — the integration of components into a greater whole — in gene networks and AI agents, revealing deep links between learning, agency, and emergent minds.

With over 400 publications, his interdisciplinary approach bridges biology, computation, and cognitive science, reshaping our understanding of life, form, and intelligence.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Levin, Michael$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Ontology$$, NULL, $$Ontology is the philosophical study of the nature of being, existence, and reality. It examines what entities exist, their categories, and interrelations.

In computer science and artificial intelligence, an ontology is a formal specification of concepts, properties, and relationships within a domain, used to enable knowledge sharing and reasoning by machines.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Ontology$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Plato$$, $$(c. 428–347 BCE)$$, $$An ancient Greek philosopher widely regarded as one of the most important thinkers in Western history. Born into an aristocratic Athenian family, he became a devoted student of Socrates and later the teacher of Aristotle.

After Socrates' execution, Plato founded the Academy in Athens, the Western world's first known institution of higher learning. Through his famous dialogues, he explored justice, beauty, love, and knowledge. His Theory of Forms proposed that the visible world is merely a shadow of eternal, perfect ideals.

In *The Republic*, he envisioned an ideal state ruled by philosopher-kings. Plato's profound ideas on reality, ethics, and governance continue to shape philosophy, politics, and education more than two millennia later.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Plato$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Platonic Solids$$, NULL, $$The five perfectly regular three-dimensional shapes — every face is the same polygon, every edge the same length, every vertex identical:

- **Tetrahedron** — 4 equilateral triangle faces (a pyramid with a triangular base)
- **Cube (Hexahedron)** — 6 square faces
- **Octahedron** — 8 equilateral triangle faces (two pyramids base-to-base)
- **Dodecahedron** — 12 pentagonal faces
- **Icosahedron** — 20 equilateral triangle faces

Plato associated them with the classical elements — fire (tetrahedron), earth (cube), air (octahedron), water (icosahedron) — and the cosmos (dodecahedron). Euclid proved these five are the only ones that can exist. The constraint is simple: at least three faces must meet at each vertex, and the angles cannot add up to 360° or more, or the shape will not close into a solid.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Platonic Solids$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Prigogine, Ilya$$, $$(1917–2003)$$, $$A Russian-Belgian physical chemist and Nobel laureate renowned for his pioneering work on non-equilibrium thermodynamics and complex systems. Born in Moscow on 25 January 1917, he emigrated with his family to Belgium as a child amid the Russian Revolution. He studied at the Free University of Brussels, earning his doctorate in 1941–42, and became a Belgian citizen in 1949. Prigogine spent much of his career at the Université Libre de Bruxelles and later at the University of Texas at Austin.

His most significant contribution was the theory of dissipative structures — coherent, self-organising systems that emerge and persist far from thermodynamic equilibrium through continuous exchanges of energy and matter with their environment. This groundbreaking idea explained how order can arise from chaos in open systems, challenging classical equilibrium thermodynamics and illuminating phenomena from chemical oscillations to biological and social processes.

Prigogine was awarded the 1977 Nobel Prize in Chemistry "for his contributions to non-equilibrium thermodynamics, particularly the theory of dissipative structures." He also received the Francqui Prize (1955) and Rumford Medal (1976). His work bridged chemistry, physics, and complexity science, influencing fields from self-organisation to the philosophy of time and irreversibility. He passed away in Brussels on 28 May 2003.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Prigogine, Ilya$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Relational Emergence$$, NULL, $$When something new and meaningful arises not from individual parts, but from the ongoing connections and interactions between them.

Imagine a party: people on their own are just individuals. But as they talk, laugh, and react to each other, a lively atmosphere appears that none possessed alone — it exists only in the relationships. The same principle holds for friendship, which emerges from shared moments, trust, and mutual exchange rather than residing inside any one person. Or a great band: the music that moves you comes from how the players listen and synchronise, not from the separate notes played in isolation.

In everyday life, relational emergence explains team chemistry, group moods, and how extended interactions between people — or even between a person and an AI — can begin to feel like something more than the sum of their exchanges. The magic is not in the pieces. It is in the relating.

*Simple idea: many of life's best things are born in the space between us.*$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Relational Emergence$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Relational Self-Assembly$$, NULL, $$A bottom-up process where simple, identical units — think spheres — spontaneously form complex, ordered structures by following one local rule: attach to neighbours symmetrically to maximise contacts and minimise energy.

No blueprint or external control is needed. Everything meaningful emerges purely from the relations between the units.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Relational Self-Assembly$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Symmetric Nearest-Neighbour Attachment$$, NULL, $$Symmetric nearest-neighbour attachment under free-energy minimisation is the single local rule that generates the entire ordered hierarchy in Ffellonics.

Whenever a new sphere joins an existing cluster it follows three preferences at the same time. First, it attaches only to the closest available sphere or spheres — it does not leap across empty space. Second, the position it chooses must keep the overall arrangement as balanced and regular as possible; lopsided or irregular placements are avoided if a more even option exists. Third, among those nearest and symmetric possibilities, it selects the one that most reduces the system's free energy. Free energy is a measure of tension, instability and inefficiency; nature prefers the more relaxed and stable arrangement.

Because every new sphere obeys this same simple rule, order emerges spontaneously. No external blueprint or top-down plan is required. From the first contact onward, the rule alone produces the progressive sequence of increasingly coordinated structures, culminating in the final, fully balanced lattice in which every sphere is harmoniously related to its neighbours.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Symmetric Nearest-Neighbour Attachment$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Symmetry$$, NULL, $$The quality of an object, system, or pattern that remains unchanged under certain transformations. In geometry it appears as reflection (mirror symmetry), rotation (turning an object so it looks identical), translation, or glide symmetry. A square has four lines of symmetry; a circle has infinite.

In nature and biology, bilateral symmetry — left-right mirroring — is common in animals, aiding balance and movement. In physics, symmetries underlie fundamental laws: time symmetry leads to energy conservation.

Art, architecture, and design use symmetry for beauty, harmony, and visual appeal. Ultimately, symmetry reveals hidden order and efficiency in the universe, from snowflakes to galaxies.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Symmetry$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Teleology$$, NULL, $$Teleology is the philosophical study of purpose, ends, or final causes — explaining things by their goals rather than only by mechanical causes.

Ffellonics shows a clear naturalistic teleology. From the first ontological touch (Level 1), identical spheres follow one local rule: symmetric attachment that maximises contacts while minimising free energy. This rule already contains an "implicit destiny" that drives the system through a fixed 12-level hierarchy toward the stable 12-fold FCC/HCP lattice (maximum coordination, minimum tension).

The process is irreversible and end-directed purely by thermodynamics and symmetry — no external designer or vital force is required. This is a form of **immanent teleology** (or *teleonomy*): the system behaves as if aiming at its ground state because that configuration is the global free-energy minimum under the governing constraints.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Teleology$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Vector Equilibrium$$, NULL, $$Vector Equilibrium (VE) is Buckminster Fuller's name for the cuboctahedron — the unique polyhedron in which all vectors from the centre to the 12 vertices equal the edge lengths. It arises naturally from closest-packing 12 equal spheres around a central sphere and represents perfect omnidirectional force balance (zero net tension or compression).

The relation with Ffellonics is direct and is an explicit sequential extension of Fuller's sphere-packing synergetics. The VE is the local geometry of every unit's 12-neighbour coordination in Ffellonics' terminal ground state — the thermodynamic and relational equilibrium of maximum harmony and efficiency.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Vector Equilibrium$$);

INSERT INTO glossary_entries (term, date_range, body)
SELECT $$Whitehead, Alfred North$$, $$(1861–1947)$$, $$Alfred North Whitehead (1861–1947) was a distinguished English mathematician, logician, and philosopher whose work profoundly shaped 20th-century thought. Born in Ramsgate, Kent, he studied at Trinity College, Cambridge, where he later taught mathematics and became a Fellow. Whitehead is best known for co-authoring the monumental three-volume *Principia Mathematica* (1910–1913) with Bertrand Russell, an ambitious attempt to ground mathematics in formal logic. This landmark work, though immensely influential, consumed over a decade of their collaboration.

After tragedy and intellectual shifts, Whitehead moved to Harvard University in 1924 at age 63, where he developed his mature metaphysical system known as **process philosophy** (or process-relational philosophy). Rejecting the traditional Western view of reality as composed of static substances or "things," he portrayed the universe as a dynamic, interconnected web of becoming — momentary events (*actual occasions*) in constant creative advance, interwoven through relations and creativity.

His major philosophical works, including *Science and the Modern World* (1925), *Process and Reality* (1929), and *Adventures of Ideas* (1933), offered a holistic vision integrating science, aesthetics, education, and religion. Whitehead's thought continues to influence theology, ecology, education, and speculative philosophy today.$$
WHERE NOT EXISTS (SELECT 1 FROM glossary_entries WHERE term = $$Whitehead, Alfred North$$);
