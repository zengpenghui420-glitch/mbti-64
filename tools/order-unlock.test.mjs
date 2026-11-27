// Browser checks for on-device order unlock. Synthetic ids only.
// Chrome pins the order API and Mantle hosts to 127.0.0.1, so a missed mock
// cannot redeem a real order or an issued code.
import { spawn } from "node:child_process";
import { openSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(join(dirname(fileURLToPath(import.meta.url)), "../package.json"));
const puppeteer = require("puppeteer-core");

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const API_HOST = "snappy-tundra-7uesdvk-zengpenghui420-glitch.vercel.app";
const ORDER = "P246801357924680135";
const CODE = "MBABCD";
const USES_KEY = "mbti64_order_uses";
const PORT = 8944;
const BASE = `http://127.0.0.1:${PORT}/`;

function assertSources() {
  const orderSrc = readFileSync(new URL("../src/lib/order.ts", import.meta.url), "utf8");
  const appSrc = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const dialogSrc = readFileSync(new URL("../src/components/AccessDialog.tsx", import.meta.url), "utf8");
  for (const src of [orderSrc, appSrc]) {
    assert(!src.includes("vercel.app"), "order path still names the order host");
    assert(!src.includes("/order/"), "order path still names /order/");
    assert(!src.includes("mantledb"), "order path still names Mantle");
    assert(!src.includes("/orders/"), "order path still names orders/");
    assert(!src.includes("soft_persimmon_order_uses"), "display key reused");
    assert(!src.includes("次数已经用完"), "order path still has the exhausted copy");
    assert(!src.includes("暂时验证不了"), "order path still has the unavailable copy");
  }
  assert(!orderSrc.includes("fetch("), "order module still fetches");
  assert(appSrc.includes("submitOrderId"), "page no longer submits an order id locally");
  assert(!appSrc.includes("peekOrder"), "page still peeks an order");
  assert(dialogSrc.includes("输入订单号"), "dialog title changed");
  assert(!dialogSrc.includes("localStorage") && !dialogSrc.includes("本地"), "dialog describes the count");
}

assertSources();

if (!/^P\d{18}$/.test(ORDER)) throw new Error("synthetic order shape");
if (!/^MB[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/.test(CODE)) throw new Error("synthetic code shape");

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type,Authorization,X-Device-Id,X-Fingerprint,X-Mantle-Key",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "content-type": "application/json",
};

function freshState() {
  return {
    vaultPosts: 0,
    mantleGets: 0,
    mantleDecr: 0,
    urls: [],
    unexpected: [],
    bodies: [],
  };
}

async function send(req, status, obj) {
  await req.respond({ status, headers: CORS, body: JSON.stringify(obj) });
}

async function handleApi(req, u, state) {
  state.urls.push(`${req.method()} ${u.pathname}`);
  if (u.pathname === "/redeem" && req.method() === "POST") {
    state.vaultPosts += 1;
    state.unexpected.push("vault " + u.pathname);
  }
  if (u.pathname.startsWith("/order/")) state.unexpected.push("vercel-order " + req.method() + " " + u.pathname);
  await req.abort("failed");
}

async function handleMantle(req, u, state) {
  if (req.method() === "OPTIONS") {
    await req.respond({ status: 204, headers: CORS, body: "" });
    return;
  }
  state.urls.push(`${req.method()} mantle ${u.pathname}`);
  if (u.pathname.includes("/orders/")) {
    state.unexpected.push("mantle-order " + u.pathname);
    await req.abort("failed");
    return;
  }
  if (!u.pathname.includes("/mb/")) {
    state.unexpected.push("mantle-col " + u.pathname);
    await req.abort("failed");
    return;
  }
  if (req.method() === "GET") {
    state.mantleGets += 1;
    return send(req, 200, { remaining: 3, max: 3 });
  }
  if (req.method() === "POST" && u.pathname.includes("/increment/")) {
    const body = JSON.parse(req.postData() || "{}");
    state.bodies.push({ key: body.key, by: body.by });
    if (body.by === -1) state.mantleDecr += 1;
    return send(req, 200, { remaining: 2, max: 3 });
  }
  state.unexpected.push("mantle " + req.method() + " " + u.pathname);
  await req.abort("failed");
}

async function arm(page, state) {
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    try {
      const u = new URL(req.url());
      const type = req.resourceType();
      if (u.hostname === "127.0.0.1" || u.hostname === "localhost") {
        await req.continue();
        return;
      }
      if (u.hostname === API_HOST) return await handleApi(req, u, state);
      if (u.hostname === "mantledb.sh") return await handleMantle(req, u, state);
      if (type !== "fetch" && type !== "xhr") {
        await req.abort("failed");
        return;
      }
      state.unexpected.push(u.hostname + " " + u.pathname);
      await req.abort("failed");
    } catch {
      state.unexpected.push("handler");
      try {
        await req.abort("failed");
      } catch {
        /* already handled */
      }
    }
  });
}

