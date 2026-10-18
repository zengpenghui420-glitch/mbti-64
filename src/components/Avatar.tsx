import type { ReactElement } from "react";
import type { TypeCode } from "@/lib/score";
import { cn } from "cn";

/**
 * Original flat portraits. Poses and props follow the classic sixteen-type
 * roles (desk, flask, podium, staff, jump, drill, and so on) but every path
 * is drawn for this quiz — not traced from another site.
 */

const INK = "#2C2834";

function Backdrop({ color }: { color: string }) {
  return (
    <>
      <circle cx="140" cy="172" r="128" fill={color} />
      <ellipse cx="140" cy="318" rx="64" ry="9" fill={INK} opacity="0.08" />
    </>
  );
}

function Limb({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 16,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI - 90;
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${angle})`}>
      <rect x={-width / 2} y={-2} width={width} height={len + 4} rx={width / 2} fill={color} />
    </g>
  );
}

function Hand({ x, y, skin }: { x: number; y: number; skin: string }) {
  return <circle cx={x} cy={y} r="9" fill={skin} />;
}

function Head({
  cx = 140,
  cy = 108,
  r = 48,
  skin,
  blush,
  mood = "calm",
  glasses,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  skin: string;
  blush: string;
  mood?: "calm" | "soft" | "grin" | "focus";
  glasses?: "rect" | "round" | "sun";
}) {
  const ly = cy + 2;
  const lx = cx - 16;
  const rx = cx + 16;
  return (
    <g>
      <ellipse cx={cx - r + 4} cy={cy + 6} rx="8" ry="11" fill={skin} />
      <ellipse cx={cx + r - 4} cy={cy + 6} rx="8" ry="11" fill={skin} />
      <circle cx={cx} cy={cy} r={r} fill={skin} />
      {mood === "focus" ? (
        <g fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round">
          <path d={`M${lx - 10} ${ly - 14}l14 -4`} />
          <path d={`M${rx - 2} ${ly - 18}l14 4`} />
        </g>
      ) : (
        <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
          <path d={`M${lx - 8} ${ly - 12}c4 -3 10 -3 14 0`} />
          <path d={`M${rx - 6} ${ly - 12}c4 -3 10 -3 14 0`} />
        </g>
      )}
      {mood === "soft" ? (
        <g fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round">
          <path d={`M${lx - 8} ${ly}c4 6 14 6 18 0`} />
          <path d={`M${rx - 8} ${ly}c4 6 14 6 18 0`} />
        </g>
      ) : glasses === "sun" ? null : (
        <g>
          <ellipse cx={lx} cy={ly} rx="3.6" ry="4" fill={INK} />
          <ellipse cx={rx} cy={ly} rx="3.6" ry="4" fill={INK} />
          <circle cx={lx + 1.2} cy={ly - 1.4} r="1.2" fill="#fff" />
          <circle cx={rx + 1.2} cy={ly - 1.4} r="1.2" fill="#fff" />
        </g>
      )}
      <ellipse cx={cx - 28} cy={ly + 12} rx="8" ry="4.2" fill={blush} />
      <ellipse cx={cx + 28} cy={ly + 12} rx="8" ry="4.2" fill={blush} />
      {mood === "grin" ? (
        <path d={`M${cx - 14} ${ly + 16}c5 12 23 12 28 0`} fill="#E9897C" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      ) : mood === "focus" ? (
        <path d={`M${cx - 8} ${ly + 18}h16`} stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
      ) : (
        <path d={`M${cx - 10} ${ly + 16}c4 7 16 7 20 0`} fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
      )}
      {glasses === "rect" ? (
        <g fill="none" stroke={INK} strokeWidth="2.4">
          <rect x={lx - 14} y={ly - 12} width="28" height="20" rx="4" fill="#fff" fillOpacity="0.15" />
          <rect x={rx - 14} y={ly - 12} width="28" height="20" rx="4" fill="#fff" fillOpacity="0.15" />
          <path d={`M${lx + 14} ${ly}h${rx - lx - 28}`} />
        </g>
      ) : null}
      {glasses === "round" ? (
        <g fill="none" stroke={INK} strokeWidth="2.4">
          <circle cx={lx} cy={ly} r="13" fill="#fff" fillOpacity="0.12" />
          <circle cx={rx} cy={ly} r="13" fill="#fff" fillOpacity="0.12" />
          <path d={`M${lx + 13} ${ly}h${rx - lx - 26}`} />
        </g>
      ) : null}
      {glasses === "sun" ? (
        <g>
          <rect x={lx - 16} y={ly - 10} width="30" height="16" rx="6" fill="#243044" />
          <rect x={rx - 14} y={ly - 10} width="30" height="16" rx="6" fill="#243044" />
          <path d={`M${lx + 14} ${ly - 2}h${rx - lx - 28}`} stroke="#243044" strokeWidth="3" />
        </g>
      ) : null}
    </g>
  );
}

function Legs({
  x = 140,
  y = 232,
  pants,
  shoe,
}: {
  x?: number;
  y?: number;
  pants: string;
  shoe: string;
}) {
  return (
    <g>
      <rect x={x - 24} y={y} width="18" height="58" rx="9" fill={pants} />
      <rect x={x + 6} y={y} width="18" height="58" rx="9" fill={pants} />
      <ellipse cx={x - 15} cy={y + 58} rx="16" ry="8" fill={shoe} />
      <ellipse cx={x + 15} cy={y + 58} rx="16" ry="8" fill={shoe} />
    </g>
  );
}

function PortraitINTJ() {
  const skin = "#F3C7A6";
  return (
    <g>
      <Backdrop color="#EDE4F8" />
      <Legs y={214} pants="#46367A" shoe="#2E2644" />
      <path d="M92 156c-12 34-2 70 22 76h52c24-6 34-42 22-76-14-12-82-12-96 0z" fill="#6B52B0" />
      <path d="M112 160l18 40 8-2-16-42z" fill="#4A3884" />
      <path d="M168 160l-18 40-8-2 16-42z" fill="#4A3884" />
      <path d="M122 156h36l-8 22h-20z" fill="#F7F4FC" />
      <path d="M136 164l6 8-6 24-6-24z" fill="#CDBEF0" />
      <Limb x1={108} y1={176} x2={78} y2={230} color="#6B52B0" />
      <Hand x={78} y={230} skin={skin} />
      <path d="M40 236h200l-16 18H56z" fill="#D4C4F2" />
      <rect x="70" y="252" width="14" height="52" rx="4" fill="#B39ADF" />
      <rect x="196" y="252" width="14" height="52" rx="4" fill="#B39ADF" />
      <g transform="translate(86 208) rotate(-7)">
        <rect width="112" height="48" rx="4" fill="#F8F4EA" />
        <path d="M12 14h46M12 24h78M12 34h36" stroke="#7C6BB8" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="68" y="10" width="32" height="26" fill="none" stroke="#7C6BB8" strokeWidth="1.8" />
      </g>
      <rect x="198" y="214" width="34" height="16" rx="8" fill="#E7D8BC" />
      <ellipse cx="156" cy="236" rx="14" ry="8" fill={skin} />
      <Head cy={100} skin={skin} blush="#F0B4BA" mood="focus" glasses="rect" />
      <path d="M98 96c6-42 26-58 48-54 20 4 34 24 36 50-16-20-36-26-52-16-14 8-26 14-32 20z" fill="#E7E2F4" />
      <path d="M118 62c14-6 32-4 42 6" fill="none" stroke="#CFC6E6" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function PortraitINTP() {
  const skin = "#E7B48E";
  return (
    <g>
      <Backdrop color="#E7E0F6" />
      <Legs pants="#4A4068" shoe="#3A342C" />
      <path d="M96 150c-14 36 0 74 20 80h48c20-6 34-44 20-80-14-14-74-14-88 0z" fill="#7D6CC0" />
      <path d="M118 150h44l-10 22h-24z" fill="#F4EFE6" />
      <Limb x1={108} y1={170} x2={70} y2={214} color="#7D6CC0" />
      <Limb x1={172} y1={170} x2={214} y2={196} color="#7D6CC0" />
      <g transform="translate(46 176) rotate(-12)">
        <rect width="40" height="52" rx="3" fill="#F7F1E6" />
        <rect width="10" height="52" fill="#5C478F" />
        <path d="M16 14h16M16 24h16M16 34h10" stroke="#C4B2EE" strokeWidth="2" strokeLinecap="round" />
      </g>
      <Hand x={62} y={214} skin={skin} />
      <g transform="translate(188 150)">
        <rect x="14" y="0" width="12" height="16" rx="3" fill="#F4F0FA" stroke={INK} strokeWidth="1.6" />
        <path d="M8 16h24c10 12 16 26 8 40-8 16-32 16-40 0-8-14-2-28 8-40z" fill="#C9B6F2" stroke={INK} strokeWidth="1.6" />
        <ellipse cx="20" cy="48" rx="14" ry="6" fill="#8E74D4" opacity="0.55" />
        <circle cx="16" cy="36" r="3" fill="#fff" opacity="0.7" />
        <circle cx="24" cy="42" r="2" fill="#fff" opacity="0.7" />
      </g>
      <Hand x={206} y={188} skin={skin} />
      <Head cy={104} skin={skin} blush="#E8A898" mood="calm" glasses="round" />
      <g fill="#3E342C">
        <circle cx="112" cy="64" r="14" />
        <circle cx="140" cy="54" r="16" />
        <circle cx="168" cy="66" r="13" />
        <path d="M96 108c4-40 24-58 44-58s40 18 44 58c-12-18-28-26-44-26s-32 8-44 26z" />
      </g>
    </g>
  );
}

function PortraitENTJ() {
  const skin = "#F6D0B4";
  return (
    <g>
      <Backdrop color="#F0E4F8" />
      <Legs pants="#3A305C" shoe="#2A2438" />
      <path d="M90 148c-8 40 4 78 26 82h48c22-4 34-42 26-82-16-12-84-12-100 0z" fill="#5C478F" />
      <path d="M108 154l22 46 10-4-18-46z" fill="#3E326C" />
      <path d="M172 154l-22 46-10-4 18-46z" fill="#3E326C" />
      <path d="M124 148h32l-6 20h-20z" fill="#F8F4FC" />
      <path d="M136 156l5 7-5 22-5-22z" fill="#E7C56A" />
      <Limb x1={104} y1={176} x2={78} y2={214} color="#5C478F" />
      <ellipse cx="74" cy="228" rx="16" ry="10" fill={skin} />
      <Limb x1={176} y1={164} x2={214} y2={118} color="#5C478F" />
      <Hand x={214} y={112} skin={skin} />
      <path d="M214 96l18 10-16 8z" fill={skin} />
      <Head cy={100} skin={skin} blush="#F0B0B0" mood="focus" />
      <path d="M96 96c2-40 22-56 44-56s42 16 44 56c-12-16-28-22-44-22s-32 6-44 22z" fill="#2C2438" />
      <path d="M168 78c16 6 26 20 22 34-14-8-26-6-36 2 4-14 8-26 14-36z" fill="#2C2438" />
    </g>
  );
}

function PortraitENTP() {
  const skin = "#D9A57C";
  return (
    <g>
      <Backdrop color="#EFE6FA" />
      <path d="M78 214h124l-14 78H92z" fill="#CDBEF0" />
      <rect x="108" y="214" width="64" height="12" rx="3" fill="#8B6AD2" />
      <path d="M96 228h18M166 228h18" stroke="#6B52B0" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 156c-8 28 2 52 18 56h44c16-4 26-28 18-56-12-10-68-10-80 0z" fill="#8B6AD2" />
      <path d="M126 156h28v16h-28z" fill="#FFF6D4" />
      <Limb x1={112} y1={176} x2={86} y2={210} color="#8B6AD2" />
      <Hand x={86} y={210} skin={skin} />
      <Limb x1={168} y1={164} x2={206} y2={124} color="#8B6AD2" />
      <Hand x={206} y={118} skin={skin} />
      <polygon points="188,92 194,108 210,108 198,118 202,134 188,124 174,134 178,118 166,108 182,108" fill="#FFF6D4" stroke={INK} strokeWidth="1.4" />
      <Head cy={108} skin={skin} blush="#E89888" mood="grin" />
      <g fill="#4A3428">
        <path d="M96 112c4-42 24-60 44-60s40 18 44 60c-12-18-28-26-44-26s-32 8-44 26z" />
        <circle cx="100" cy="100" r="13" />
        <circle cx="180" cy="100" r="13" />
      </g>
    </g>
  );
}

function PortraitINFJ() {
  const skin = "#F3C7A8";
  return (
    <g>
      <Backdrop color="#E5F6EA" />
      <rect x="206" y="78" width="10" height="214" rx="5" fill="#8D6A3A" />
      <circle cx="211" cy="70" r="14" fill="#7DB88A" />
      <circle cx="211" cy="70" r="6" fill="#F6E7A8" />
      <path d="M78 168c-18 48-4 112 28 124h68c32-12 46-76 28-124-18-16-106-16-124 0z" fill="#3E8A5C" />
      <path d="M128 168h24l-4 108h-16z" fill="#F6E7A8" />
      <circle cx="140" cy="230" r="6" fill="#C6A15A" />
      <Limb x1={168} y1={190} x2={206} y2={168} color="#3E8A5C" width={18} />
      <Hand x={204} y={160} skin={skin} />
      <Head cy={112} skin={skin} blush="#F0B4B4" mood="soft" />
      <g fill="#F7F4EE">
        <path d="M92 120c0-48 22-70 48-70s48 22 48 70c-8 20-20 28-48 28s-40-8-48-28z" />
        <path d="M96 130c-6 40-2 80 10 110 12-30 14-70 8-100z" />
        <path d="M184 130c6 40 2 80-10 110-12-30-14-70-8-100z" />
        <ellipse cx="140" cy="156" rx="30" ry="18" />
        <ellipse cx="116" cy="150" rx="14" ry="12" />
        <ellipse cx="164" cy="150" rx="14" ry="12" />
      </g>
      <path d="M116 118c4 5 12 5 16 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M148 118c4 5 12 5 16 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function PortraitINFP() {
  const skin = "#C98662";
  return (
    <g>
      <Backdrop color="#E7F7EC" />
      <Legs pants="#4E6E58" shoe="#3A302C" />
      <path d="M98 154c-12 36 0 70 18 76h48c18-6 30-40 18-76-12-12-72-12-84 0z" fill="#7DB88A" />
      <path d="M120 154h40l-8 18h-24z" fill="#F7F3EA" />
      <Limb x1={110} y1={176} x2={76} y2={220} color="#7DB88A" />
      <Hand x={76} y={220} skin={skin} />
      <Limb x1={170} y1={176} x2={206} y2={200} color="#7DB88A" />
      <Hand x={200} y={196} skin={skin} />
      <g transform="translate(196 150)">
        <path d="M18 70c0-28 4-48 4-48" stroke="#3E7A4C" strokeWidth="3" fill="none" />
        <circle cx="22" cy="16" r="12" fill="#F2A3B5" />
        <circle cx="22" cy="16" r="5" fill="#F6D56A" />
      </g>
      <Head cy={104} skin={skin} blush="#E8A090" mood="soft" />
      <g fill="#3A2A28">
        <path d="M96 108c4-40 22-58 44-58s40 18 44 58c-10-16-26-24-44-24s-34 8-44 24z" />
        <path d="M100 112c8-6 18-14 40-14s32 8 40 14c-10-4-22-8-40-8s-30 4-40 8z" />
      </g>
      <g>
        <circle cx="112" cy="62" r="8" fill="#F2A3B5" />
        <circle cx="112" cy="62" r="3" fill="#F6D56A" />
        <circle cx="142" cy="52" r="9" fill="#F6D56A" />
        <circle cx="142" cy="52" r="3.5" fill="#F2A3B5" />
        <circle cx="170" cy="64" r="8" fill="#F2A3B5" />
        <circle cx="170" cy="64" r="3" fill="#7DB88A" />
      </g>
      <g transform="translate(214 118)">
        <ellipse cx="0" cy="6" rx="4" ry="8" fill="#7DB88A" transform="rotate(-24)" />
        <ellipse cx="10" cy="6" rx="4" ry="8" fill="#7DB88A" transform="rotate(24)" />
        <circle cx="5" cy="8" r="2.4" fill="#3E6B50" />
      </g>
    </g>
  );
}

function PortraitENFJ() {
  const skin = "#F6D0B0";
  return (
    <g>
      <Backdrop color="#E3F6E8" />
      <Legs pants="#2F5E44" shoe="#2C3830" />
      <path d="M92 150c-12 38 2 74 24 78h48c22-4 36-40 24-78-16-12-80-12-96 0z" fill="#3F8F62" />
      <path d="M124 150h32v18h-32z" fill="#F8E7C4" />
      <path d="M118 196h44v10h-44z" fill="#C6A15A" />
      <Limb x1={108} y1={172} x2={72} y2={210} color="#3F8F62" />
      <Hand x={70} y={210} skin={skin} />
      <Limb x1={176} y1={168} x2={210} y2={150} color="#3F8F62" />
      <Hand x={208} y={146} skin={skin} />
      <g transform="translate(198 52)">
        <rect x="14" y="0" width="8" height="78" rx="2" fill="#E7EEE8" stroke={INK} strokeWidth="2" />
        <rect x="4" y="74" width="28" height="8" rx="2" fill="#C6A15A" />
        <rect x="14" y="82" width="8" height="14" rx="2" fill="#8D6A32" />
      </g>
      <Head cy={102} skin={skin} blush="#F0A8B4" mood="grin" />
      <path d="M98 100c4-38 22-54 42-54s38 16 42 54c-12-16-26-22-42-22s-30 6-42 22z" fill="#3A2E32" />
    </g>
  );
}

function PortraitENFP() {
  const skin = "#E8B48A";
  return (
    <g>
      <Backdrop color="#E8F8EC" />
      <ellipse cx="140" cy="308" rx="36" ry="7" fill={INK} opacity="0.06" />
      <g transform="translate(168 132)">
        <rect width="46" height="58" rx="14" fill="#3E7A4C" />
        <rect x="8" y="10" width="30" height="22" rx="6" fill="#62B56C" />
        <circle cx="23" cy="40" r="4" fill="#FFE08A" />
      </g>
      <Limb x1={150} y1={176} x2={176} y2={214} color="#3E7A4C" width={18} />
      <Limb x1={176} y1={214} x2={156} y2={248} color="#3E7A4C" width={16} />
      <ellipse cx="150" cy="254" rx="16" ry="8" fill="#4A3428" />
      <Limb x1={124} y1={178} x2={96} y2={214} color="#3E7A4C" width={18} />
      <Limb x1={96} y1={214} x2={118} y2={246} color="#3E7A4C" width={16} />
      <ellipse cx="124" cy="252" rx="16" ry="8" fill="#4A3428" />
      <path d="M108 132c-10 20 0 48 16 52h36c14-4 24-28 16-50-10-12-58-14-68-2z" fill="#62B56C" />
      <path d="M124 134h28l-4 12h-20z" fill="#FFE08A" />
      <Limb x1={118} y1={150} x2={78} y2={96} color="#62B56C" />
      <Hand x={74} y={90} skin={skin} />
      <Limb x1={164} y1={150} x2={206} y2={132} color="#62B56C" />
      <Hand x={208} y={128} skin={skin} />
      <Head cy={92} r={46} skin={skin} blush="#EEA088" mood="grin" />
      <g fill="#5A341F">
        <circle cx="104" cy="70" r="14" />
        <circle cx="128" cy="52" r="15" />
        <circle cx="154" cy="48" r="16" />
        <circle cx="178" cy="64" r="14" />
        <circle cx="96" cy="92" r="12" />
        <circle cx="186" cy="90" r="12" />
        <path d="M98 96c2-28 20-40 42-40s40 12 44 40c-12-12-26-16-44-16s-32 4-42 16z" />
      </g>
    </g>
  );
}

function PortraitISTJ() {
  const skin = "#F4D2B4";
  return (
    <g>
      <Backdrop color="#E6F2FC" />
      <Legs pants="#2E4E74" shoe="#2A3340" />
      <path d="M96 150c-12 36 0 72 20 78h48c20-6 32-42 20-78-14-12-74-12-88 0z" fill="#4F82C4" />
      <path d="M116 154l16 36 8-2-14-38z" fill="#2E4E74" />
      <path d="M164 154l-16 36-8-2 14-38z" fill="#2E4E74" />
      <path d="M124 150h32l-6 16h-20z" fill="#F7F5F2" />
      <path d="M136 156l4 6-4 16-4-16z" fill="#D5E4F4" />
      <Limb x1={112} y1={176} x2={86} y2={210} color="#4F82C4" />
      <Limb x1={168} y1={176} x2={198} y2={206} color="#4F82C4" />
      <g transform="translate(78 168) rotate(-8)">
        <rect width="92" height="112" rx="8" fill="#fff" stroke={INK} strokeWidth="2.2" />
        <rect x="28" y="-8" width="36" height="16" rx="4" fill="#D5E4F4" stroke={INK} strokeWidth="2" />
        <path d="M16 28h60M16 44h60M16 60h60M16 76h40" stroke="#7FA4D0" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 28l6 6 10-12" fill="none" stroke="#3D74B0" strokeWidth="2.4" />
      </g>
      <Hand x={86} y={250} skin={skin} />
      <Hand x={168} y={246} skin={skin} />
      <Head cy={102} skin={skin} blush="#F0B4AE" mood="calm" />
      <path d="M98 100c4-40 22-56 42-56s38 16 42 56c-8-18-24-26-42-26s-34 8-42 26z" fill="#2A3344" />
      <path d="M108 92c16-16 40-16 58-4" fill="#2A3344" />
    </g>
  );
}

function PortraitISFJ() {
  const skin = "#E0A67E";
  return (
    <g>
      <Backdrop color="#E8F4FC" />
      <Legs pants="#3E6488" shoe="#3A4048" />
      <path d="M96 152c-14 40 0 78 22 82h44c22-4 36-42 22-82-14-14-74-14-88 0z" fill="#7EADD8" />
      <path d="M118 176h44l-6 52h-32z" fill="#FFF8F4" />
      <Limb x1={108} y1={176} x2={70} y2={210} color="#7EADD8" />
      <Limb x1={174} y1={174} x2={214} y2={196} color="#7EADD8" />
      <g transform="translate(52 188)">
        <circle cx="22" cy="28" r="30" fill="#F7FBFF" stroke="#3D74B0" strokeWidth="5" />
        <path d="M22 16c0-8 12-8 12 2 0-10 12-10 12-2 0 12-12 18-12 18s-12-6-12-18z" fill="#E07A8C" />
      </g>
      <Hand x={78} y={214} skin={skin} />
      <g transform="translate(206 168)">
        <path d="M10 36c0-20 2-32 2-32" stroke="#3E7A4C" strokeWidth="3" />
        <circle cx="12" cy="8" r="10" fill="#F2A3B5" />
        <circle cx="12" cy="8" r="4" fill="#F6D56A" />
      </g>
      <Hand x={214} y={196} skin={skin} />
      <Head cy={104} skin={skin} blush="#E89898" mood="soft" />
      <g fill="#4A3034">
        <circle cx="140" cy="58" r="16" />
        <path d="M96 108c2-40 22-58 44-58s42 18 44 58c-12-16-28-24-44-24s-32 8-44 24z" />
      </g>
    </g>
  );
}

function PortraitESTJ() {
  const skin = "#C6865A";
  return (
    <g>
      <Backdrop color="#E5F1FC" />
      <Legs pants="#2A4C72" shoe="#2A3038" />
      <path d="M92 148c-10 38 2 76 24 80h48c22-4 34-42 24-80-16-12-80-12-96 0z" fill="#3D74B0" />
      <path d="M114 152l16 38 8-2-14-40z" fill="#2A4C72" />
      <path d="M166 152l-16 38-8-2 14-40z" fill="#2A4C72" />
      <path d="M124 148h32l-6 18h-20z" fill="#F4F7FB" />
      <path d="M136 154l5 6-5 18-5-18z" fill="#F0D48A" />
      <Limb x1={108} y1={176} x2={74} y2={228} color="#3D74B0" />
      <g transform="translate(46 214)">
        <rect width="40" height="30" rx="4" fill="#2E4E74" />
        <rect x="12" y="-8" width="16" height="10" rx="3" fill="#2E4E74" />
        <rect x="4" y="8" width="32" height="3" fill="#F0D48A" />
      </g>
      <Hand x={78} y={220} skin={skin} />
      <Limb x1={176} y1={164} x2={214} y2={132} color="#3D74B0" />
      <Hand x={210} y={128} skin={skin} />
      <g transform="translate(196 96) rotate(18)">
        <polygon points="0,16 36,0 36,40 0,24" fill="#F4E2A8" stroke={INK} strokeWidth="1.6" />
        <rect x="32" y="8" width="16" height="24" rx="4" fill="#3D74B0" />
        <path d="M52 12c10 4 10 16 0 20" fill="none" stroke={INK} strokeWidth="2" />
      </g>
      <Head cy={100} skin={skin} blush="#D98B78" mood="focus" />
      <path d="M100 98c2-32 18-46 40-46s38 14 40 46c-10-14-24-18-40-18s-30 4-40 18z" fill="#2A241F" />
    </g>
  );
}

function PortraitESFJ() {
  const skin = "#F3C2A4";
  return (
    <g>
      <Backdrop color="#EAF5FD" />
      <Legs pants="#3E688E" shoe="#4A403C" />
      <path d="M96 150c-12 38 0 76 22 80h44c22-4 34-42 22-80-14-12-74-12-88 0z" fill="#6AA4D4" />
      <path d="M116 176h48l-4 48h-40z" fill="#FFF0F3" />
      <Limb x1={112} y1={176} x2={96} y2={214} color="#6AA4D4" />
      <Limb x1={168} y1={176} x2={186} y2={214} color="#6AA4D4" />
      <g transform="translate(78 196)">
        <ellipse cx="62" cy="28" rx="58" ry="10" fill="#E7D3B0" />
        <rect x="28" y="28" width="68" height="10" rx="3" fill="#D7C09A" />
        <path d="M40 28c0-16 16-22 22-22s22 6 22 22" fill="#F7C5D4" />
        <path d="M44 16c6-10 28-10 34 0" fill="#FFF6F8" />
        <circle cx="62" cy="8" r="6" fill="#E25B5B" />
        <rect x="60" y="0" width="4" height="8" fill="#3E7A4C" />
      </g>
      <Hand x={96} y={214} skin={skin} />
      <Hand x={186} y={214} skin={skin} />
      <Head cy={102} skin={skin} blush="#F0A8A0" mood="grin" />
      <g fill="#5A382C">
        <path d="M92 108c2-44 24-62 48-62s46 18 48 62c-8-16-24-24-48-24s-40 8-48 24z" />
        <rect x="92" y="100" width="22" height="64" rx="11" />
        <rect x="166" y="100" width="22" height="64" rx="11" />
      </g>
    </g>
  );
}

function PortraitISTP() {
  const skin = "#8D5A3C";
  return (
    <g>
      <Backdrop color="#FFF4D4" />
      <Legs pants="#5C5348" shoe="#2C2824" />
      <path d="M96 150c-10 36 2 72 20 76h48c18-4 30-40 20-76-14-12-74-12-88 0z" fill="#E0A020" />
      <path d="M124 152h32v18h-32z" fill="#FFF8E8" />
      <path d="M112 186h56v34c0 8-8 12-14 12h-28c-6 0-14-4-14-12z" fill="#C47E12" />
      <Limb x1={112} y1={174} x2={86} y2={206} color="#E0A020" />
      <Limb x1={172} y1={170} x2={214} y2={188} color="#E0A020" />
      <g transform="translate(150 168) rotate(16)">
        <rect x="0" y="8" width="46" height="28" rx="8" fill="#4A433C" />
        <rect x="40" y="14" width="28" height="16" rx="4" fill="#D5D0C8" />
        <polygon points="68,10 92,22 68,34" fill="#C9C3BC" />
        <circle cx="16" cy="22" r="5" fill="#F2C14E" />
        <path d="M8 8v-10M20 6V-2" stroke="#4A433C" strokeWidth="3" strokeLinecap="round" />
      </g>
      <Hand x={96} y={200} skin={skin} />
      <Hand x={188} y={186} skin={skin} />
      <Head cy={102} skin={skin} blush="#C47D68" mood="calm" />
      <g fill="#241C18">
        <path d="M98 100c2-34 18-48 42-48s40 14 42 48c-10-14-26-20-42-20s-32 6-42 20z" />
        <ellipse cx="122" cy="62" rx="10" ry="14" />
      </g>
      <g>
        <path d="M108 78h64" stroke="#241C18" strokeWidth="4" strokeLinecap="round" />
        <circle cx="124" cy="78" r="11" fill="#D7F1F8" stroke={INK} strokeWidth="2.2" />
        <circle cx="156" cy="78" r="11" fill="#D7F1F8" stroke={INK} strokeWidth="2.2" />
        <path d="M135 78h10" stroke={INK} strokeWidth="2.2" />
      </g>
    </g>
  );
}

function PortraitISFP() {
  const skin = "#F6D7C0";
  return (
    <g>
      <Backdrop color="#FFF6DC" />
      <Legs pants="#C48A3A" shoe="#4A3A34" />
      <path d="M98 152c-12 36 0 72 18 76h48c18-4 30-40 18-76-12-12-72-12-84 0z" fill="#F2C14E" />
      <path d="M120 152h40l-8 16h-24z" fill="#FFF8EE" />
      <Limb x1={110} y1={176} x2={72} y2={214} color="#F2C14E" />
      <Limb x1={172} y1={174} x2={210} y2={196} color="#F2C14E" />
      <g transform="translate(40 186) rotate(-12)">
        <ellipse cx="28" cy="26" rx="30" ry="22" fill="#F7F1E6" stroke={INK} strokeWidth="2" />
        <circle cx="40" cy="30" r="6" fill="#F7F1E6" stroke={INK} strokeWidth="2" />
        <circle cx="16" cy="18" r="5" fill="#F08A3C" />
        <circle cx="30" cy="14" r="5" fill="#7DB88A" />
        <circle cx="40" cy="22" r="5" fill="#7C6BB8" />
        <circle cx="28" cy="30" r="5" fill="#E07A8C" />
      </g>
      <Hand x={78} y={214} skin={skin} />
      <path d="M206 150l16 46" stroke="#8D6A32" strokeWidth="4" strokeLinecap="round" />
      <path d="M214 146l14 8-6 10z" fill="#E07A8C" />
      <Hand x={206} y={196} skin={skin} />
      <Head cy={104} skin={skin} blush="#F3B4B4" mood="soft" />
      <g fill="#3D2C32">
        <path d="M96 108c4-40 22-56 44-56s40 16 44 56c-12-16-28-22-44-22s-32 6-44 22z" />
        <circle cx="108" cy="86" r="12" />
        <circle cx="172" cy="86" r="12" />
      </g>
      <ellipse cx="150" cy="70" rx="34" ry="14" fill="#3D2C32" />
      <circle cx="178" cy="66" r="5" fill="#E07A8C" />
    </g>
  );
}

function PortraitESTP() {
  const skin = "#D3926A";
  return (
    <g>
      <Backdrop color="#FFF3CC" />
      <Legs pants="#4E463C" shoe="#2C2824" />
      <path d="M92 148c-10 38 4 76 24 80h48c20-4 34-42 24-80-16-12-80-12-96 0z" fill="#E39A1A" />
      <path d="M126 150h28v16h-28z" fill="#FFF6D8" />
      <Limb x1={108} y1={174} x2={74} y2={214} color="#E39A1A" />
      <Hand x={74} y={214} skin={skin} />
      <Limb x1={174} y1={168} x2={200} y2={196} color="#E39A1A" />
      <g transform="translate(168 176)">
        <rect width="62" height="40" rx="8" fill="#2C3444" />
        <rect x="8" y="-8" width="20" height="12" rx="3" fill="#3A4458" />
        <circle cx="34" cy="22" r="13" fill="#8EC6E0" />
        <circle cx="34" cy="22" r="6" fill="#243044" />
        <circle cx="30" cy="18" r="3" fill="#fff" opacity="0.7" />
      </g>
      <Hand x={188} y={196} skin={skin} />
      <Head cy={100} skin={skin} blush="#E89080" mood="grin" glasses="sun" />
      <g fill="#2C211C">
        <path d="M98 96c2-36 20-50 42-50s40 14 42 50c-10-14-26-20-42-20s-32 6-42 20z" />
        <polygon points="140,46 154,78 126,78" />
        <polygon points="108,62 126,84 98,92" />
        <polygon points="176,60 186,92 156,82" />
      </g>
    </g>
  );
}

function PortraitESFP() {
  const skin = "#F0BE98";
  return (
    <g>
      <Backdrop color="#FFF5D8" />
      <rect x="116" y="228" width="18" height="58" rx="9" fill="#D4892A" />
      <Limb x1={156} y1={236} x2={196} y2={268} color="#D4892A" width={16} />
      <ellipse cx="125" cy="288" rx="16" ry="8" fill="#4A342C" />
      <ellipse cx="198" cy="276" rx="16" ry="8" fill="#4A342C" />
      <path d="M96 150c-12 34 0 70 20 74h48c20-4 32-40 20-74-14-12-74-12-88 0z" fill="#F0B429" />
      <path d="M124 150h32v16h-32z" fill="#FFF8E4" />
      <Limb x1={112} y1={168} x2={74} y2={112} color="#F0B429" />
      <Limb x1={172} y1={168} x2={214} y2={118} color="#F0B429" />
      <Maraca x={48} y={78} />
      <Maraca x={198} y={72} flip />
      <Hand x={74} y={112} skin={skin} />
      <Hand x={210} y={116} skin={skin} />
      <Head cy={102} skin={skin} blush="#F0A0B0" mood="grin" />
      <g fill="#4E2C28">
        <path d="M98 104c2-40 22-56 42-56s40 16 42 56c-12-16-26-22-42-22s-30 6-42 22z" />
        <ellipse cx="196" cy="150" rx="14" ry="32" />
        <circle cx="188" cy="112" r="8" fill="#FFE08A" />
      </g>
    </g>
  );
}

function Maraca({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <rect x="18" y="28" width="7" height="26" rx="3" fill="#C6A15A" />
      <ellipse cx="21" cy="16" rx="16" ry="18" fill={flip ? "#F08A3C" : "#E25B5B"} />
      <path d="M10 10h22M8 18h26" stroke="#FFF6D4" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

const PORTRAITS: Record<TypeCode, () => ReactElement> = {
  INTJ: PortraitINTJ,
  INTP: PortraitINTP,
  ENTJ: PortraitENTJ,
  ENTP: PortraitENTP,
  INFJ: PortraitINFJ,
  INFP: PortraitINFP,
  ENFJ: PortraitENFJ,
  ENFP: PortraitENFP,
  ISTJ: PortraitISTJ,
  ISFJ: PortraitISFJ,
  ESTJ: PortraitESTJ,
  ESFJ: PortraitESFJ,
  ISTP: PortraitISTP,
  ISFP: PortraitISFP,
  ESTP: PortraitESTP,
  ESFP: PortraitESFP,
};

export function PersonaAvatar({
  code,
  className,
  label,
}: {
  code: string;
  className?: string;
  label?: string;
}) {
  const type = (code.slice(0, 4) in PORTRAITS ? code.slice(0, 4) : "ENFP") as TypeCode;
  const Draw = PORTRAITS[type];
  return (
    <svg viewBox="0 0 280 340" className={cn("h-auto w-full", className)} role="img" aria-label={label ?? `${type} 的原创扁平画像`}>
      <Draw />
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
