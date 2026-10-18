import type { TypeCode } from "@/lib/score";
import { cn } from "cn";

type HairKind = "cap" | "messy" | "crop" | "wavy" | "long" | "bangs" | "soft" | "curly" | "side" | "bun" | "bob" | "neat" | "tuft" | "fluff" | "spiky" | "pony";
type FaceKind = "focused" | "smile" | "grin" | "soft" | "warm" | "calm";
type PropKind =
  | "blueprint"
  | "cube"
  | "compass"
  | "spark"
  | "lantern"
  | "quill"
  | "ribbon"
  | "stars"
  | "clipboard"
  | "teacup"
  | "badge"
  | "hearts"
  | "wrench"
  | "brush"
  | "bolt"
  | "confetti";

interface Theme {
  bg: string;
  skin: string;
  hair: string;
  cloth: string;
  accent: string;
  blush: string;
  hairKind: HairKind;
  face: FaceKind;
  glasses?: boolean;
  prop: PropKind;
}

const THEMES: Record<TypeCode, Theme> = {
  INTJ: { bg: "#d9e2ff", skin: "#f6d3b5", hair: "#2d3554", cloth: "#5c6bc4", accent: "#f0c56e", blush: "#f4b4b8", hairKind: "side", face: "focused", glasses: true, prop: "blueprint" },
  INTP: { bg: "#d7f3ee", skin: "#e7b892", hair: "#3d342c", cloth: "#5aa8a0", accent: "#f2d48a", blush: "#efb0a4", hairKind: "messy", face: "calm", glasses: true, prop: "cube" },
  ENTJ: { bg: "#ffe0d4", skin: "#f0c3a0", hair: "#2a2424", cloth: "#e07a5f", accent: "#f2d08a", blush: "#f0a898", hairKind: "crop", face: "focused", prop: "compass" },
  ENTP: { bg: "#fff0c9", skin: "#d9a077", hair: "#4a3428", cloth: "#f0a202", accent: "#fff4c8", blush: "#e89a86", hairKind: "wavy", face: "grin", prop: "spark" },
  INFJ: { bg: "#eee4ff", skin: "#f3c7a8", hair: "#3a3158", cloth: "#8d7cc5", accent: "#f7e3a1", blush: "#f3b7c4", hairKind: "long", face: "soft", prop: "lantern" },
  INFP: { bg: "#e5f6ea", skin: "#c98462", hair: "#3b2a28", cloth: "#7dba8a", accent: "#f6d48a", blush: "#e7a090", hairKind: "bangs", face: "soft", prop: "quill" },
  ENFJ: { bg: "#ffe4ee", skin: "#f6d0b0", hair: "#4a2e32", cloth: "#e9899d", accent: "#f8d7e4", blush: "#f0a8b4", hairKind: "soft", face: "warm", prop: "ribbon" },
  ENFP: { bg: "#ffe7c7", skin: "#e8b48a", hair: "#5a341f", cloth: "#f08a3c", accent: "#ffe08a", blush: "#eea088", hairKind: "curly", face: "grin", prop: "stars" },
  ISTJ: { bg: "#e4eaf4", skin: "#f4d2b4", hair: "#2e3340", cloth: "#6d7c93", accent: "#d9e2ef", blush: "#f0b4ae", hairKind: "neat", face: "calm", prop: "clipboard" },
  ISFJ: { bg: "#ffe8ef", skin: "#e0a67e", hair: "#4a3030", cloth: "#e7a0b0", accent: "#f8e1c4", blush: "#e89898", hairKind: "bun", face: "warm", prop: "teacup" },
  ESTJ: { bg: "#e5f2e4", skin: "#c6865a", hair: "#2a241f", cloth: "#3f7d5a", accent: "#f0d48a", blush: "#d98b78", hairKind: "crop", face: "focused", prop: "badge" },
  ESFJ: { bg: "#fff0e4", skin: "#f3c2a4", hair: "#5a382c", cloth: "#f2b18a", accent: "#fff", blush: "#f0a8a0", hairKind: "bob", face: "warm", prop: "hearts" },
  ISTP: { bg: "#e7f0dc", skin: "#8d5a3c", hair: "#241c18", cloth: "#6e7f4e", accent: "#e7d7a8", blush: "#c47d68", hairKind: "tuft", face: "calm", prop: "wrench" },
  ISFP: { bg: "#e7f7f1", skin: "#f6d7c0", hair: "#3d2c32", cloth: "#8fd0bf", accent: "#f7d0e4", blush: "#f3b4b4", hairKind: "fluff", face: "soft", prop: "brush" },
  ESTP: { bg: "#ffe8dc", skin: "#d3926a", hair: "#2c211c", cloth: "#ef6f4d", accent: "#ffe08a", blush: "#e89080", hairKind: "spiky", face: "grin", prop: "bolt" },
  ESFP: { bg: "#ffe6f2", skin: "#f0be98", hair: "#4e2c28", cloth: "#f2a0c0", accent: "#ffe08a", blush: "#f0a0b0", hairKind: "pony", face: "grin", prop: "confetti" },
};

