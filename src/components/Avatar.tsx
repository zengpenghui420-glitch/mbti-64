import type { TypeCode } from "@/lib/score";
import { cn } from "cn";

/**
 * Original flat geometric portraits.
 * Same sticker vibe as the classic sixteen-type cartoons — round head,
 * short body, one readable prop, temperament pastel — drawn from scratch.
 */

type HairStyle =
  | "side"
  | "messy"
  | "sleek"
  | "wavy"
  | "long"
  | "bangs"
  | "soft"
  | "curly"
  | "neat"
  | "bun"
  | "crop"
  | "bob"
  | "tuft"
  | "fluff"
  | "spiky"
  | "pony";

type FaceStyle = "calm" | "soft" | "grin" | "focus";
type Outfit = "suit" | "sweater" | "robe" | "apron" | "jacket";
type PropKind =
  | "blueprint"
  | "cube"
  | "baton"
  | "spark"
  | "lantern"
  | "book"
  | "sword"
  | "stars"
  | "clipboard"
  | "teacup"
  | "ruler"
  | "cake"
  | "drill"
  | "palette"
  | "bolt"
  | "mic";

interface Look {
  bg: string;
  skin: string;
  hair: string;
  cloth: string;
  pants: string;
  accent: string;
  shoe: string;
  blush: string;
  ink: string;
  hairStyle: HairStyle;
  face: FaceStyle;
  glasses?: "rect" | "round" | "sun";
  hat?: "beret" | "nurse" | "goggles";
  outfit: Outfit;
  tie?: string;
  left: [number, number];
  right: [number, number];
  prop: PropKind;
  propAt: [number, number];
  propRot?: number;
}

