import { useState, type FormEvent } from "react";
import { AvatarStage, PersonaAvatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { accessConfig } from "@/config";
import { getProfile, TYPE_CODES } from "@/data/profiles";
import { temperamentOf } from "@/data/temperament";

const FEATURES = [
  { title: "108 道情境题", text: "六个维度交错出现，按平时的你来选，大约十分钟。" },
  { title: "64 型当场给", text: "16 种主类型，再加坚定/敏感、协同/主见两层后缀。" },
  { title: "完整报告", text: "可以阅读、下载 HTML，或打印存成 PDF。" },
];

const SAMPLES = ["INTJ-AC", "ENFP-TC", "ISFJ-AH", "ESTP-TH", "INFJ-TC", "ENTP-AH"];

export function Landing({
  onStart,
  onDemo,
  gateOk,
  onUnlock,
  resume,
}: {
  onStart: () => void;
  onDemo: () => void;
  gateOk: boolean;
  onUnlock: (code: string) => boolean;
  resume: "new" | "partial" | "done";
}) {
  const [invite, setInvite] = useState("");
  const [gateError, setGateError] = useState("");
  const locked = accessConfig.gateEnabled && !gateOk;

  function submitGate(event: FormEvent) {
    event.preventDefault();
    const ok = onUnlock(invite);
    setGateError(ok ? "" : "这个邀请码还不能用。");
    if (ok) onStart();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:py-10">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="grid size-9 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-foreground/10">64</span>
          <span>人格小测试</span>
        </div>
      </header>

      <section className="grid items-center gap-6 md:grid-cols-[1.05fr_.95fr] md:gap-10">
        <div className="order-2 md:order-1">
          <p className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-primary ring-1 ring-primary/15">
            2026 新版 · 娱乐向
          </p>
          <h1 className="font-display text-5xl leading-none text-foreground md:text-7xl">
            64 型
            <span className="mt-2 block text-[1.7rem] tracking-wide md:text-4xl">人格测试</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            十六种主类型之下，再用「坚定 / 敏感」和「协同 / 主见」往里看一层。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:max-w-sm">
            {locked ? (
              <form onSubmit={submitGate} className="grid gap-2">
                <label className="text-sm text-muted-foreground" htmlFor="invite">
                  邀请码（当前为内测入口）
                </label>
                <input
                  id="invite"
                  value={invite}
                  onChange={(event) => setInvite(event.target.value)}
                  className="h-12 rounded-full border bg-white px-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                  placeholder="输入邀请码"
                  autoComplete="off"
                />
                {gateError ? <p className="text-sm text-destructive">{gateError}</p> : null}
                <Button type="submit" variant="gold" size="xl">
                  验证并开始
                </Button>
              </form>
            ) : (
<Button type="button" variant="gold" size="xl" onClick={onStart}>
                  {resume === "done" ? "查看上次结果" : resume === "partial" ? "继续未完成的测试" : "开始测试"}
                </Button>
            )}
            <Button type="button" variant="outline" size="xl" className="bg-white/80" onClick={onDemo}>
              示例结果
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <AvatarStage />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="bg-white/85 shadow-sm">
            <CardContent className="grid gap-1 pt-1">
              <h2 className="text-base font-semibold">{feature.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="pb-6">
        <p className="mb-3 text-sm text-muted-foreground">64 种写法，例如</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((sample) => (
            <span key={sample} className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-foreground/10">
              {sample}
            </span>
          ))}
          <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">…共 64 型</span>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-6 text-muted-foreground">
          结果只适合聊天、自我观察和写作灵感，不是心理诊断，也不用于招聘。四个字母是流行文化里的类型说法；A/T、C/H 是本测试自己的两层后缀。
        </p>
      </section>

      <section className="pb-8">
        <h2 className="text-lg font-semibold">十六型画像</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          紫 NT 分析师、绿 NF 外交官、蓝 SJ 守护者、黄 SP 探险家。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {TYPE_CODES.map((code) => {
            const profile = getProfile(code);
            const temp = temperamentOf(code);
            return (
              <article key={code} className="overflow-hidden rounded-[28px] shadow-sm ring-1 ring-foreground/5" style={{ background: temp.wash }}>
                <PersonaAvatar code={code} label={`${profile.cnName}，${profile.nicknames.join("、")}`} />
                <div className="px-3 pb-3 text-center">
                  <p className="text-xs font-medium" style={{ color: temp.ink }}>
                    {temp.name} · {code}
                  </p>
                  <h3 className="text-base font-semibold">{profile.cnName}</h3>
                  <p className="text-xs leading-5" style={{ color: temp.ink }}>
                    {profile.nicknames.join(" · ")}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