function HairBack({ kind, color }: { kind: HairKind; color: string }) {
  if (kind === "long") {
    return (
      <g fill={color}>
        <rect x="58" y="108" width="22" height="92" rx="12" />
        <rect x="140" y="108" width="22" height="98" rx="12" />
        <circle cx="110" cy="92" r="46" />
      </g>
    );
  }
  if (kind === "bob") {
    return (
      <g fill={color}>
        <rect x="62" y="104" width="24" height="62" rx="12" />
        <rect x="134" y="104" width="24" height="62" rx="12" />
        <circle cx="110" cy="90" r="46" />
      </g>
    );
  }
  if (kind === "curly") {
    return (
      <g fill={color}>
        <circle cx="74" cy="78" r="18" />
        <circle cx="146" cy="78" r="18" />
        <circle cx="68" cy="104" r="14" />
        <circle cx="152" cy="104" r="14" />
        <circle cx="110" cy="70" r="22" />
        <circle cx="110" cy="92" r="40" />
      </g>
    );
  }
  if (kind === "pony") {
    return (
      <g fill={color}>
        <circle cx="110" cy="90" r="46" />
        <ellipse cx="158" cy="124" rx="16" ry="30" />
      </g>
    );
  }
  if (kind === "spiky") {
    return (
      <g fill={color}>
        <polygon points="110,34 126,74 94,74" />
        <polygon points="72,52 98,78 64,88" />
        <polygon points="148,52 156,90 122,78" />
        <circle cx="110" cy="94" r="42" />
      </g>
    );
  }
  if (kind === "messy" || kind === "tuft") {
    return (
      <g fill={color}>
        <circle cx="110" cy="88" r="44" />
        <circle cx="84" cy="58" r="12" />
        <circle cx="122" cy="50" r="11" />
        <circle cx="146" cy="70" r="10" />
      </g>
    );
  }
  if (kind === "bun") {
    return (
      <g fill={color}>
        <circle cx="110" cy="48" r="16" />
        <circle cx="110" cy="90" r="44" />
      </g>
    );
  }
  if (kind === "fluff") {
    return (
      <g fill={color}>
        <circle cx="78" cy="74" r="16" />
        <circle cx="142" cy="74" r="16" />
        <circle cx="110" cy="64" r="18" />
        <circle cx="110" cy="90" r="44" />
      </g>
    );
  }
  return <ellipse cx="110" cy="82" rx="48" ry="38" fill={color} />;
}

function Bangs({ kind, color }: { kind: HairKind; color: string }) {
  if (kind === "bangs" || kind === "soft" || kind === "bob") {
    return <path d="M74 96c8-22 22-30 36-30s30 10 38 30c-10-8-22-12-38-12s-26 4-36 12z" fill={color} />;
  }
  if (kind === "side" || kind === "neat" || kind === "wavy") {
    return <path d="M76 92c16-18 40-24 62-16 4 2-8 12-20 12-16 0-28-4-42 4z" fill={color} />;
  }
  if (kind === "long" || kind === "pony") {
    return <path d="M78 100c10-24 24-32 36-30 14 2 28 12 34 28-12-10-24-14-36-14s-24 4-34 16z" fill={color} />;
  }
  return null;
}

