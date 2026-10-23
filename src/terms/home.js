(function () {
  function register(source) {
    window.GitHubCnHoverTermSources = window.GitHubCnHoverTermSources || [];
    window.GitHubCnHoverTermSources.push(source);
  }

  const terms = {
    home: ["Home", "首页", "回到 GitHub 登录后的首页，查看动态、快捷入口和推荐内容。"],
    "top repositories": ["Top repositories", "常用仓库", "显示你最近或经常访问的仓库快捷入口。"],
    "recent activity": ["Recent activity", "最近活动", "显示你最近参与或关注的仓库、Issue、Pull Request 等动态。"],
    "latest changes": ["Latest changes", "最新变化", "查看 GitHub 产品、功能和平台规则的最新更新。"],
    "explore repositories": ["Explore repositories", "发现仓库", "根据你的兴趣发现可能值得关注的开源仓库。"],
    "start a new repository": ["Start a new repository", "新建仓库", "创建一个新的代码仓库，用来托管项目代码和文档。"],
    "import repository": ["Import repository", "导入仓库", "从其它 Git 托管平台导入已有仓库到 GitHub。"],
    "new repository": ["New repository", "新建仓库", "创建一个新的代码仓库。"],
    "find a repository": ["Find a repository", "查找仓库", "在你的仓库列表中按名称搜索并快速进入仓库。"],
    "send feedback": ["Send feedback", "发送反馈", "向 GitHub 反馈当前页面或功能的问题和建议。"],
    feedback: ["Feedback", "反馈", "向 GitHub 提交产品建议、体验问题或错误反馈。"],
    filter: ["Filter", "筛选", "按关键词或条件缩小动态、仓库或通知列表。"],
    following: ["Following", "关注中", "查看你关注的人、组织或仓库产生的动态。"],
    "for you": ["For you", "为你推荐", "GitHub 根据你的使用行为推荐可能感兴趣的内容。"],
    "view all": ["View all", "查看全部", "打开完整列表，查看更多条目。"],
    "show more": ["Show more", "显示更多", "展开列表，查看更多隐藏内容。"],
    "create repository": ["Create repository", "创建仓库", "提交表单并创建新的 GitHub 仓库。"],
    "your teams": ["Your teams", "你的团队", "查看你加入的组织团队和相关协作入口。"],
    "your enterprises": ["Your enterprises", "你的企业", "查看你所属的 GitHub Enterprise 企业账号入口。"],
    "your organizations": ["Your organizations", "你的组织", "查看你所属的 GitHub 组织。"]
  };

  register({
    name: "home",
    matches: [/^\/$/, /^\/home(?:\/|$)/],
    terms,
    pathRules: [[/\/home(?:\/|$)/, "home"]]
  });
})();
