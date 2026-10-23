(function () {
  function register(source) {
    window.GitHubCnHoverTermSources = window.GitHubCnHoverTermSources || [];
    window.GitHubCnHoverTermSources.push(source);
  }

  const terms = {
    "set status": ["Set status", "设置状态", "设置你的 GitHub 个人状态，让别人知道你当前是否可联系或正在做什么。"],
    profile: ["Profile", "个人主页", "查看你的 GitHub 个人主页、贡献记录、项目和公开资料。"],
    repositories: ["Repositories", "仓库列表", "查看你创建、拥有或参与维护的代码仓库。"],
    stars: ["Stars", "收藏列表", "查看你点过 Star 收藏的仓库。"],
    gists: ["Gists", "代码片段", "查看和管理你保存的代码片段、笔记或小型示例。"],
    organizations: ["Organizations", "组织", "查看你加入或管理的 GitHub 组织。"],
    enterprises: ["Enterprises", "企业账号", "查看你所属的 GitHub Enterprise 企业账号。"],
    sponsors: ["Sponsors", "赞助", "查看 GitHub Sponsors 相关入口，支持或管理开源赞助。"],
    settings: ["Settings", "设置", "管理账号、安全、通知、SSH Key、开发者设置等个人配置。"],
    "copilot settings": ["Copilot settings", "Copilot 设置", "管理 GitHub Copilot 的订阅、权限、偏好和相关配置。"],
    "feature preview": ["Feature preview", "功能预览", "提前开启或关闭 GitHub 正在测试的新功能。"],
    appearance: ["Appearance", "外观", "设置 GitHub 的主题、深色模式和界面显示偏好。"],
    accessibility: ["Accessibility", "无障碍", "设置动画、快捷键、对比度等无障碍访问偏好。"],
    "try enterprise": ["Try Enterprise", "试用企业版", "了解或试用 GitHub Enterprise 企业版能力。"],
    "sign out": ["Sign out", "退出登录", "退出当前 GitHub 账号。"],
    "switch account": ["Switch account", "切换账号", "在多个 GitHub 账号之间切换。"]
  };

  register({ name: "account", matches: [], terms, pathRules: [] });
})();
