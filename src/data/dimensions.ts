import type { Dimension } from "@/data/questions";

export interface PoleCopy {
  letter: string;
  name: string;
  strong: string;
  mid: string;
  lean: string;
}

export interface DimensionMeta {
  id: Dimension;
  title: string;
  hint: string;
  positive: PoleCopy;
  negative: PoleCopy;
}

export const DIMENSIONS: DimensionMeta[] = [
  {
    id: "EI",
    title: "能量来源",
    hint: "精神更容易在互动里点亮，还是在安静里补回来",
    positive: {
      letter: "E",
      name: "外向",
      strong:
        "能量明显偏向外向。你在有来有回的谈话、一起做事、甚至刚认识的人里更容易亮起来。太久不说话，思路也会跟着变慢。",
      mid: "你偏向外向，但不是时刻都想站在中间。结伴能充电，连续的社交仍需要一点收口。",
      lean: "外向只是轻微偏向。你既能加入人群，也没有把独处当成消耗。这个维度不必用来解释你的全部。",
    },
    negative: {
      letter: "I",
      name: "内向",
      strong:
        "能量明显偏向内向。人多的地方你可以完成任务，真正把精神补回来的，是独处、一对一，或一段不被打断的安静。",
      mid: "你偏向内向。小范围的深聊通常比大场面更适合你，社交之后你会想把门关上一会儿。",
      lean: "内向只是轻微偏向。你需要一些自己的时间，但并不排斥热闹。靠近中线时，场景比字母更重要。",
    },
  },
  {
    id: "NS",
    title: "关注焦点",
    hint: "先看见可能性，还是先抓住眼前的事实",
    positive: {
      letter: "N",
      name: "直觉",
      strong:
        "注意力明显偏向直觉。你容易先看见可能性、隐喻和还没发生的版本，细节常常是为了服务那个更大的图景才被捡起来。",
      mid: "你偏向直觉。谈“这意味什么”会比核对清单更让你眼睛亮，不过你仍要靠具体事实落地。",
      lean: "直觉只是轻轻占上风。你会对可能性动心，也会回头检查眼前。不必强迫自己变成纯粹的想象者。",
    },
    negative: {
      letter: "S",
      name: "实感",
      strong:
        "注意力明显偏向实感。你相信看得见、记得住、能重复的经验。没有例子的大词，很快会让你失去兴趣。",
      mid: "你偏向实感。你喜欢按事实和顺序把事情说清，也会为太飘的计划找一个能执行的第一步。",
      lean: "实感只是轻微偏向。你重视经验，也并不拒绝新的设想，尤其当设想能被举出例子的时候。",
    },
  },
  {
    id: "TF",
    title: "判断方式",
    hint: "做决定时先对齐道理，还是先对齐人心",
    positive: {
      letter: "T",
      name: "思考",
      strong:
        "判断明显偏向思考。你想先把道理、标准和效果摆平，再决定要不要顾及气氛。直接的反馈对你通常是帮助，不是冒犯。",
      mid: "你偏向思考。利弊说得清的时候你会安心，但你不是听不见感受，只是感受很少被你当作最后的理由。",
      lean: "思考只是轻微偏向。你讲逻辑，也还留着对局面的体谅。接近中线时，你会按事情的重量在两边切换。",
    },
    negative: {
      letter: "F",
      name: "情感",
      strong:
        "判断明显偏向情感。谁会难受、气氛还在不在、这件事是否合乎心意，会实实在在地改变你的决定。",
      mid: "你偏向情感。你可以谈对错，但若关系变僵，你会先想把人与人之间的温度找回来。",
      lean: "情感只是轻微偏向。你在意人心，也仍能把道理听完。这个字母描述偏好，不描述能力。",
    },
  },
  {
    id: "JP",
    title: "生活节奏",
    hint: "更想早点收口，还是把选择留到后面",
    positive: {
      letter: "J",
      name: "判断",
      strong:
        "节奏明显偏向判断。你希望事情被定下来：时间、位置、结论。悬着和被临时打乱，都会消耗你。",
      mid: "你偏向判断。清单和截止日期让你松一口气，不过你仍可以在熟悉的框架里做小调整。",
      lean: "判断只是轻微偏向。你喜欢有个计划，也不是离开计划就无法行动。",
    },
    negative: {
      letter: "P",
      name: "感知",
      strong:
        "节奏明显偏向感知。你想把选择留到更后面，边做边改，并且常常在期限靠近时才进入状态。",
      mid: "你偏向感知。太满的计划会让你喘不过气，留白对你来说是工作方式，不只是放松。",
      lean: "感知只是轻微偏向。你享受余地，也能在需要时把事情收口。",
    },
  },
  {
    id: "AT",
    title: "自我稳定",
    hint: "压力和评价来时，自我感更稳，还是更易被牵动",
    positive: {
      letter: "A",
      name: "坚定",
      strong:
        "自我稳定明显偏向坚定。评价和失误会进入你的脑子，但很少在胸口循环一整晚。你大体相信自己应付得来。",
      mid: "你偏向坚定。压力来时你回得去，偶尔仍会在意别人怎么看，只是它左右不了你太久。",
      lean: "坚定只是轻微偏向。你有基本的自我信任，在连续受挫时也会晃一下。",
    },
    negative: {
      letter: "T",
      name: "敏感",
      strong:
        "自我稳定明显偏向敏感。你对差距、评价和“还能更好”有很高的分辨率。这带来精进，也带来不容易真正满意。",
      mid: "你偏向敏感。轻的批评会留下痕迹，做完事情仍可能复查一遍。你在乎质量，也在乎自己的位置。",
      lean: "敏感只是轻微偏向。你会对差错多想一会儿，但不是每件事都变成自我审判。",
    },
  },
  {
    id: "CH",
    title: "关系站位",
    hint: "在人群里先找配合，还是先把方向立住",
    positive: {
      letter: "C",
      name: "协同",
      strong:
        "关系站位明显偏向协同。你会先确认别人的位置和感受，再决定自己怎么出力。配合顺不顺，对你是结果的一部分。",
      mid: "你偏向协同。你愿意调整节奏来换团队顺畅，同时也希望功劳和负担可以被分享。",
      lean: "协同只是轻微偏向。你会听人说完，但不是没有自己的偏好。",
    },
    negative: {
      letter: "H",
      name: "主见",
      strong:
        "关系站位明显偏向主见。方向模糊时，你宁可自己先定一条路。你把责任接过来当成诚意，而不是口头上的客气。",
      mid: "你偏向主见。讨论太久你会想收口，也希望别人直接知道你的立场，不必靠猜。",
      lean: "主见只是轻微偏向。你能拍板，也还听得进反对，尤其当反对说得具体的时候。",
    },
  },
];

export const DIMENSION_BY_ID: Record<Dimension, DimensionMeta> = Object.fromEntries(
  DIMENSIONS.map((item) => [item.id, item]),
) as Record<Dimension, DimensionMeta>;

export function bandCopy(meta: DimensionMeta, positivePercent: number): { letter: string; name: string; text: string; lean: number } {
  const positiveWins = positivePercent > 50;
  const pole = positiveWins ? meta.positive : meta.negative;
  const lean = Math.round(positiveWins ? positivePercent : 100 - positivePercent);
  const text = lean >= 66 ? pole.strong : lean >= 58 ? pole.mid : pole.lean;
  return { letter: pole.letter, name: pole.name, text, lean };
}
