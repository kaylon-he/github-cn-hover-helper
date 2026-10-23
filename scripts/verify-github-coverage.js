const { chromium } = require("playwright");
const path = require("node:path");
const os = require("node:os");

const extensionDir = path.resolve(__dirname, "..");
const userDataDir = path.join(
  os.tmpdir(),
  `github-cn-hover-helper-pw-${Date.now()}`
);

const pages = [
  {
    name: "explore",
    url: "https://github.com/explore",
    probes: [
      { key: "Global search", selector: 'button[aria-label*="type / to search"]', expect: "搜索 GitHub" },
      { key: "Topics", selector: 'a:visible:has-text("Topics")', expect: "主题" },
      { key: "Trending", selector: 'a:visible[href$="/trending"]:has-text("Trending")', expect: "趋势榜" },
      { key: "Collections", selector: 'a:visible[href$="/collections"]:has-text("Collections")', expect: "精选合集" },
      { key: "Events", selector: 'a:visible:has-text("Events")', expect: "活动" },
      { key: "GitHub Sponsors", selector: 'a:visible:has-text("GitHub Sponsors")', expect: "GitHub 赞助" },
      { key: "Interest heading", selector: 'h2:visible:has-text("Here")', expect: "GitHub 推荐" }
    ]
  },
  {
    name: "repo",
    url: "https://github.com/github/docs",
    probes: [
      { key: "Issues", selector: 'a[href$="/github/docs/issues"]', expect: "议题区" },
      { key: "Pull requests", selector: 'a[href$="/github/docs/pulls"]', expect: "合并请求区" },
      { key: "Actions", selector: 'a[href$="/github/docs/actions"]', expect: "自动化流程" },
      { key: "Projects", selector: 'a[href$="/github/docs/projects"]', expect: "项目看板" },
      { key: "Security", selector: 'a[href$="/github/docs/security"]', expect: "安全" }
    ]
  },
  {
    name: "issues",
    url: "https://github.com/github/docs/issues",
    probes: [
      { key: "Search query is:issue", selector: 'input#issues-index-filter-input[placeholder="Search issues"]', expect: "只看议题" },
      { key: "Labels", selector: 'a:visible[href$="/github/docs/labels"]:has-text("Labels")', expect: "标签" },
      { key: "Milestones", selector: 'a:visible[href$="/github/docs/milestones"]:has-text("Milestones")', expect: "里程碑" }
    ]
  },
  {
    name: "pulls",
    url: "https://github.com/github/docs/pulls",
    probes: [
      { key: "Pull requests", selector: 'a[href$="/github/docs/pulls"]', expect: "合并请求区" }
    ]
  },
  {
    name: "actions",
    url: "https://github.com/github/docs/actions",
    probes: [
      { key: "Actions", selector: 'a[href$="/github/docs/actions"]', expect: "自动化流程" }
    ]
  },
  {
    name: "file",
    url: "https://github.com/github/docs/blob/main/README.md",
    probes: [
      { key: "Raw", selector: 'a[href*="/raw/"]:has-text("Raw")', expect: "原始内容" },
      { key: "Blame", selector: 'button:visible:has-text("Blame")', expect: "逐行追溯" }
    ]
  },
  {
    name: "commits",
    url: "https://github.com/github/docs/commits/main",
    probes: [
      { key: "Commits", selector: 'a[href*="/commits/"]', expect: "提交历史" }
    ]
  },
  {
    name: "branches",
    url: "https://github.com/github/docs/branches",
    probes: [
      { key: "Branches", selector: 'a[href$="/github/docs/branches"]', expect: "分支列表" }
    ]
  },
  {
    name: "releases",
    url: "https://github.com/github/docs/releases",
    probes: [
      { key: "Releases", selector: 'a[href$="/github/docs/releases"]', expect: "发布版本" },
      { key: "Tags", selector: 'a:visible[href$="/github/docs/tags"]:has-text("Tags")', expect: "标签版本" }
    ]
  },
  {
    name: "compare",
    url: "https://github.com/github/docs/compare",
    probes: [
      { key: "Compare", selector: 'a[href*="/compare"]', expect: "对比差异" }
    ]
  }
];

async function getExtensionInfo(context) {
  const page = await context.newPage();
  await page.goto("chrome://extensions/");
  const info = await page.evaluate(
    () =>
      new Promise((resolve) => {
        if (!chrome.developerPrivate) {
          resolve({ hasDeveloperPrivate: false, extensions: [] });
          return;
        }

        chrome.developerPrivate.getExtensionsInfo(
          { includeDisabled: true, includeTerminated: true },
          (extensions) => {
            resolve({
              hasDeveloperPrivate: true,
              extensions: extensions.map((extension) => ({
                id: extension.id,
                name: extension.name,
                state: extension.state,
                location: extension.location,
                path: extension.path,
                manifestErrors: extension.manifestErrors || []
              }))
            });
          }
        );
      })
  );
  await page.close();
  return info;
}

async function verifyProbe(page, probe) {
  const locator = page.locator(probe.selector).first();
  if ((await locator.count()) === 0) {
    return { key: probe.key, status: "missing", selector: probe.selector };
  }

  await page.mouse.move(1, 1);
  await page
    .locator(".github-cn-hover-tooltip.is-visible")
    .waitFor({ state: "hidden", timeout: 800 })
    .catch(() => {});
  await locator.scrollIntoViewIfNeeded({ timeout: 5000 });
  await locator.hover({ timeout: 5000 });

  const tooltip = page
    .locator(".github-cn-hover-tooltip.is-visible")
    .filter({ hasText: probe.expect })
    .first();
  await tooltip.waitFor({ state: "visible", timeout: 2000 });

  const text = (await tooltip.innerText()).replace(/\s+/g, " ").trim();
  await page.mouse.move(1, 1);

  return { key: probe.key, status: "ok", tooltip: text };
}

async function main() {
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: "chromium",
    headless: false,
    viewport: { width: 1440, height: 1000 },
    args: [
      `--disable-extensions-except=${extensionDir}`,
      `--load-extension=${extensionDir}`,
      "--enable-unsafe-extension-debugging",
      "--no-first-run",
      "--no-default-browser-check"
    ]
  });

  try {
    const extensionInfo = await getExtensionInfo(context);
    const loaded = extensionInfo.extensions.find(
      (extension) => extension.name === "GitHub 中文悬浮助手"
    );

    const report = {
      extensionDir,
      userDataDir,
      extensionLoaded: Boolean(loaded),
      extensionInfo,
      pages: []
    };

    const page = context.pages()[0] || (await context.newPage());
    for (const spec of pages) {
      await page.goto(spec.url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});

      const result = { name: spec.name, url: page.url(), ok: [], missing: [], failed: [] };
      for (const probe of spec.probes) {
        try {
          const probeResult = await verifyProbe(page, probe);
          result[probeResult.status].push(probeResult);
        } catch (error) {
          result.failed.push({
            key: probe.key,
            status: "failed",
            reason: error.message
          });
        }
      }
      report.pages.push(result);
    }

    console.log(JSON.stringify(report, null, 2));

    const failedCount = report.pages.reduce(
      (count, item) => count + item.missing.length + item.failed.length,
      loaded ? 0 : 1
    );
    process.exitCode = failedCount > 0 ? 1 : 0;
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