function Face({ theme }: { theme: Theme }) {
  const ink = "#243044";
  const joy = theme.face === "grin" || theme.face === "warm";
  return (
    <g>
      {theme.face === "soft" ? (
        <>
          <path d="M84 102c3 5 10 5 13 0" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M120 102c3 5 10 5 13 0" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="92" cy="104" r="3.3" fill={ink} />
          <circle cx="128" cy="104" r="3.3" fill={ink} />
          <circle cx="93.2" cy="102.8" r="1.1" fill="white" />
          <circle cx="129.2" cy="102.8" r="1.1" fill="white" />
        </>
      )}
      <path
        d={theme.face === "focused" ? "M84 92h12M124 90h12" : "M84 94c3-3 9-3 12 0M124 94c3-3 9-3 12 0"}
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="78" cy="114" rx="7" ry="3.4" fill={theme.blush} opacity="0.9" />
      <ellipse cx="142" cy="114" rx="7" ry="3.4" fill={theme.blush} opacity="0.9" />
      {joy ? (
        <path d="M98 120c6 8 18 8 24 0" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      ) : theme.face === "smile" || theme.face === "soft" || theme.face === "warm" ? (
        <path d="M102 120c4 5 12 5 16 0" fill="none" stroke={ink} strokeWidth="2.3" strokeLinecap="round" />
      ) : (
        <path d="M104 121h12" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
      )}
      {theme.glasses ? (
        <g fill="none" stroke={ink} strokeWidth="2.1">
          <circle cx="92" cy="104" r="11" />
          <circle cx="128" cy="104" r="11" />
          <path d="M103 104h14" />
        </g>
      ) : null}
    </g>
  );
}