function assert(cond, msg, state) {
  if (!cond) {
    const extra = state
      ? "\n" +
        JSON.stringify(
          {
            vaultPosts: state.vaultPosts,
            mantleGets: state.mantleGets,
            mantleDecr: state.mantleDecr,
            urls: state.urls,
            unexpected: state.unexpected,
            bodies: state.bodies,
          },
          null,
          2,
        )
      : "";
    throw new Error(msg + extra);
  }
}

function assertNoOrderNet(state, msg) {
  const hit = state.urls.filter((url) => url.includes("/orders/") || url.includes("/order/") || url.includes("vercel"));
  assert(hit.length === 0 && state.unexpected.length === 0, msg, state);
  assert(state.vaultPosts === 0 && state.mantleGets === 0 && state.mantleDecr === 0, msg, state);
}

async function fillCode(page, value) {
  await page.waitForSelector("#access-code");
  await page.$eval(
    "#access-code",
    (el, next) => {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      proto.set.call(el, next);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    },
    value,
  );
  await page.click('button[type="submit"]');
}

async function openAndSubmit(page, value) {
  await page.waitForFunction(() => [...document.querySelectorAll("button")].some((el) => el.textContent === "开始测试"));
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((el) => el.textContent === "开始测试");
    button.click();
  });
  await page.waitForSelector("#access-code");
  await fillCode(page, value);
}

async function waitQuiz(page) {
  await page.waitForFunction(() => /\d+ \/ 108/.test(document.body.innerText), { timeout: 8000 });
}

async function toastText(page) {
  return page.evaluate(() => {
    const toast = [...document.querySelectorAll("div")].find((node) => String(node.className).includes("z-[60]"));
    return toast ? toast.textContent : "";
  });
}

async function shownUses(page, orderId = ORDER) {
  return page.evaluate(
    (key, id) => {
      try {
        const raw = JSON.parse(localStorage.getItem(key) || "{}");
        const n = Number(raw[id]);
        return Number.isFinite(n) ? n : 0;
      } catch {
        return 0;
      }
    },
    USES_KEY,
    orderId,
  );
}

async function seedFinished(page) {
  await page.evaluate((orderId) => {
    const answers = Array(108).fill(3);
    localStorage.setItem(
      "persona64.v1",
      JSON.stringify({
        view: "result",
        answers,
        index: 107,
        demo: false,
        nickname: "",
        gateOk: false,
      }),
    );
    sessionStorage.setItem("mbti64_kind", "order");
    sessionStorage.setItem("mbti64_phase", "result");
    sessionStorage.setItem("mbti64_code", orderId);
    sessionStorage.setItem("mbti64_unlocked", "1");
  }, ORDER);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.innerText.includes("查看上次结果"));
}

async function newPage(browser, state) {
  const page = await browser.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.setCacheEnabled(false);
  await page.evaluateOnNewDocument(() => {
    try {
      if (sessionStorage.getItem("__test_ready")) return;
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem("__test_ready", "1");
    } catch {
      /* storage unavailable */
    }
  });
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await arm(page, state);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1");
  return { page, errors };
}

const cases = [];
function test(name, fn) {
  cases.push({ name, fn });
}

test("valid P+18 unlocks with no order request; refresh, continue, and 查看上次结果 hold the display", async (browser) => {
  const state = freshState();
  const { page, errors } = await newPage(browser, state);
  const visible = await page.evaluate(() => document.body.innerText);
  assert(visible.includes("64 型") && !visible.includes("paidVerified"), "start copy");
  await openAndSubmit(page, " 「p24 680135-7924.680135」 ");
  await waitQuiz(page);
  assert((await shownUses(page)) === 1, "first start should display one use");
  assertNoOrderNet(state, "first start must not call the network");
  const toast = await toastText(page);
  assert(toast === "验证成功，还可以测 2 次", "success copy " + toast);
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitQuiz(page);
  assert((await shownUses(page)) === 1, "refresh must not change the display count");
  assertNoOrderNet(state, "refresh must not call the network");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((el) => (el.textContent || "").includes("很不符合"));
    button.click();
  });
  await page.waitForFunction(() => document.body.innerText.includes("2 / 108"));
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((el) => el.textContent === "上一题");
    button.click();
  });
  await page.waitForFunction(() => document.body.innerText.includes("1 / 108"));
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((el) => el.textContent === "返回");
    button.click();
  });
  await page.waitForFunction(() => document.body.innerText.includes("继续未完成的测试"));
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((el) => el.textContent === "继续未完成的测试");
    button.click();
  });
  await waitQuiz(page);
  assert((await shownUses(page)) === 1, "continue must not change the display count");
  assertNoOrderNet(state, "continue must not call the network");
  await seedFinished(page);
  assert((await shownUses(page)) === 1, "result restore must not change the display count");
  assertNoOrderNet(state, "result restore must not call the network");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((el) => el.textContent === "查看上次结果");
    button.click();
  });
  await page.waitForFunction(() => document.body.innerText.includes("查看完整报告"));
  assert((await shownUses(page)) === 1, "查看上次结果 must not change the display count");
  assertNoOrderNet(state, "查看上次结果 must not call the network");
  const foreign = await page.evaluate(() => localStorage.getItem("soft_persimmon_order_uses"));
  assert(foreign == null, "display key must belong to this quiz");
  assert(errors.length === 0, errors.join("\n"));
  await page.close();
});

