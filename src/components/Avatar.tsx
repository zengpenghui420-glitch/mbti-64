import type { ReactElement } from "react";
import type { TypeCode } from "@/lib/score";
import { cn } from "cn";

/**
 * Faceted portraits. Every head, limb, hair mass, and prop is a straight
 * polygon drawn for this quiz. Poses still match the sixteen classic roles.
 */

const INK = "#2C2834";

function diamond(cx: number, cy: number, halfW: number, halfH: number): string {
  return `${cx},${cy - halfH} ${cx + halfW},${cy} ${cx},${cy + halfH} ${cx - halfW},${cy}`;
}

function Backdrop({ color }: { color: string }) {
  return (
    <>
      <polygon points="140,12 274,168 140,328 6,168" fill={color} />
      <polygon points="86,312 194,312 176,326 104,326" fill={INK} opacity="0.08" />
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
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (width / 2);
  const ny = (dx / len) * (width / 2);
  const points = `${x1 + nx},${y1 + ny} ${x2 + nx},${y2 + ny} ${x2 - nx},${y2 - ny} ${x1 - nx},${y1 - ny}`;
  return <polygon points={points} fill={color} />;
}

function Hand({ x, y, skin, s = 1 }: { x: number; y: number; skin: string; s?: number }) {
  return <polygon points={diamond(x, y, 10 * s, 12 * s)} fill={skin} />;
}

function Head({
  cx = 140,
  cy = 104,
  skin,
  blush,
  mood = "calm",
  glasses,
}: {
  cx?: number;
  cy?: number;
  skin: string;
  blush: string;
  mood?: "calm" | "soft" | "grin" | "focus";
  glasses?: "rect" | "gem" | "sun";
}) {
  const lx = cx - 16;
  const right = cx + 16;
  const ly = cy + 2;
  return (
    <g>
      <polygon points={`${cx - 16},${cy + 24} ${cx + 16},${cy + 24} ${cx + 22},${cy + 74} ${cx - 22},${cy + 74}`} fill={skin} />
      <polygon points={`${cx - 50},${cy - 6} ${cx - 74},${cy + 10} ${cx - 46},${cy + 24}`} fill={skin} />
      <polygon points={`${cx + 50},${cy - 6} ${cx + 74},${cy + 10} ${cx + 46},${cy + 24}`} fill={skin} />
      <polygon points={`${cx - 36},${cy - 16} ${cx},${cy - 64} ${cx + 36},${cy - 16}`} fill={skin} />
      <polygon points={`${cx - 56},${cy - 16} ${cx + 56},${cy - 16} ${cx + 60},${cy + 18} ${cx - 60},${cy + 18}`} fill={skin} />
      <polygon points={`${cx - 60},${cy + 18} ${cx + 60},${cy + 18} ${cx},${cy + 64}`} fill={skin} />
      {mood === "focus" ? (
        <g fill="none" stroke={INK} strokeWidth="2.6">
          <path d={`M${lx - 12} ${ly - 16} L${lx + 8} ${ly - 10}`} />
          <path d={`M${right - 6} ${ly - 10} L${right + 14} ${ly - 16}`} />
        </g>
      ) : (
        <g fill="none" stroke={INK} strokeWidth="2.4">
          <path d={`M${lx - 12} ${ly - 16} L${lx + 8} ${ly - 14}`} />
          <path d={`M${right - 8} ${ly - 14} L${right + 12} ${ly - 16}`} />
        </g>
      )}
      {mood === "soft" ? (
        <g fill="none" stroke={INK} strokeWidth="2.6">
          <path d={`M${lx - 8} ${ly - 2} L${lx} ${ly + 6} L${lx + 8} ${ly - 2}`} />
          <path d={`M${right - 8} ${ly - 2} L${right} ${ly + 6} L${right + 8} ${ly - 2}`} />
        </g>
      ) : glasses === "sun" ? null : (
        <g>
          <polygon points={diamond(lx, ly, 4.5, 6)} fill={INK} />
          <polygon points={diamond(right, ly, 4.5, 6)} fill={INK} />
          <polygon points={`${lx},${ly - 4} ${lx + 3},${ly - 1} ${lx + 1},${ly + 1}`} fill="#fff" />
          <polygon points={`${right},${ly - 4} ${right + 3},${ly - 1} ${right + 1},${ly + 1}`} fill="#fff" />
        </g>
      )}
      <polygon points={`${cx - 36},${ly + 10} ${cx - 22},${ly + 6} ${cx - 28},${ly + 18}`} fill={blush} />
      <polygon points={`${cx + 22},${ly + 6} ${cx + 36},${ly + 10} ${cx + 28},${ly + 18}`} fill={blush} />
      {mood === "grin" ? (
        <polygon points={`${cx - 16},${ly + 16} ${cx},${ly + 30} ${cx + 16},${ly + 16} ${cx + 8},${ly + 20} ${cx},${ly + 22} ${cx - 8},${ly + 20}`} fill="#E9897C" stroke={INK} strokeWidth="1.8" />
      ) : mood === "focus" ? (
        <path d={`M${cx - 10} ${ly + 20} H${cx + 10}`} stroke={INK} strokeWidth="2.4" fill="none" />
      ) : (
        <path d={`M${cx - 12} ${ly + 18} L${cx} ${ly + 26} L${cx + 12} ${ly + 18}`} stroke={INK} strokeWidth="2.4" fill="none" />
      )}
      {glasses === "rect" ? (
        <g fill="#fff" fillOpacity="0.16" stroke={INK} strokeWidth="2.4">
          <polygon points={`${lx - 16},${ly - 14} ${lx + 14},${ly - 14} ${lx + 14},${ly + 10} ${lx - 16},${ly + 10}`} />
          <polygon points={`${right - 14},${ly - 14} ${right + 16},${ly - 14} ${right + 16},${ly + 10} ${right - 14},${ly + 10}`} />
          <path d={`M${lx + 14} ${ly - 2} H${right - 14}`} fill="none" />
        </g>
      ) : null}
      {glasses === "gem" ? (
        <g fill="#fff" fillOpacity="0.14" stroke={INK} strokeWidth="2.4">
          <polygon points={diamond(lx, ly, 16, 13)} />
          <polygon points={diamond(right, ly, 16, 13)} />
          <path d={`M${lx + 14} ${ly} H${right - 14}`} fill="none" />
        </g>
      ) : null}
      {glasses === "sun" ? (
        <g>
          <polygon points={`${lx - 18},${ly - 10} ${lx + 16},${ly - 12} ${lx + 14},${ly + 8} ${lx - 20},${ly + 10}`} fill="#243044" />
          <polygon points={`${right - 14},${ly - 12} ${right + 20},${ly - 10} ${right + 18},${ly + 10} ${right - 16},${ly + 8}`} fill="#243044" />
          <path d={`M${lx + 16} ${ly - 1} H${right - 14}`} stroke="#243044" strokeWidth="4" />
        </g>
      ) : null}
    </g>
  );
}

function Legs({
  x = 140,
  y = 226,
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
      <polygon points={`${x - 28},${y} ${x - 8},${y} ${x - 4},${y + 58} ${x - 30},${y + 58}`} fill={pants} />
      <polygon points={`${x + 8},${y} ${x + 28},${y} ${x + 30},${y + 58} ${x + 4},${y + 58}`} fill={pants} />
      <polygon points={`${x - 42},${y + 52} ${x - 4},${y + 50} ${x},${y + 66} ${x - 40},${y + 66}`} fill={shoe} />
      <polygon points={`${x + 4},${y + 50} ${x + 42},${y + 52} ${x + 40},${y + 66} ${x},${y + 66}`} fill={shoe} />
    </g>
  );
}

function Suit({
  cloth,
  lapel,
  shirt,
  tie,
}: {
  cloth: string;
  lapel: string;
  shirt: string;
  tie: string;
}) {
  return (
    <g>
      <polygon points="90,150 190,150 174,232 106,232" fill={cloth} />
      <polygon points="118,150 140,196 128,150" fill={lapel} />
      <polygon points="162,150 140,196 152,150" fill={lapel} />
      <polygon points="124,150 156,150 150,174 130,174" fill={shirt} />
      <polygon points="136,156 144,156 140,196" fill={tie} />
    </g>
  );
}

function Bloom({ x, y, petal, core, s = 1 }: { x: number; y: number; petal: string; core: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points={`0,${-14 * s} ${7 * s},${-3 * s} 0,0`} fill={petal} />
      <polygon points={`${14 * s},0 ${3 * s},${7 * s} 0,0`} fill={petal} />
      <polygon points={`0,${14 * s} ${-7 * s},${3 * s} 0,0`} fill={petal} />
      <polygon points={`${-14 * s},0 ${-3 * s},${-7 * s} 0,0`} fill={petal} />
      <polygon points={diamond(0, 0, 5 * s, 5 * s)} fill={core} />
    </g>
  );
}

function PortraitINTJ() {
  const skin = "#F3C7A6";
  return (
    <g>
      <Backdrop color="#EDE4F8" />
      <Legs y={214} pants="#46367A" shoe="#2E2644" />
      <Suit cloth="#6B52B0" lapel="#4A3884" shirt="#F7F4FC" tie="#CDBEF0" />
      <Limb x1={112} y1={178} x2={78} y2={226} color="#6B52B0" />
      <polygon points="36,230 246,230 228,250 54,250" fill="#D4C4F2" />
      <polygon points="68,250 84,250 80,308 64,308" fill="#B39ADF" />
      <polygon points="196,250 212,250 216,308 200,308" fill="#B39ADF" />
      <g transform="translate(74 196) rotate(-6)">
        <polygon points="0,0 122,0 122,54 0,54" fill="#F8F4EA" />
        <path d="M12 14 H62 M12 26 H96 M12 38 H48" stroke="#7C6BB8" strokeWidth="2.4" />
        <polygon points="72,10 108,10 108,40 72,40" fill="none" stroke="#7C6BB8" strokeWidth="2" />
        <path d="M72 10 L108 40 M108 10 L72 40" stroke="#7C6BB8" strokeWidth="1.4" />
      </g>
      <polygon points="146,222 174,220 166,238 150,236" fill={skin} />
      <Hand x={78} y={230} skin={skin} />
      <Head cy={98} skin={skin} blush="#F0B4BA" mood="focus" glasses="rect" />
      <g fill="#E7E2F4">
        <polygon points="102,78 128,40 154,46 140,86" />
        <polygon points="128,40 176,34 168,78 154,46" />
        <polygon points="176,34 198,72 170,96 168,78" />
        <polygon points="102,78 78,58 96,46" />
        <polygon points="96,46 128,40 110,62" />
      </g>
    </g>
  );
}

function PortraitINTP() {
  const skin = "#E7B48E";
  return (
    <g>
      <Backdrop color="#E7E0F6" />
      <Legs pants="#4A4068" shoe="#3A342C" />
      <polygon points="96,150 184,150 170,232 110,232" fill="#7D6CC0" />
      <polygon points="120,150 160,150 152,176 128,176" fill="#F4EFE6" />
      <Limb x1={112} y1={172} x2={70} y2={214} color="#7D6CC0" />
      <Limb x1={170} y1={168} x2={206} y2={188} color="#7D6CC0" />
      <g transform="translate(40 168) rotate(-10)">
        <polygon points="0,4 46,0 48,58 2,54" fill="#F7F1E6" />
        <polygon points="0,4 12,6 12,56 2,54" fill="#5C478F" />
        <path d="M18 16 H36 M18 28 H36 M18 40 H30" stroke="#C4B2EE" strokeWidth="2.2" />
      </g>
      <Hand x={64} y={214} skin={skin} />
      <g transform="translate(186 146)">
        <polygon points="14,0 28,0 26,16 34,28 30,62 8,62 4,28 16,16" fill="#C9B6F2" stroke={INK} strokeWidth="1.6" />
        <polygon points="16,0 26,0 24,16 18,16" fill="#F4F0FA" stroke={INK} strokeWidth="1.6" />
        <polygon points="10,40 28,36 26,56 12,58" fill="#8E74D4" opacity="0.55" />
        <polygon points="14,34 18,30 20,36" fill="#fff" opacity="0.8" />
        <polygon points="22,42 26,38 28,46" fill="#fff" opacity="0.75" />
      </g>
      <Hand x={198} y={186} skin={skin} />
      <Head cy={102} skin={skin} blush="#E8A898" mood="calm" glasses="gem" />
      <g fill="#3E342C">
        <polygon points="108,70 132,36 150,48" />
        <polygon points="126,44 158,28 168,58" />
        <polygon points="156,36 190,48 176,78" />
        <polygon points="96,96 118,52 140,78" />
        <polygon points="184,96 162,54 146,80" />
        <polygon points="100,110 140,70 180,110 164,92 140,100 116,92" />
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
      <Suit cloth="#5C478F" lapel="#3E326C" shirt="#F8F4FC" tie="#E7C56A" />
      <Limb x1={108} y1={176} x2={74} y2={220} color="#5C478F" />
      <polygon points="58,214 92,208 86,232 52,228" fill={skin} />
      <Limb x1={176} y1={162} x2={214} y2={112} color="#5C478F" />
      <Hand x={214} y={104} skin={skin} s={0.85} />
      <polygon points="214,86 236,100 214,108" fill={skin} />
      <Head cy={98} skin={skin} blush="#F0B0B0" mood="focus" />
      <g fill="#2C2438">
        <polygon points="98,90 140,40 182,90 166,72 140,64 114,72" />
        <polygon points="166,70 210,78 196,112 172,96" />
        <polygon points="102,78 86,96 112,100" />
      </g>
    </g>
  );
}

function PortraitENTP() {
  const skin = "#D9A57C";
  return (
    <g>
      <Backdrop color="#EFE6FA" />
      <polygon points="72,214 208,214 194,304 86,304" fill="#CDBEF0" />
      <polygon points="108,204 172,204 168,220 112,220" fill="#8B6AD2" />
      <polygon points="92,226 108,226 104,248 88,248" fill="#6B52B0" />
      <polygon points="172,226 188,226 192,248 176,248" fill="#6B52B0" />
      <polygon points="102,148 178,148 168,214 112,214" fill="#8B6AD2" />
      <polygon points="126,148 154,148 154,166 126,166" fill="#FFF6D4" />
      <Limb x1={114} y1={170} x2={84} y2={206} color="#8B6AD2" />
      <Hand x={82} y={210} skin={skin} />
      <Limb x1={168} y1={160} x2={208} y2={118} color="#8B6AD2" />
      <Hand x={208} y={110} skin={skin} />
      <polygon points="188,78 196,98 214,98 200,110 206,128 188,116 170,128 176,110 162,98 180,98" fill="#FFF6D4" stroke={INK} strokeWidth="1.5" />
      <Head cy={108} skin={skin} blush="#E89888" mood="grin" />
      <g fill="#4A3428">
        <polygon points="104,78 132,42 156,52" />
        <polygon points="132,46 168,38 160,70" />
        <polygon points="160,46 196,62 176,88" />
        <polygon points="96,108 124,64 140,90" />
        <polygon points="184,108 160,66 148,92" />
        <polygon points="98,112 140,78 182,112 140,96" />
      </g>
    </g>
  );
}

function PortraitINFJ() {
  const skin = "#F3C7A8";
  return (
    <g>
      <Backdrop color="#E5F6EA" />
      <polygon points="204,48 216,48 214,292 206,292" fill="#8D6A3A" />
      <polygon points={diamond(210, 36, 16, 20)} fill="#7DB88A" />
      <polygon points={diamond(210, 36, 6, 8)} fill="#F6E7A8" />
      <polygon points="78,168 202,168 184,312 96,312" fill="#3E8A5C" />
      <polygon points="126,168 154,168 148,300 132,300" fill="#F6E7A8" />
      <polygon points={diamond(140, 230, 8, 8)} fill="#C6A15A" />
      <Limb x1={168} y1={196} x2={204} y2={160} color="#3E8A5C" width={18} />
      <Hand x={204} y={150} skin={skin} />
      <Head cy={108} skin={skin} blush="#F0B4B4" mood="soft" />
      <g fill="#F7F4EE">
        <polygon points="96,100 140,46 184,100 168,78 140,68 112,78" />
        <polygon points="104,108 124,96 118,168" />
        <polygon points="176,108 156,96 162,168" />
        <polygon points="112,140 140,168 168,140 156,210 124,210" />
        <polygon points="118,188 132,180 126,300" />
        <polygon points="148,180 162,188 154,308" />
        <polygon points="128,200 152,200 140,250" />
      </g>
    </g>
  );
}

function PortraitINFP() {
  const skin = "#C98662";
  return (
    <g>
      <Backdrop color="#E7F7EC" />
      <Legs pants="#4E6E58" shoe="#3A302C" />
      <polygon points="98,152 182,152 170,230 110,230" fill="#7DB88A" />
      <polygon points="122,152 158,152 150,174 130,174" fill="#F7F3EA" />
      <Limb x1={114} y1={176} x2={74} y2={216} color="#7DB88A" />
      <Hand x={72} y={220} skin={skin} />
      <Limb x1={168} y1={174} x2={204} y2={198} color="#7DB88A" />
      <polygon points="206,168 212,168 214,236 208,236" fill="#3E7A4C" />
      <Bloom x={210} y={156} petal="#F2A3B5" core="#F6D56A" />
      <Hand x={198} y={198} skin={skin} />
      <Head cy={104} skin={skin} blush="#E8A090" mood="soft" />
      <g fill="#3A2A28">
        <polygon points="100,96 140,48 180,96 164,78 140,70 116,78" />
        <polygon points="104,100 92,118 122,108" />
        <polygon points="176,100 188,118 158,108" />
      </g>
      <Bloom x={112} y={62} petal="#F2A3B5" core="#F6D56A" s={0.7} />
      <Bloom x={142} y={50} petal="#F6D56A" core="#F2A3B5" s={0.85} />
      <Bloom x={172} y={64} petal="#F2A3B5" core="#7DB88A" s={0.7} />
    </g>
  );
}

function PortraitENFJ() {
  const skin = "#F6D0B0";
  return (
    <g>
      <Backdrop color="#E3F6E8" />
      <Legs pants="#2F5E44" shoe="#2C3830" />
      <polygon points="94,148 186,148 172,230 108,230" fill="#3F8F62" />
      <polygon points="124,148 156,148 156,168 124,168" fill="#F8E7C4" />
      <polygon points="116,196 164,196 160,210 120,210" fill="#C6A15A" />
      <Limb x1={112} y1={172} x2={72} y2={210} color="#3F8F62" />
      <Hand x={68} y={214} skin={skin} />
      <Limb x1={174} y1={164} x2={206} y2={146} color="#3F8F62" />
      <g transform="translate(198 46)">
        <polygon points="16,0 28,0 24,92 20,92" fill="#E7EEE8" stroke={INK} strokeWidth="2" />
        <polygon points="2,78 42,78 38,90 6,90" fill="#C6A15A" />
        <polygon points="16,90 28,90 24,108 20,108" fill="#8D6A32" />
        <polygon points="14,0 30,0 22,-16" fill="#E7EEE8" stroke={INK} strokeWidth="2" />
      </g>
      <Hand x={206} y={142} skin={skin} />
      <Head cy={100} skin={skin} blush="#F0A8B4" mood="grin" />
      <polygon points="100,92 140,46 180,92 164,74 140,66 116,74" fill="#3A2E32" />
    </g>
  );
}

function PortraitENFP() {
  const skin = "#E8B48A";
  return (
    <g>
      <Backdrop color="#E8F8EC" />
      <polygon points="96,300 184,300 170,314 110,314" fill={INK} opacity="0.06" />
      <polygon points="168,128 214,118 220,178 174,188" fill="#3E7A4C" />
      <polygon points="178,140 208,134 206,160 176,164" fill="#62B56C" />
      <polygon points={diamond(192, 170, 6, 6)} fill="#FFE08A" />
      <Limb x1={150} y1={176} x2={176} y2={214} color="#3E7A4C" width={18} />
      <Limb x1={176} y1={214} x2={156} y2={248} color="#3E7A4C" width={16} />
      <polygon points="134,244 170,240 166,258 130,260" fill="#4A3428" />
      <Limb x1={124} y1={178} x2={96} y2={214} color="#3E7A4C" width={18} />
      <Limb x1={96} y1={214} x2={118} y2={246} color="#3E7A4C" width={16} />
      <polygon points="102,242 140,238 136,256 98,258" fill="#4A3428" />
      <polygon points="108,126 176,126 168,186 116,186" fill="#62B56C" />
      <polygon points="124,126 156,126 152,142 128,142" fill="#FFE08A" />
      <Limb x1={120} y1={146} x2={74} y2={96} color="#62B56C" />
      <Hand x={70} y={88} skin={skin} />
      <Limb x1={166} y1={146} x2={210} y2={124} color="#62B56C" />
      <Hand x={214} y={118} skin={skin} />
      <Head cy={90} skin={skin} blush="#EEA088" mood="grin" />
      <g fill="#5A341F">
        <polygon points="104,78 118,42 136,62" />
        <polygon points="122,58 146,28 158,58" />
        <polygon points="150,40 178,26 176,64" />
        <polygon points="168,48 198,58 180,84" />
        <polygon points="96,96 112,62 128,90" />
        <polygon points="184,92 170,58 156,86" />
        <polygon points="100,100 140,62 180,100 140,86" />
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
      <Suit cloth="#4F82C4" lapel="#2E4E74" shirt="#F7F5F2" tie="#D5E4F4" />
      <Limb x1={118} y1={176} x2={92} y2={214} color="#4F82C4" />
      <Limb x1={164} y1={176} x2={196} y2={210} color="#4F82C4" />
      <g transform="translate(70 164) rotate(-8)">
        <polygon points="0,8 100,0 104,120 4,112" fill="#fff" stroke={INK} strokeWidth="2.4" />
        <polygon points="32,-2 70,-6 72,14 30,16" fill="#D5E4F4" stroke={INK} strokeWidth="2" />
        <path d="M18 32 H82 M18 50 H82 M18 68 H82 M18 86 H58" stroke="#7FA4D0" strokeWidth="3" />
        <path d="M18 32 L26 40 L40 24" fill="none" stroke="#3D74B0" strokeWidth="2.6" />
      </g>
      <Hand x={86} y={250} skin={skin} />
      <Hand x={176} y={246} skin={skin} />
      <Head cy={100} skin={skin} blush="#F0B4AE" mood="calm" />
      <g fill="#2A3344">
        <polygon points="100,92 140,44 180,92 164,74 140,66 116,74" />
        <polygon points="108,84 150,62 168,96 140,88" />
      </g>
    </g>
  );
}

function PortraitISFJ() {
  const skin = "#E0A67E";
  return (
    <g>
      <Backdrop color="#E8F4FC" />
      <Legs pants="#3E6488" shoe="#3A4048" />
      <polygon points="98,152 182,152 168,234 112,234" fill="#7EADD8" />
      <polygon points="118,176 162,176 154,234 126,234" fill="#FFF8F4" />
      <Limb x1={112} y1={176} x2={74} y2={208} color="#7EADD8" />
      <Limb x1={172} y1={172} x2={210} y2={194} color="#7EADD8" />
      <g transform="translate(36 176)">
        <polygon points="36,0 68,22 60,78 12,78 4,22" fill="#F7FBFF" stroke="#3D74B0" strokeWidth="5" />
        <polygon points="28,36 16,22 16,12 28,12 36,22" fill="#E07A8C" />
        <polygon points="44,36 56,22 56,12 44,12 36,22" fill="#E07A8C" />
        <polygon points="28,32 44,32 36,52" fill="#E07A8C" />
      </g>
      <Hand x={78} y={214} skin={skin} />
      <polygon points="214,168 220,168 222,214 216,214" fill="#3E7A4C" />
      <Bloom x={218} y={158} petal="#F2A3B5" core="#F6D56A" s={0.85} />
      <Hand x={210} y={196} skin={skin} />
      <Head cy={102} skin={skin} blush="#E89898" mood="soft" />
      <g fill="#4A3034">
        <polygon points="124,62 140,36 156,62 140,54" />
        <polygon points="98,100 140,50 182,100 164,80 140,72 116,80" />
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
      <Suit cloth="#3D74B0" lapel="#2A4C72" shirt="#F4F7FB" tie="#F0D48A" />
      <Limb x1={110} y1={176} x2={74} y2={220} color="#3D74B0" />
      <g transform="translate(42 210)">
        <polygon points="0,8 46,4 48,36 2,40" fill="#2E4E74" />
        <polygon points="14,-6 32,-8 34,8 12,10" fill="#2E4E74" />
        <polygon points="6,16 40,14 40,18 6,20" fill="#F0D48A" />
      </g>
      <Hand x={78} y={214} skin={skin} />
      <Limb x1={174} y1={162} x2={210} y2={128} color="#3D74B0" />
      <Hand x={208} y={122} skin={skin} />
      <g transform="translate(188 92) rotate(16)">
        <polygon points="0,18 46,0 46,44 0,28" fill="#F4E2A8" stroke={INK} strokeWidth="1.6" />
        <polygon points="40,10 58,8 60,36 42,34" fill="#3D74B0" />
        <path d="M60 12 L74 8 M60 22 L78 22 M60 32 L74 38" stroke={INK} strokeWidth="2" />
      </g>
      <Head cy={98} skin={skin} blush="#D98B78" mood="focus" />
      <polygon points="102,90 140,48 178,90 162,74 140,66 118,74" fill="#2A241F" />
    </g>
  );
}

function PortraitESFJ() {
  const skin = "#F3C2A4";
  return (
    <g>
      <Backdrop color="#EAF5FD" />
      <Legs pants="#3E688E" shoe="#4A403C" />
      <polygon points="96,150 184,150 170,232 110,232" fill="#6AA4D4" />
      <polygon points="116,176 164,176 158,232 122,232" fill="#FFF0F3" />
      <Limb x1={116} y1={176} x2={96} y2={214} color="#6AA4D4" />
      <Limb x1={166} y1={176} x2={188} y2={214} color="#6AA4D4" />
      <g transform="translate(70 198)">
        <polygon points="8,30 132,26 140,42 0,46" fill="#E7D3B0" />
        <polygon points="36,30 104,28 100,42 40,44" fill="#D7C09A" />
        <polygon points="48,30 92,28 100,8 40,10" fill="#F7C5D4" />
        <polygon points="50,16 90,14 84,4 56,6" fill="#FFF6F8" />
        <polygon points={diamond(70, 6, 7, 8)} fill="#E25B5B" />
        <polygon points="68,0 74,0 72,-10 70,-10" fill="#3E7A4C" />
      </g>
      <Hand x={96} y={214} skin={skin} />
      <Hand x={188} y={214} skin={skin} />
      <Head cy={100} skin={skin} blush="#F0A8A0" mood="grin" />
      <g fill="#5A382C">
        <polygon points="96,96 140,42 184,96 166,76 140,68 114,76" />
        <polygon points="92,100 112,88 108,168 90,160" />
        <polygon points="188,100 168,88 172,168 190,160" />
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
      <polygon points="96,150 184,150 170,230 110,230" fill="#E0A020" />
      <polygon points="124,150 156,150 156,170 124,170" fill="#FFF8E8" />
      <polygon points="112,186 168,186 160,232 120,232" fill="#C47E12" />
      <Limb x1={114} y1={172} x2={88} y2={204} color="#E0A020" />
      <Limb x1={170} y1={166} x2={206} y2={186} color="#E0A020" />
      <g transform="translate(146 160) rotate(18)">
        <polygon points="0,10 50,6 52,36 2,40" fill="#4A433C" />
        <polygon points="44,14 74,12 76,30 46,32" fill="#D5D0C8" />
        <polygon points="72,8 98,22 72,36" fill="#C9C3BC" />
        <polygon points={diamond(16, 22, 6, 6)} fill="#F2C14E" />
        <path d="M8 8 L4 -4 M22 6 L26 -6" stroke="#4A433C" strokeWidth="3" />
      </g>
      <Hand x={92} y={200} skin={skin} />
      <Hand x={186} y={182} skin={skin} />
      <Head cy={100} skin={skin} blush="#C47D68" mood="calm" />
      <g fill="#241C18">
        <polygon points="102,92 140,50 178,92 162,76 140,68 118,76" />
        <polygon points="116,58 132,36 140,70" />
      </g>
      <g>
        <path d="M108 78 H172" stroke="#241C18" strokeWidth="4" />
        <polygon points="108,68 140,64 144,94 106,98" fill="#D7F1F8" stroke={INK} strokeWidth="2.2" />
        <polygon points="146,64 180,68 182,98 144,94" fill="#D7F1F8" stroke={INK} strokeWidth="2.2" />
        <path d="M136 80 H144" stroke={INK} strokeWidth="2.2" />
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
      <polygon points="98,152 182,152 168,230 112,230" fill="#F2C14E" />
      <polygon points="122,152 158,152 150,172 130,172" fill="#FFF8EE" />
      <Limb x1={114} y1={176} x2={74} y2={212} color="#F2C14E" />
      <Limb x1={170} y1={172} x2={208} y2={196} color="#F2C14E" />
      <g transform="translate(36 178) rotate(-12)">
        <polygon points="8,8 58,2 64,40 20,52 0,28" fill="#F7F1E6" stroke={INK} strokeWidth="2" />
        <polygon points={diamond(46, 28, 8, 7)} fill="#FFF6DC" stroke={INK} strokeWidth="2" />
        <polygon points={diamond(16, 16, 6, 6)} fill="#F08A3C" />
        <polygon points={diamond(32, 12, 6, 6)} fill="#7DB88A" />
        <polygon points={diamond(44, 20, 6, 6)} fill="#7C6BB8" />
        <polygon points={diamond(28, 30, 6, 6)} fill="#E07A8C" />
      </g>
      <Hand x={78} y={214} skin={skin} />
      <polygon points="206,148 214,150 220,198 212,196" fill="#8D6A32" />
      <polygon points="206,140 228,148 214,162" fill="#E07A8C" />
      <Hand x={204} y={196} skin={skin} />
      <Head cy={102} skin={skin} blush="#F3B4B4" mood="soft" />
      <g fill="#3D2C32">
        <polygon points="98,96 140,50 182,96 164,78 140,70 116,78" />
        <polygon points="100,92 120,74 118,108" />
        <polygon points="180,92 160,74 162,108" />
        <polygon points="118,62 168,52 176,78 150,70 122,78" />
      </g>
      <polygon points={diamond(176, 60, 6, 6)} fill="#E07A8C" />
    </g>
  );
}

function PortraitESTP() {
  const skin = "#D3926A";
  return (
    <g>
      <Backdrop color="#FFF3CC" />
      <Legs pants="#4E463C" shoe="#2C2824" />
      <polygon points="94,148 186,148 172,230 108,230" fill="#E39A1A" />
      <polygon points="126,148 154,148 154,166 126,166" fill="#FFF6D8" />
      <Limb x1={112} y1={174} x2={74} y2={214} color="#E39A1A" />
      <Hand x={70} y={218} skin={skin} />
      <Limb x1={172} y1={166} x2={198} y2={196} color="#E39A1A" />
      <g transform="translate(164 172)">
        <polygon points="0,6 66,0 70,42 4,48" fill="#2C3444" />
        <polygon points="10,-8 34,-10 36,8 8,10" fill="#3A4458" />
        <polygon points={diamond(36, 24, 16, 14)} fill="#8EC6E0" />
        <polygon points={diamond(36, 24, 7, 6)} fill="#243044" />
        <polygon points="30,16 36,14 34,22" fill="#fff" opacity="0.75" />
      </g>
      <Hand x={186} y={196} skin={skin} />
      <Head cy={98} skin={skin} blush="#E89080" mood="grin" glasses="sun" />
      <g fill="#2C211C">
        <polygon points="100,88 140,46 180,88 164,72 140,64 116,72" />
        <polygon points="140,42 158,78 122,78" />
        <polygon points="108,60 128,86 96,96" />
        <polygon points="176,58 188,94 154,82" />
      </g>
    </g>
  );
}

function Maraca({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <polygon points="16,28 28,28 26,56 18,56" fill="#C6A15A" />
      <polygon points={diamond(22, 14, 16, 18)} fill={flip ? "#F08A3C" : "#E25B5B"} />
      <path d="M8 10 H36 M6 18 H38" stroke="#FFF6D4" strokeWidth="2" />
    </g>
  );
}

function PortraitESFP() {
  const skin = "#F0BE98";
  return (
    <g>
      <Backdrop color="#FFF5D8" />
      <polygon points="112,228 134,228 130,288 108,288" fill="#D4892A" />
      <Limb x1={156} y1={236} x2={196} y2={266} color="#D4892A" width={16} />
      <polygon points="96,280 140,276 136,294 92,296" fill="#4A342C" />
      <polygon points="176,262 214,256 210,274 172,278" fill="#4A342C" />
      <polygon points="98,148 182,148 170,226 110,226" fill="#F0B429" />
      <polygon points="124,148 156,148 156,166 124,166" fill="#FFF8E4" />
      <Limb x1={116} y1={166} x2={74} y2={112} color="#F0B429" />
      <Limb x1={170} y1={166} x2={214} y2={116} color="#F0B429" />
      <Maraca x={46} y={72} />
      <Maraca x={206} y={68} flip />
      <Hand x={74} y={108} skin={skin} />
      <Hand x={210} y={112} skin={skin} />
      <Head cy={100} skin={skin} blush="#F0A0B0" mood="grin" />
      <g fill="#4E2C28">
        <polygon points="100,96 140,44 180,96 164,76 140,68 116,76" />
        <polygon points="176,108 196,96 204,168 182,160" />
        <polygon points={diamond(188, 100, 8, 8)} fill="#FFE08A" />
      </g>
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
    <svg viewBox="0 0 280 340" className={cn("h-auto w-full", className)} role="img" aria-label={label ?? `${type} 的多边形画像`}>
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