function Prop({ kind, accent }: { kind: PropKind; accent: string }) {
  const ink = "#243044";
  return (
    <g transform="translate(154 156)">
      {kind === "blueprint" && (
        <g>
          <rect x="0" y="0" width="42" height="32" rx="6" fill="white" stroke={ink} strokeWidth="2" />
          <path d="M8 10h18M8 16h26M8 22h14" stroke="#7f8de0" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {kind === "cube" && (
        <g stroke={ink} strokeWidth="2" strokeLinejoin="round">
          <polygon points="20,4 40,14 20,24 0,14" fill={accent} />
          <polygon points="0,14 20,24 20,42 0,32" fill="#9fd8d2" />
          <polygon points="20,24 40,14 40,32 20,42" fill="#67b7ae" />
        </g>
      )}
      {kind === "compass" && (
        <g>
          <circle cx="20" cy="20" r="16" fill="white" stroke={ink} strokeWidth="2" />
          <polygon points="20,8 24,22 20,19 16,22" fill="#e07a5f" />
          <circle cx="20" cy="20" r="2.4" fill={ink} />
        </g>
      )}
      {kind === "spark" && (
        <polygon points="20,0 24,14 38,14 26,22 30,36 20,26 10,36 14,22 2,14 16,14" fill={accent} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
      )}
      {kind === "lantern" && (
        <g>
          <rect x="10" y="8" width="20" height="26" rx="8" fill={accent} stroke={ink} strokeWidth="2" />
          <path d="M16 8c0-6 8-6 8 0" fill="none" stroke={ink} strokeWidth="2" />
          <circle cx="20" cy="20" r="4" fill="#fff7d6" />
        </g>
      )}
      {kind === "quill" && (
        <g stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M12 36c10-4 18-16 20-32" fill="none" />
          <path d="M18 20c6 2 8 6 6 10" fill={accent} />
        </g>
      )}
      {kind === "ribbon" && (
        <g fill={accent} stroke={ink} strokeWidth="1.8">
          <ellipse cx="12" cy="16" rx="10" ry="7" />
          <ellipse cx="28" cy="16" rx="10" ry="7" />
          <circle cx="20" cy="16" r="4" fill="#fff" />
        </g>
      )}
      {kind === "stars" && (
        <g fill={accent} stroke={ink} strokeWidth="1.4">
          <polygon points="12,4 14,12 22,12 16,16 18,24 12,19 6,24 8,16 2,12 10,12" />
          <polygon points="32,16 33,20 38,20 34,23 35,28 32,25 29,28 30,23 26,20 31,20" />
        </g>
      )}
      {kind === "clipboard" && (
        <g>
          <rect x="6" y="6" width="30" height="36" rx="5" fill="white" stroke={ink} strokeWidth="2" />
          <rect x="14" y="2" width="14" height="8" rx="3" fill={accent} stroke={ink} strokeWidth="2" />
          <path d="M12 20h18M12 26h18M12 32h12" stroke="#8aa0c2" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {kind === "teacup" && (
        <g stroke={ink} strokeWidth="2">
          <path d="M8 16h24v10a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z" fill="white" />
          <path d="M32 20h6a6 6 0 0 1 0 12h-6" fill="none" />
          <path d="M14 10c2-6 4 0 6-6" fill="none" strokeLinecap="round" />
        </g>
      )}
      {kind === "badge" && (
        <g>
          <circle cx="20" cy="18" r="14" fill={accent} stroke={ink} strokeWidth="2" />
          <path d="M12 30l8 8 8-8" fill="#3f7d5a" stroke={ink} strokeWidth="2" />
        </g>
      )}
      {kind === "hearts" && (
        <g fill="#f08aa4" stroke={ink} strokeWidth="1.6">
          <path d="M14 14c0-5 8-5 8 2 0-7 8-7 8-2 0 8-8 12-8 12s-8-4-8-12z" />
        </g>
      )}
      {kind === "wrench" && (
        <g fill="#d7e2c2" stroke={ink} strokeWidth="2" strokeLinejoin="round">
          <path d="M14 8a8 8 0 0 0 8 12l12 16-6 6L16 26a10 10 0 0 1-8-14l6 4z" />
        </g>
      )}
      {kind === "brush" && (
        <g stroke={ink} strokeWidth="2" strokeLinecap="round">
          <path d="M14 36l16-20" />
          <path d="M28 12l8 6-8 8-6-4z" fill={accent} />
        </g>
      )}
      {kind === "bolt" && (
        <polygon points="22,2 10,22 20,22 16,40 34,16 22,16 28,2" fill={accent} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
      )}
      {kind === "confetti" && (
        <g>
          <rect x="6" y="10" width="8" height="8" rx="2" fill="#f2a0c0" transform="rotate(20 10 14)" />
          <circle cx="28" cy="12" r="5" fill={accent} />
          <rect x="22" y="26" width="8" height="8" rx="2" fill="#8fd0bf" transform="rotate(-18 26 30)" />
          <circle cx="10" cy="30" r="4" fill="#8d7cc5" />
        </g>
      )}
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
  const type = (code.slice(0, 4) in THEMES ? code.slice(0, 4) : "ENFP") as TypeCode;
  const theme = THEMES[type];
  return (
    <svg viewBox="0 0 220 250" className={cn("h-auto w-full", className)} role="img" aria-label={label ?? `${type} 的原创插画`}>
      <circle cx="110" cy="128" r="96" fill={theme.bg} />
      <ellipse cx="110" cy="214" rx="62" ry="12" fill="#243044" opacity="0.08" />
      <HairBack kind={theme.hairKind} color={theme.hair} />
      <rect x="76" y="150" width="68" height="74" rx="28" fill={theme.cloth} />
      <path d="M96 156h28l-4 16h-20z" fill={theme.accent} />
      <rect x="98" y="140" width="24" height="18" rx="8" fill={theme.skin} />
      <circle cx="110" cy="104" r="40" fill={theme.skin} />
      <ellipse cx="72" cy="108" rx="7" ry="9" fill={theme.skin} />
      <ellipse cx="148" cy="108" rx="7" ry="9" fill={theme.skin} />
      <Bangs kind={theme.hairKind} color={theme.hair} />
      {theme.hairKind === "pony" ? <circle cx="150" cy="96" r="7" fill={theme.accent} /> : null}
      <Face theme={theme} />
      <Prop kind={theme.prop} accent={theme.accent} />
    </svg>
  );
}

export function AvatarStage() {
  const cast: Array<{ code: TypeCode; className: string }> = [
    { code: "INFJ", className: "floaty w-[34%] -rotate-6" },
    { code: "ENTP", className: "floaty z-10 w-[40%] [animation-delay:-1.4s]" },
    { code: "ESFP", className: "floaty w-[34%] rotate-6 [animation-delay:-2.6s]" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-white/50 blur-2xl" />
      <div className="relative flex items-end justify-center px-2 pb-14">
        {cast.map((item) => (
          <PersonaAvatar key={item.code} code={item.code} className={item.className} />
        ))}
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#f0b429] px-4 py-2 text-sm font-semibold whitespace-nowrap text-[#5c3d0c] shadow-[0_6px_0_#d89a1e]">
        结果直出 · 无套路
      </div>
    </div>
  );
}
