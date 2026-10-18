import type { DimensionScore } from "@/lib/score";
import { DIMENSION_BY_ID } from "@/data/dimensions";

export function BipolarBar({ score }: { score: DimensionScore }) {
  const meta = DIMENSION_BY_ID[score.dim];
  const positiveWins = score.letter === meta.positive.letter;
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{meta.title}</span>
        <span className="font-medium">
          偏向{score.name} {score.letter}
          <span className="text-muted-foreground"> · {score.lean}%</span>
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-muted">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/15" />
        <div
          className="absolute top-0 h-full rounded-full bg-primary/80"
          style={
            positiveWins
              ? { left: "50%", width: `${Math.max(score.positive - 50, 2)}%` }
              : { right: "50%", width: `${Math.max(50 - score.positive, 2)}%` }
          }
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {meta.negative.name} {meta.negative.letter}
        </span>
        <span>
          {meta.positive.name} {meta.positive.letter}
        </span>
      </div>
    </div>
  );
}