const LOOKS: Record<TypeCode, Look> = {
  INTJ: {
    bg: "#EDE4F8",
    skin: "#F4C9A8",
    hair: "#3A2C55",
    cloth: "#6B52B0",
    pants: "#46367A",
    accent: "#F7F4FC",
    shoe: "#2E2644",
    blush: "#F0B4BA",
    ink: "#2A2436",
    hairStyle: "side",
    face: "focus",
    glasses: "rect",
    outfit: "suit",
    tie: "#CDBEF0",
    left: [78, 236],
    right: [208, 228],
    prop: "blueprint",
    propAt: [186, 168],
    propRot: -8,
  },
  INTP: {
    bg: "#E7E0F6",
    skin: "#E7B48E",
    hair: "#3E342C",
    cloth: "#7D6CC0",
    pants: "#4A4068",
    accent: "#F4EFE6",
    shoe: "#3A342C",
    blush: "#E8A898",
    ink: "#2C2830",
    hairStyle: "messy",
    face: "calm",
    glasses: "round",
    outfit: "sweater",
    left: [86, 210],
    right: [214, 226],
    prop: "cube",
    propAt: [188, 176],
  },
  ENTJ: {
    bg: "#F0E4F8",
    skin: "#F6D0B4",
    hair: "#2C2438",
    cloth: "#5C478F",
    pants: "#3A305C",
    accent: "#F8F4FC",
    shoe: "#2A2438",
    blush: "#F0B0B0",
    ink: "#241E30",
    hairStyle: "sleek",
    face: "focus",
    outfit: "suit",
    tie: "#E7C56A",
    left: [92, 228],
    right: [218, 168],
    prop: "baton",
    propAt: [206, 112],
    propRot: -16,
  },
  ENTP: {
    bg: "#EFE6FA",
    skin: "#D9A57C",
    hair: "#4A3428",
    cloth: "#8B6AD2",
    pants: "#4E4268",
    accent: "#FFF6D4",
    shoe: "#3E342C",
    blush: "#E89888",
    ink: "#2C2430",
    hairStyle: "wavy",
    face: "grin",
    outfit: "jacket",
    left: [76, 232],
    right: [214, 164],
    prop: "spark",
    propAt: [196, 112],
    propRot: 8,
  },
  INFJ: {
    bg: "#E5F6EA",
    skin: "#F3C7A8",
    hair: "#2C4638",
    cloth: "#5E9A72",
    pants: "#3E6B50",
    accent: "#F6E7A8",
    shoe: "#314838",
    blush: "#F0B4B4",
    ink: "#243028",
    hairStyle: "long",
    face: "soft",
    outfit: "robe",
    tie: "#F3D98A",
    left: [74, 240],
    right: [206, 230],
    prop: "lantern",
    propAt: [186, 176],
  },
  INFP: {
    bg: "#E7F7EC",
    skin: "#C98662",
    hair: "#3A2A28",
    cloth: "#7DB88A",
    pants: "#4E6E58",
    accent: "#F7F3EA",
    shoe: "#3A302C",
    blush: "#E8A090",
    ink: "#2C2826",
    hairStyle: "bangs",
    face: "soft",
    outfit: "sweater",
    left: [78, 236],
    right: [208, 226],
    prop: "book",
    propAt: [180, 186],
    propRot: -6,
  },
  ENFJ: {
    bg: "#E3F6E8",
    skin: "#F6D0B0",
    hair: "#3A2E32",
    cloth: "#3F8F62",
    pants: "#2F5E44",
    accent: "#F8E7C4",
    shoe: "#2C3830",
    blush: "#F0A8B4",
    ink: "#243028",
    hairStyle: "soft",
    face: "grin",
    outfit: "jacket",
    left: [74, 220],
    right: [214, 214],
    prop: "sword",
    propAt: [204, 146],
    propRot: 10,
  },
  ENFP: {
    bg: "#E8F8EC",
    skin: "#E8B48A",
    hair: "#5A341F",
    cloth: "#62B56C",
    pants: "#3E7A4C",
    accent: "#FFE08A",
    shoe: "#4A3428",
    blush: "#EEA088",
    ink: "#3A2A22",
    hairStyle: "curly",
    face: "grin",
    outfit: "sweater",
    left: [72, 214],
    right: [206, 128],
    prop: "stars",
    propAt: [48, 168],
  },
  ISTJ: {
    bg: "#E6F2FC",
    skin: "#F4D2B4",
    hair: "#2A3344",
    cloth: "#4F82C4",
    pants: "#2E4E74",
    accent: "#F7F5F2",
    shoe: "#2A3340",
    blush: "#F0B4AE",
    ink: "#243044",
    hairStyle: "neat",
    face: "calm",
    outfit: "suit",
    tie: "#D5E4F4",
    left: [78, 236],
    right: [206, 224],
    prop: "clipboard",
    propAt: [184, 168],
  },
  ISFJ: {
    bg: "#E8F4FC",
    skin: "#E0A67E",
    hair: "#4A3034",
    cloth: "#7EADD8",
    pants: "#3E6488",
    accent: "#FFF8F4",
    shoe: "#3A4048",
    blush: "#E89898",
    ink: "#2C3844",
    hairStyle: "bun",
    face: "soft",
    hat: "nurse",
    outfit: "apron",
    left: [78, 234],
    right: [208, 226],
    prop: "teacup",
    propAt: [186, 190],
  },
  ESTJ: {
    bg: "#E5F1FC",
    skin: "#C6865A",
    hair: "#2A241F",
    cloth: "#3D74B0",
    pants: "#2A4C72",
    accent: "#F4F7FB",
    shoe: "#2A3038",
    blush: "#D98B78",
    ink: "#243044",
    hairStyle: "crop",
    face: "focus",
    outfit: "suit",
    tie: "#F0D48A",
    left: [86, 230],
    right: [214, 214],
    prop: "ruler",
    propAt: [202, 148],
  },
  ESFJ: {
    bg: "#EAF5FD",
    skin: "#F3C2A4",
    hair: "#5A382C",
    cloth: "#6AA4D4",
    pants: "#3E688E",
    accent: "#FFF0F3",
    shoe: "#4A403C",
    blush: "#F0A8A0",
    ink: "#3A3038",
    hairStyle: "bob",
    face: "grin",
    outfit: "apron",
    left: [76, 234],
    right: [206, 222],
    prop: "cake",
    propAt: [180, 180],
  },
  ISTP: {
    bg: "#FFF4D4",
    skin: "#8D5A3C",
    hair: "#241C18",
    cloth: "#E0A020",
    pants: "#5C5348",
    accent: "#FFF8E8",
    shoe: "#2C2824",
    blush: "#C47D68",
    ink: "#2C241C",
    hairStyle: "tuft",
    face: "calm",
    hat: "goggles",
    outfit: "jacket",
    left: [78, 236],
    right: [210, 224],
    prop: "drill",
    propAt: [186, 176],
    propRot: -12,
  },
  ISFP: {
    bg: "#FFF6DC",
    skin: "#F6D7C0",
    hair: "#3D2C32",
    cloth: "#F2C14E",
    pants: "#C48A3A",
    accent: "#FFF8EE",
    shoe: "#4A3A34",
    blush: "#F3B4B4",
    ink: "#3A2C30",
    hairStyle: "fluff",
    face: "soft",
    hat: "beret",
    outfit: "sweater",
    left: [76, 232],
    right: [208, 220],
    prop: "palette",
    propAt: [176, 168],
    propRot: -8,
  },
  ESTP: {
    bg: "#FFF3CC",
    skin: "#D3926A",
    hair: "#2C211C",
    cloth: "#E39A1A",
    pants: "#4E463C",
    accent: "#FFF6D8",
    shoe: "#2C2824",
    blush: "#E89080",
    ink: "#2C241C",
    hairStyle: "spiky",
    face: "grin",
    glasses: "sun",
    outfit: "jacket",
    left: [84, 232],
    right: [214, 196],
    prop: "bolt",
    propAt: [190, 148],
    propRot: 10,
  },
  ESFP: {
    bg: "#FFF5D8",
    skin: "#F0BE98",
    hair: "#4E2C28",
    cloth: "#F0B429",
    pants: "#D4892A",
    accent: "#FFF8E4",
    shoe: "#4A342C",
    blush: "#F0A0B0",
    ink: "#3A2A24",
    hairStyle: "pony",
    face: "grin",
    outfit: "jacket",
    left: [72, 156],
    right: [210, 206],
    prop: "mic",
    propAt: [192, 164],
  },
};

