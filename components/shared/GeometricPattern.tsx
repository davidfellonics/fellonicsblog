export default function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id="geo-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Triangular tessellation base */}
          <line x1="0" y1="0" x2="80" y2="0" stroke="#e8eef4" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="80" stroke="#e8eef4" strokeWidth="0.5" />
          <line x1="0" y1="80" x2="80" y2="0" stroke="#e8eef4" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="40" y2="80" stroke="#e8eef4" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="40" y2="80" stroke="#e8eef4" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="80" y2="40" stroke="#e8eef4" strokeWidth="0.5" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#e8eef4" strokeWidth="0.5" />
          {/* Icosahedron-inspired diagonal cross */}
          <line x1="0" y1="20" x2="80" y2="60" stroke="#e8eef4" strokeWidth="0.4" />
          <line x1="0" y1="60" x2="80" y2="20" stroke="#e8eef4" strokeWidth="0.4" />
        </pattern>

        {/* Geodesic overlay pattern */}
        <pattern id="geo-hex" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
          {/* Hexagonal geodesic grid */}
          <polygon
            points="60,2 118,32 118,72 60,102 2,72 2,32"
            fill="none"
            stroke="#e8eef4"
            strokeWidth="0.6"
          />
          <line x1="60" y1="2" x2="60" y2="102" stroke="#e8eef4" strokeWidth="0.4" />
          <line x1="2" y1="32" x2="118" y2="72" stroke="#e8eef4" strokeWidth="0.4" />
          <line x1="118" y1="32" x2="2" y2="72" stroke="#e8eef4" strokeWidth="0.4" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#geo-grid)" />
      <rect width="100%" height="100%" fill="url(#geo-hex)" opacity="0.6" />
    </svg>
  );
}
