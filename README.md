# 64 型人格测试

手机优先的单页人格小测试。108 道 Likert 题覆盖能量（E/I）、关注（N/S）、判断（T/F）、节奏（J/P），以及两层后缀：坚定/敏感（A/T）、协同/主见（C/H）。16 种主类型 × 4 种后缀，答完立刻给出 64 型，并可以带走一千字以上的中文报告。

这是娱乐向的自我观察，不是心理诊断，也不用于招聘。

## 本地运行

```bash
npm install
npm test
npm run dev
```

开发服务器：<http://127.0.0.1:43123>

## 界面

手机宽度下的开始页，以及四个气质分组的结果页（紫 NT、绿 NF、蓝 SJ、黄 SP）。头像是按十六型新画的扁平几何形象，64 型后缀沿用同一张主类型画像。

![开始页](docs/screenshots/start.png)

![结果页 · 分析师 INTJ](docs/screenshots/result-nt.png)

![结果页 · 外交官 ENFP](docs/screenshots/result-nf.png)

![结果页 · 守护者 ISTJ](docs/screenshots/result-sj.png)

![结果页 · 探险家 ESTP](docs/screenshots/result-sp.png)

生产构建：

```bash
npm run build
npm run preview
```

`dist/` 是静态文件，使用相对路径，可以放在任意静态托管的子目录里。

## GitHub Pages

目标仓库：<https://github.com/zengpenghui420-glitch/mbti-64>

目标地址：<https://zengpenghui420-glitch.github.io/mbti-64/>

静态资源使用相对路径（`base: "./"`），可以放在这个项目站点的子路径下。发布工作流是 `.github/workflows/pages.yml`，在 `main` 被推送时构建并部署。

这个云端环境没有登录 `zengpenghui420-glitch` 的 GitHub 账号，所以仓库需要在本机创建并打开 Pages：

```bash
gh auth login
gh repo create zengpenghui420-glitch/mbti-64 --public --source=. --remote=github --push
gh api --method POST -H "Accept: application/vnd.github+json" \
  /repos/zengpenghui420-glitch/mbti-64/pages \
  -f build_type=workflow
```

如果接口不能单独打开 Pages，在网页上点这几步：

1. 打开 <https://github.com/zengpenghui420-glitch/mbti-64/settings/pages>
2. Build and deployment → Source 选 **GitHub Actions**
3. 打开 Actions 里的 **Deploy GitHub Pages**。如果第一次推送时 Pages 还没打开、工作流失败了，点 **Re-run jobs**。
4. 成功后访问 <https://zengpenghui420-glitch.github.io/mbti-64/>，页面标题应为「64型人格测试」。

## 订单号

从首页开始答题需要小红书订单号。到「我的订单」里复制。页面只接受 `P` 加 18 位数字。重复数字块、逐位加一或减一的序列，以及 19 位数字，会提示「订单号格式不对」，不会开始答题。

格式通过后立即开始。不向 `*.vercel.app` 发订单请求，也不在 Mantle 的 `orders/` 里创建、查询或加次。没有服务器绑定、限流，也没有服务器上的剩余次数。

- 第一次开始提示「验证成功，还可以测 2 次」。
- 「重新测试」再记一次，提示变为「还可以测 1 次」，然后「这是最后一次」。
- 刷新页面、继续这次还没做完的题、回到上次结果、查看上次结果，都不改变这个提示。
- 同一订单号在记到 3 次之后仍然可以进入，提示改为「验证成功」。

次数按订单号记在这台浏览器的 `localStorage`（键 `mbti64_order_uses`）。

`?code=` 里如果是订单号，会按上面的规则进入第一题。链接如果同时是 `#/demo` 预览，则不会记次。直接打开 `#/quiz` 不能绕过。

不是订单号的输入仍走本仓原来的 Mantle 集合 `mb`（namespace `catquiz-zph420-codes`，和 cat 的 `c`、八字的 `bz` 不通用），不改走 `/redeem`。页面上不提示这条路径。对这类输入，开始、继续未完成、重新测试仍是每次进入扣 1 次；查看上次结果和示例不扣。

新码用 `tools/mint.sh` 生成（前缀 `MB`，集合 `mb`）。写权限的 key 只放在环境变量里，不要提交到仓库：

```bash
MANTLE_KEY=... ./tools/mint.sh 10
```

## 计分

每题 1–5 分，正向题与反向题各半。某一维高于 50% 取 E / N / T / J / A / C，等于或低于 50% 取另一极。刷新页面会从本地记住作答进度。

示例结果（不是你的作答）可以从首页进入，或打开 `#/demo`。
