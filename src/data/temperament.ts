export type TemperamentId = "NT" | "NF" | "SJ" | "SP";

export interface Temperament {
  id: TemperamentId;
  name: string;
  wash: string;
  ink: string;
  chip: string;
}

export const TEMPERAMENTS: Record<TemperamentId, Temperament> = {
  NT: { id: "NT", name: "分析师", wash: "#F3E9FB", ink: "#62468F", chip: "#E6D6F6" },
  NF: { id: "NF", name: "外交官", wash: "#E7F7EB", ink: "#2F6B45", chip: "#D4F0DC" },
  SJ: { id: "SJ", name: "守护者", wash: "#E7F3FC", ink: "#2C6294", chip: "#D4E8F8" },
  SP: { id: "SP", name: "探险家", wash: "#FFF6D8", ink: "#8A5A12", chip: "#FFE7A6" },
};

export function temperamentIdOf(code: string): TemperamentId {
  const type = code.slice(0, 4);
  const intuitive = type[1] === "N";
  const thinking = type[2] === "T";
  const judging = type[3] === "J";
  if (intuitive && thinking) return "NT";
  if (intuitive && !thinking) return "NF";
  if (!intuitive && judging) return "SJ";
  return "SP";
}

export function temperamentOf(code: string): Temperament {
  return TEMPERAMENTS[temperamentIdOf(code)];
}