function Arm({
  x1,
  y1,
  x2,
  y2,
  color,
  skin,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  skin: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${angle})`}>
      <rect x={-8} y={0} width={16} height={len} rx={8} fill={color} />
      <circle cx={0} cy={len} r={9} fill={skin} />
    </g>
  );
}

function HairBack({ style, color }: { style: HairStyle; color: string }) {
  if (style === "long") {
    return (
      <g fill={color}>
        <path d="M96 150c-8 36-6 78 6 108 10-34 12-72 14-96z" />
        <path d="M184 150c8 36 6 78-6 108-10-34-12-72-14-96z" />
      </g>
    );
  }
  if (style === "bob") {
    return (
      <g fill={color}>
        <rect x="90" y="132" width="24" height="72" rx="12" />
        <rect x="166" y="132" width="24" height="72" rx="12" />
      </g>
    );
  }
  if (style === "pony") {
    return (
      <g fill={color}>
        <ellipse cx="196" cy="168" rx="16" ry="36" />
        <circle cx="196" cy="132" r="10" />
      </g>
    );
  }
  return null;
}

function HairFront({ style, color, accent }: { style: HairStyle; color: string; accent: string }) {
  const cap = <path d="M94 128c2-46 22-66 46-66s44 20 46 66c-14-22-30-30-46-30s-32 8-46 30z" fill={color} />;
  if (style === "messy") {
    return (
      <g fill={color}>
        {cap}
        <circle cx="108" cy="72" r="13" />
        <circle cx="136" cy="62" r="15" />
        <circle cx="166" cy="74" r="12" />
        <circle cx="150" cy="78" r="10" />
      </g>
    );
  }
  if (style === "curly") {
    return (
      <g fill={color}>
        {cap}
        <circle cx="96" cy="104" r="15" />
        <circle cx="112" cy="74" r="15" />
        <circle cx="140" cy="64" r="17" />
        <circle cx="168" cy="74" r="14" />
        <circle cx="184" cy="102" r="14" />
      </g>
    );
  }
  if (style === "spiky") {
    return (
      <g fill={color}>
        {cap}
        <polygon points="140,48 154,84 126,84" />
        <polygon points="104,64 128,90 96,100" />
        <polygon points="176,64 184,102 154,88" />
      </g>
    );
  }
  if (style === "fluff") {
    return (
      <g fill={color}>
        {cap}
        <circle cx="104" cy="86" r="14" />
        <circle cx="176" cy="86" r="14" />
        <circle cx="140" cy="70" r="16" />
      </g>
    );
  }
  if (style === "tuft") {
    return (
      <g fill={color}>
        {cap}
        <ellipse cx="124" cy="66" rx="10" ry="16" />
        <ellipse cx="148" cy="70" rx="8" ry="12" />
      </g>
    );
  }
  if (style === "bun") {
    return (
      <g fill={color}>
        <circle cx="140" cy="58" r="16" />
        {cap}
      </g>
    );
  }
  if (style === "sleek") {
    return (
      <g fill={color}>
        {cap}
        <path d="M168 96c18 4 28 18 24 32-16-6-28-6-40 2 6-14 10-24 16-34z" />
      </g>
    );
  }
  if (style === "wavy") {
    return (
      <g fill={color}>
        {cap}
        <circle cx="98" cy="108" r="14" />
        <circle cx="182" cy="108" r="14" />
        <path d="M150 70c16 2 28 14 30 28-12-8-22-8-34 0 2-12 2-22 4-28z" />
      </g>
    );
  }
  if (style === "bangs") {
    return (
      <g fill={color}>
        {cap}
        <path d="M100 118c8-8 18-18 40-18s32 10 40 18c-10-6-22-10-40-10s-30 4-40 10z" />
      </g>
    );
  }
  if (style === "side" || style === "neat" || style === "soft") {
    return (
      <g fill={color}>
        {cap}
        <path d="M102 112c18-22 46-28 70-16 2 2-10 12-24 12-18 0-32-2-46 4z" />
      </g>
    );
  }
  if (style === "long" || style === "pony" || style === "bob") {
    return (
      <g fill={color}>
        {cap}
        <path d="M104 116c10-20 24-28 36-28s28 10 36 28c-12-10-24-14-36-14s-24 4-36 14z" />
        {style === "pony" ? <circle cx="188" cy="112" r="7" fill={accent} /> : null}
      </g>
    );
  }
  return (
    <g fill={color}>
      {cap}
    </g>
  );
}

function Face({ look }: { look: Look }) {
  const { ink, blush, face } = look;
  const joy = face === "grin";
  return (
    <g>
      {face === "focus" ? (
        <g fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round">
          <path d="M110 108l16-4" />
          <path d="M154 104l16 4" />
        </g>
      ) : (
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round">
          <path d="M112 110c4-3 10-3 14 0" />
          <path d="M154 110c4-3 10-3 14 0" />
        </g>
      )}
      {face === "soft" ? (
        <g fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round">
          <path d="M114 124c4 5 12 5 16 0" />
          <path d="M150 124c4 5 12 5 16 0" />
        </g>
      ) : (
        <g>
          <ellipse cx="122" cy="124" rx="3.4" ry="3.8" fill={ink} />
          <ellipse cx="158" cy="124" rx="3.4" ry="3.8" fill={ink} />
          <circle cx="123.2" cy="122.8" r="1.15" fill="white" />
          <circle cx="159.2" cy="122.8" r="1.15" fill="white" />
        </g>
      )}
      <ellipse cx="104" cy="134" rx="8" ry="4" fill={blush} opacity="0.95" />
      <ellipse cx="176" cy="134" rx="8" ry="4" fill={blush} opacity="0.95" />
      {joy ? (
        <path d="M124 140c6 12 22 12 28 0" fill="#E9897C" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      ) : face === "soft" ? (
        <path d="M128 142c4 6 16 6 20 0" fill="none" stroke={ink} strokeWidth="2.3" strokeLinecap="round" />
      ) : face === "focus" ? (
        <path d="M130 144h16" stroke={ink} strokeWidth="2.3" strokeLinecap="round" />
      ) : (
        <path d="M128 142c5 6 16 6 22 0" fill="none" stroke={ink} strokeWidth="2.3" strokeLinecap="round" />
      )}
    </g>
  );
}

function Glasses({ look }: { look: Look }) {
  if (!look.glasses) return null;
  const ink = look.ink;
  if (look.glasses === "sun") {
    return (
      <g>
        <rect x="106" y="116" width="26" height="16" rx="6" fill="#2C3444" />
        <rect x="148" y="116" width="26" height="16" rx="6" fill="#2C3444" />
        <path d="M132 124h16" stroke="#2C3444" strokeWidth="3" />
        <path d="M108 122h-8M174 122h8" stroke="#2C3444" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    );
  }
  if (look.glasses === "round") {
    return (
      <g fill="none" stroke={ink} strokeWidth="2.3">
        <circle cx="122" cy="124" r="13" fill="white" fillOpacity="0.18" />
        <circle cx="158" cy="124" r="13" fill="white" fillOpacity="0.18" />
        <path d="M135 124h10" />
        <path d="M109 122h-6M171 122h6" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={ink} strokeWidth="2.3">
      <rect x="106" y="114" width="28" height="20" rx="5" fill="white" fillOpacity="0.15" />
      <rect x="146" y="114" width="28" height="20" rx="5" fill="white" fillOpacity="0.15" />
      <path d="M134 124h12" />
      <path d="M106 122h-6M174 122h6" strokeLinecap="round" />
    </g>
  );
}

function Hat({ look }: { look: Look }) {
  if (look.hat === "beret") {
    return (
      <g>
        <ellipse cx="146" cy="74" rx="36" ry="14" fill={look.hair} />
        <circle cx="176" cy="72" r="5" fill={look.cloth} />
      </g>
    );
  }
  if (look.hat === "nurse") {
    return (
      <g>
        <path d="M112 78h56c2 18-12 28-28 28s-30-10-28-28z" fill="#F7FBFF" />
        <circle cx="140" cy="90" r="7" fill="#F4C2CC" />
        <path d="M140 86v8M136 90h8" stroke="#C45B70" strokeWidth="1.7" strokeLinecap="round" />
      </g>
    );
  }
  if (look.hat === "goggles") {
    return (
      <g>
        <path d="M104 84h72" stroke={look.hair} strokeWidth="4" strokeLinecap="round" />
        <circle cx="122" cy="84" r="11" fill="#D7F1F8" stroke={look.ink} strokeWidth="2.2" />
        <circle cx="158" cy="84" r="11" fill="#D7F1F8" stroke={look.ink} strokeWidth="2.2" />
        <path d="M133 84h14" stroke={look.ink} strokeWidth="2.2" />
      </g>
    );
  }
  return null;
}

function Outfit({ look }: { look: Look }) {
  const robe = look.outfit === "robe";
  const torso = robe
    ? "M92 200c-16 42 0 74 28 78h40c28-4 44-36 28-78-16-16-80-16-96 0z"
    : "M104 198c-14 38-2 66 16 70h40c18-4 30-32 16-70-14-12-58-12-72 0z";
  return (
    <g>
      <path d={torso} fill={look.cloth} />
      {look.outfit === "suit" ? (
        <g>
          <path d="M118 202l16 34 8-2-18-36z" fill={look.pants} />
          <path d="M162 202l-16 34-8-2 18-36z" fill={look.pants} />
          <path d="M126 198h28l-6 24h-16z" fill={look.accent} />
          {look.tie ? <path d="M136 206l5 7-5 22-5-22z" fill={look.tie} /> : null}
        </g>
      ) : null}
      {look.outfit === "sweater" ? <path d="M120 198h40l-8 18h-24z" fill={look.accent} /> : null}
      {look.outfit === "robe" ? (
        <g>
          <path d="M132 200h16l-2 70h-12z" fill={look.accent} />
          <circle cx="140" cy="236" r="5" fill={look.tie ?? look.accent} />
        </g>
      ) : null}
      {look.outfit === "apron" ? (
        <g>
          <path d="M118 214h44l-4 50h-36z" fill={look.accent} />
          <path d="M122 214c6-10 30-10 36 0" fill="none" stroke={look.accent} strokeWidth="5" />
          <circle cx="140" cy="236" r="3" fill={look.cloth} />
        </g>
      ) : null}
      {look.outfit === "jacket" ? (
        <g>
          <path d="M128 200h24v20h-24z" fill={look.accent} />
          <path d="M112 214h14v10h-14z" fill={look.ink} opacity="0.12" />
          <path d="M154 214h14v10h-14z" fill={look.ink} opacity="0.12" />
        </g>
      ) : null}
    </g>
  );
}

function PropArt({ kind, accent, ink }: { kind: PropKind; accent: string; ink: string }) {
  switch (kind) {
    case "blueprint":
      return (
        <g>
          <ellipse cx="6" cy="28" rx="6" ry="20" fill="#E4D4B8" />
          <rect x="6" y="8" width="34" height="40" rx="3" fill="#F7F3EA" />
          <ellipse cx="40" cy="28" rx="6" ry="20" fill="#EFE4CC" />
          <path d="M14 18h18M14 26h22M14 34h14" stroke="#7C6BB8" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case "cube":
      return (
        <g>
          <polygon points="24,2 48,16 24,30 0,16" fill="#E4D8FA" />
          <polygon points="0,16 24,30 24,54 0,40" fill="#C4B2EE" />
          <polygon points="24,30 48,16 48,40 24,54" fill="#8E74D4" />
        </g>
      );
    case "baton":
      return (
        <g>
          <rect x="8" y="4" width="8" height="46" rx="4" fill={accent} stroke={ink} strokeWidth="2" />
          <circle cx="12" cy="8" r="5" fill="#E7C56A" />
        </g>
      );
    case "spark":
      return (
        <g>
          <polygon
            points="28,0 33,16 50,16 36,26 42,44 28,34 14,44 20,26 6,16 23,16"
            fill={accent}
            stroke={ink}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </g>
      );
    case "lantern":
      return (
        <g>
          <path d="M18 10c0-8 12-8 12 0" fill="none" stroke={ink} strokeWidth="2.2" />
          <rect x="10" y="10" width="28" height="34" rx="12" fill={accent} />
          <circle cx="24" cy="26" r="6" fill="#FFF8DC" />
          <path d="M16 44h16" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case "book":
      return (
        <g>
          <path d="M4 12c12-8 20-8 24 0v30c-6-6-14-6-24 0z" fill="#F7F3EA" stroke={ink} strokeWidth="1.8" />
          <path d="M28 12c12-8 20-8 24 0v30c-6-6-14-6-24 0z" fill="#E7F3EA" stroke={ink} strokeWidth="1.8" />
          <path d="M28 12v30" stroke={ink} strokeWidth="1.6" />
          <g fill="#7DB88A" transform="translate(40 0)">
            <ellipse cx="8" cy="10" rx="3" ry="6" transform="rotate(-30 8 10)" />
            <ellipse cx="14" cy="10" rx="3" ry="6" transform="rotate(30 14 10)" />
            <circle cx="11" cy="12" r="2" fill="#3E6B50" />
          </g>
        </g>
      );
    case "sword":
      return (
        <g>
          <rect x="16" y="0" width="7" height="48" rx="2" fill="#E7EEE8" stroke={ink} strokeWidth="2" />
          <rect x="6" y="44" width="28" height="7" rx="2" fill="#C6A15A" />
          <rect x="16" y="50" width="7" height="12" rx="2" fill="#8D6A32" />
        </g>
      );
    case "stars":
      return (
        <g fill={accent} stroke={ink} strokeWidth="1.4" strokeLinejoin="round">
          <polygon points="16,2 19,12 30,12 21,18 24,28 16,22 8,28 11,18 2,12 13,12" />
          <polygon points="36,16 38,22 44,22 39,26 41,32 36,28 31,32 33,26 28,22 34,22" />
        </g>
      );
    case "clipboard":
      return (
        <g>
          <rect x="8" y="10" width="34" height="44" rx="5" fill="white" stroke={ink} strokeWidth="2" />
          <rect x="16" y="4" width="18" height="10" rx="3" fill={accent} stroke={ink} strokeWidth="2" />
          <path d="M16 24h18M16 32h18M16 40h12" stroke="#7FA4D0" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case "teacup":
      return (
        <g stroke={ink} strokeWidth="2">
          <path d="M6 16h28v12a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z" fill="white" />
          <path d="M34 20h6a7 7 0 0 1 0 14h-6" fill="none" />
          <path d="M14 10c2-6 4 0 6-6" fill="none" strokeLinecap="round" />
        </g>
      );
    case "ruler":
      return (
        <g>
          <rect x="10" y="0" width="16" height="62" rx="3" fill="#F4E2A8" stroke={ink} strokeWidth="2" />
          <path d="M10 10h8M10 20h5M10 30h8M10 40h5M10 50h8" stroke={ink} strokeWidth="1.6" />
        </g>
      );
    case "cake":
      return (
        <g>
          <path d="M8 28h40v16a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z" fill="#F4C2D0" />
          <rect x="8" y="24" width="40" height="10" rx="4" fill="#FFF6F8" />
          <rect x="26" y="8" width="4" height="16" rx="2" fill="#E7C56A" />
          <circle cx="28" cy="8" r="4" fill="#F08A3C" />
        </g>
      );
    case "drill":
      return (
        <g>
          <rect x="4" y="16" width="28" height="18" rx="6" fill="#5C5348" />
          <rect x="28" y="20" width="22" height="10" rx="3" fill="#D7D2CC" />
          <polygon points="50,18 62,25 50,32" fill="#C9C3BC" />
          <circle cx="14" cy="25" r="3" fill="#F2C14E" />
        </g>
      );
    case "palette":
      return (
        <g>
          <ellipse cx="28" cy="28" rx="26" ry="20" fill="#F7F1E6" stroke={ink} strokeWidth="2" />
          <circle cx="18" cy="22" r="4" fill="#F08A3C" />
          <circle cx="30" cy="16" r="4" fill="#7DB88A" />
          <circle cx="40" cy="24" r="4" fill="#7C6BB8" />
          <circle cx="34" cy="34" r="4" fill="#E07A8C" />
          <path d="M44 8l10 28" stroke="#8D6A32" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "bolt":
      return <polygon points="22,0 8,26 20,26 14,48 36,18 22,18 30,0" fill={accent} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />;
    case "mic":
      return (
        <g>
          <rect x="14" y="0" width="16" height="28" rx="8" fill="#3A2A24" />
          <path d="M10 20c0 12 8 18 14 18s14-6 14-18" fill="none" stroke="#3A2A24" strokeWidth="3" />
          <path d="M22 38v14" stroke="#3A2A24" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 52h16" stroke="#C6A15A" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

function Portrait({ look }: { look: Look }) {
  return (
    <g>
      <circle cx="140" cy="168" r="124" fill={look.bg} />
      <ellipse cx="140" cy="314" rx="54" ry="8" fill={look.ink} opacity="0.08" />
      <HairBack style={look.hairStyle} color={look.hair} />
      <Arm x1={112} y1={204} x2={look.left[0]} y2={look.left[1]} color={look.cloth} skin={look.skin} />
      <Arm x1={168} y1={204} x2={look.right[0]} y2={look.right[1]} color={look.cloth} skin={look.skin} />
      <rect x="116" y="250" width="18" height="50" rx="9" fill={look.pants} />
      <rect x="146" y="250" width="18" height="50" rx="9" fill={look.pants} />
      <ellipse cx="125" cy="300" rx="16" ry="8" fill={look.shoe} />
      <ellipse cx="155" cy="300" rx="16" ry="8" fill={look.shoe} />
      <Outfit look={look} />
      <g transform={`translate(${look.propAt[0]} ${look.propAt[1]}) rotate(${look.propRot ?? 0})`}>
        <PropArt kind={look.prop} accent={look.accent} ink={look.ink} />
      </g>
      <circle cx={look.left[0]} cy={look.left[1]} r={9} fill={look.skin} />
      <circle cx={look.right[0]} cy={look.right[1]} r={9} fill={look.skin} />
      <rect x="128" y="164" width="24" height="26" rx="10" fill={look.skin} />
      <ellipse cx="92" cy="128" rx="8" ry="11" fill={look.skin} />
      <ellipse cx="188" cy="128" rx="8" ry="11" fill={look.skin} />
      <circle cx="140" cy="124" r="50" fill={look.skin} />
      <Face look={look} />
      <HairFront style={look.hairStyle} color={look.hair} accent={look.accent} />
      <Hat look={look} />
      <Glasses look={look} />
    </g>
  );
}

export function PersonaAvatar({
  code,
  className,
  label,
}: {
  code: string;
  className?: string;
  label?: string;
}) {
  const type = (code.slice(0, 4) in LOOKS ? code.slice(0, 4) : "ENFP") as TypeCode;
  const look = LOOKS[type];
  return (
    <svg viewBox="0 0 280 330" className={cn("h-auto w-full", className)} role="img" aria-label={label ?? `${type} 的原创扁平画像`}>
      <Portrait look={look} />
    </svg>
  );
}

const STAGE: Array<{ code: TypeCode; name: string }> = [
  { code: "INTJ", name: "分析师" },
  { code: "ENFP", name: "外交官" },
  { code: "ISFJ", name: "守护者" },
  { code: "ESTP", name: "探险家" },
];

export function AvatarStage() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STAGE.map((item) => (
        <div key={item.code} className="rounded-[28px] bg-white/75 p-2 text-center shadow-sm ring-1 ring-foreground/5">
          <PersonaAvatar code={item.code} />
          <p className="-mt-2 text-sm font-semibold">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.code}</p>
        </div>
      ))}
    </div>
  );
}