test("19-digit, repeating, and sequence ids are rejected locally", async (browser) => {
  const state = freshState();
  const { page, errors } = await newPage(browser, state);
  await openAndSubmit(page, "P123456789012345678");
  await page.waitForFunction(() => {
    const alert = document.querySelector("[role=alert]");
    return alert && alert.textContent.includes("订单号格式不对");
  });
  await fillCode(page, "P9900000000000001378");
  await page.waitForFunction(() => document.querySelector("[role=alert]")?.textContent.includes("订单号格式不对"));
  await fillCode(page, "P111111111111111111");
  await page.waitForFunction(() => document.querySelector("[role=alert]")?.textContent.includes("订单号格式不对"));
  const onQuiz = await page.evaluate(() => /\d+ \/ 108/.test(document.body.innerText));
  assert(!onQuiz, "a failing id started the quiz");
  assert((await shownUses(page)) === 0, "a failing id recorded a use");
  assertNoOrderNet(state, "rejected ids must not call the network");
  const title = await page.$eval("#access-title", (el) => el.textContent);
  assert(title === "输入订单号", "dialog title " + title);
  assert(errors.length === 0, errors.join("\n"));
  await page.close();
});

test("再测一次 advances the display, and a later entry still opens", async (browser) => {
  const state = freshState();
  const { page, errors } = await newPage(browser, state);
  await openAndSubmit(page, ORDER);
  await waitQuiz(page);
  const expected = ["验证成功，还可以测 1 次", "验证成功，这是最后一次", "验证成功"];
  for (let i = 0; i < expected.length; i++) {
    await seedFinished(page);
    await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")].find((el) => el.textContent === "重新测试");
      button.click();
    });
    await waitQuiz(page);
    await page.waitForFunction(
      (text) => {
        const toast = [...document.querySelectorAll("div")].find((node) => String(node.className).includes("z-[60]"));
        return toast && toast.textContent === text;
      },
      { timeout: 8000 },
      expected[i],
    );
    assert((await shownUses(page)) === i + 2, "displayed use " + (i + 2));
    assertNoOrderNet(state, "retake must not call the network");
  }
  const last = await toastText(page);
  assert(last === "验证成功" && !last.includes("用完") && !last.includes("暂时验证不了"), last);
  assert(errors.length === 0, errors.join("\n"));
  await page.close();
});

test("access codes still decrement Mantle mb and do not call the order API", async (browser) => {
  const state = freshState();
  const { page, errors } = await newPage(browser, state);
  await openAndSubmit(page, "mb ab cd");
  await waitQuiz(page);
  assert(state.mantleGets === 1 && state.mantleDecr === 1, "mantle redeem", state);
  assert(state.bodies[0]?.key === "remaining" && state.bodies[0]?.by === -1, "decrement body", state);
  assert(state.urls.some((url) => url.includes("/mb/" + CODE)), "collection", state);
  assert(state.vaultPosts === 0, "this quiz does not redeem codes through the vault", state);
  const orderHit = state.urls.filter((url) => url.includes("/order/") || url.includes("/orders/"));
  assert(orderHit.length === 0 && state.unexpected.length === 0, "code path touched orders", state);
  const toast = await toastText(page);
  assert(toast === "验证成功，还可以测 2 次", toast);
  assert(errors.length === 0, errors.join("\n"));
  await page.close();
});

const serverLogPath = "/tmp/mbti-order-unlock-vite.log";
const serverLog = openSync(serverLogPath, "w");
const server = spawn("npx", ["vite", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], {
  cwd: ROOT,
  detached: true,
  stdio: ["ignore", serverLog, serverLog],
});

function stopServer() {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    try {
      server.kill("SIGTERM");
    } catch {
      /* already gone */
    }
  }
}

async function waitForServer() {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE);
      if (response.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("dev server did not start\n" + readFileSync(serverLogPath, "utf8"));
}

await waitForServer();

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    `--host-resolver-rules=MAP ${API_HOST} 127.0.0.1, MAP mantledb.sh 127.0.0.1`,
  ],
});

let failed = 0;
try {
  for (const item of cases) {
    try {
      await item.fn(browser);
      console.log("ok " + item.name);
    } catch (error) {
      failed += 1;
      console.error("FAIL " + item.name);
      console.error(error && error.stack ? error.stack : error);
    }
  }
} finally {
  await browser.close();
  stopServer();
}
if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log(cases.length + " passed");
process.exit(0);
