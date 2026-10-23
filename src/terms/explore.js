(function () {
  function register(source) {
    window.GitHubCnHoverTermSources = window.GitHubCnHoverTermSources || [];
    window.GitHubCnHoverTermSources.push(source);
  }

  const terms = {
    explore: ["Explore", "发现项目", "浏览 GitHub 推荐项目、热门仓库、主题和开发者动态。"],
    topics: ["Topics", "主题", "按技术领域或兴趣主题浏览相关仓库。"],
    trending: ["Trending", "趋势榜", "查看近期在 GitHub 上热度上升的仓库和开发者。"],
    collections: ["Collections", "精选合集", "查看 GitHub 按主题整理的一组精选仓库和资源。"],
    events: ["Events", "活动", "查看 GitHub 相关活动、直播、会议和社区事件。"],
    "github sponsors": ["GitHub Sponsors", "GitHub 赞助", "浏览和支持开源项目维护者的赞助入口。"],
    "here's what we found based on your interests...": ["Here's what we found based on your interests...", "根据你的兴趣推荐", "GitHub 根据你的关注、收藏和访问行为推荐可能感兴趣的内容。"],
    "here's what's popular on github today...": ["Here's what's popular on GitHub today...", "GitHub 推荐", "查看 GitHub 今天推荐的热门项目、话题和社区内容。"],
    "trending repository": ["Trending repository", "趋势仓库", "GitHub 当前推荐的热门仓库条目。"],
    "trending repositories today": ["Trending repositories today", "今日趋势仓库", "查看今天在 GitHub 上热度较高的开源仓库。"],
    "starred repositories": ["Starred repositories", "已收藏仓库", "查看你点过 Star 收藏的仓库列表。"],
    "starred topics": ["Starred topics", "已收藏主题", "查看你关注或收藏的 GitHub 主题。"],
    "open source fridays": ["Open Source Fridays", "开源星期五", "GitHub 的开源项目访谈和直播栏目，介绍项目背后的开发者和实践。"]
  };

  const pathRules = [
    [/\/explore(?:\/|$)/, "explore"],
    [/\/topics(?:\/|$)/, "topics"],
    [/\/trending(?:\/|$)/, "trending"],
    [/\/collections(?:\/|$)/, "collections"],
    [/\/events(?:\/|$)/, "events"],
    [/\/sponsors(?:\/|$)/, "github sponsors"]
  ];

  register({
    name: "explore",
    matches: [/^\/explore(?:\/|$)/, /^\/topics(?:\/|$)/, /^\/trending(?:\/|$)/, /^\/collections(?:\/|$)/, /^\/events(?:\/|$)/, /^\/sponsors(?:\/|$)/],
    terms,
    pathRules
  });
})();
