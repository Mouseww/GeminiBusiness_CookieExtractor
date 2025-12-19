# GeminiBusiness_CookieExtractor - Chrome 插件

[![GitHub stars](https://img.shields.io/github/stars/Mouseww/GeminiBusiness_CookieExtractor?style=social)](https://github.com/Mouseww/GeminiBusiness_CookieExtractor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Mouseww/GeminiBusiness_CookieExtractor?style=social)](https://github.com/Mouseww/GeminiBusiness_CookieExtractor/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Mouseww/GeminiBusiness_CookieExtractor)](https://github.com/Mouseww/GeminiBusiness_CookieExtractor/issues)
[![GitHub license](https://img.shields.io/github/license/Mouseww/GeminiBusiness_CookieExtractor)](https://github.com/Mouseww/GeminiBusiness_CookieExtractor/blob/main/LICENSE)

自动提取 Gemini Business 账号信息和 Cookies 的 Chrome 浏览器插件。

**项目地址**: [https://github.com/Mouseww/GeminiBusiness_CookieExtractor](https://github.com/Mouseww/GeminiBusiness_CookieExtractor)

## 功能说明

当访问 `https://business.gemini.google/home/cid*` 页面时，自动提取以下信息：
- **Team ID** (`cid`)
- **Session Index** (`csesidx`)
- **__Secure-C_SES** Cookie（包含 httpOnly）
- **__Host-C_OSES** Cookie（包含 httpOnly）
- **User Agent** 信息

插件会自动在页面右上角显示提取结果，并提供一键复制功能。

## 核心特性

✅ **自动提取** - 页面加载时自动提取账号信息和 Cookies  
✅ **httpOnly 支持** - 可以获取 httpOnly 属性的 Cookies  
✅ **可视化界面** - 右上角浮窗显示提取结果  
✅ **一键复制** - JSON 格式数据，方便使用  
✅ **实时监控** - 同时监听网络请求和使用 Cookies API 双重保障

## 项目结构

```text
GeminiBusiness_CookieExtractor/
├── manifest.json      # 插件配置文件（Manifest V3）
├── background.js      # 后台服务工作脚本（监听网络请求和获取 Cookies）
├── content.js         # 内容脚本（页面交互和结果显示）
├── icons/            # 插件图标文件夹
│   ├── icon.svg      # SVG 矢量图标
│   ├── icon16.png    # 16x16 图标
│   ├── icon48.png    # 48x48 图标
│   └── icon128.png   # 128x128 图标
└── README.md         # 说明文档
```

## 安装步骤

### 方法一：开发者模式加载（推荐）

1. **打开 Chrome 扩展管理页面**
   - 在地址栏输入 `chrome://extensions/` 并回车
   - 或者点击右上角菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 在右上角开启「开发者模式」开关

3. **加载插件**
   - 点击左上角的「加载已解压的扩展程序」
   - 选择 `GeminiBusiness_CookieExtractor` 文件夹
   - 插件安装完成！✅

4. **验证安装**
   - 确认插件列表中出现 "Auto GB Cookies Script"
   - 确认权限包含：`activeTab`、`scripting`、`cookies`、`webRequest`

### 方法二：检查和更新

如果已经安装过旧版本，建议：

1. 在 `chrome://extensions/` 找到插件
2. 点击「刷新」按钮（重新加载插件）
3. 查看「详细信息」确认权限正确

## 使用方法

### 1. 访问 Gemini Business 页面

确保已登录 Gemini Business，然后访问任意团队页面：

```text
https://business.gemini.google/home/cid/YOUR_TEAM_ID?csesidx=YOUR_SESSION_INDEX
```

### 2. 自动提取信息

页面加载完成后，插件会：

- 🔍 自动提取 URL 中的 `cid` 和 `csesidx`
- 🍪 使用 `chrome.cookies` API 获取 httpOnly Cookies
- 📡 同时监听网络请求头作为备用方案
- ✅ 在页面右上角显示提取结果

### 3. 复制结果

点击浮窗中的「📋 复制 JSON」按钮，即可获得如下格式的数据：

```json
{
  "team_id": "your_team_id",
  "secure_c_ses": "your_secure_c_ses_cookie_value",
  "host_c_oses": "your_host_c_oses_cookie_value",
  "csesidx": "your_session_index",
  "user_agent": "Mozilla/5.0 ..."
}
```

## 工作原理

### 双重获取机制

插件采用两种方式同时获取 Cookies，确保成功率：

1. **chrome.cookies API**（主要方式）
   - 可以直接读取 httpOnly cookies
   - 权限：需要 `cookies` 权限
   - 优先使用此方式

2. **webRequest 监听**（备用方式）
   - 监听网络请求头中的 Cookie
   - 权限：需要 `webRequest` 权限
   - 当 API 方式失败时作为备选

### 技术架构

- **Manifest V3**: 使用最新的扩展清单版本
- **Service Worker**: 后台持久监听和处理
- **Content Script**: 页面注入和 UI 显示
- **消息通信**: background.js ↔ content.js

## 调试技巧

### 1. 查看控制台日志

**页面控制台**（F12）：
- 查看 content.js 的执行日志
- 显示 Cookie 提取结果
- 显示调试信息和错误

**Service Worker 控制台**：
- 访问 `chrome://extensions/`
- 找到插件，点击「Service Worker」
- 查看 background.js 的日志
- 查看网络请求监听情况

### 2. 验证权限

在 `chrome://extensions/` 页面：

- 确认插件已启用
- 点击「详细信息」
- 检查「权限」部分包含：
  - 读取和修改您在数据中的数据
  - 读取您的浏览记录
  - 与网站交互

### 3. 重新加载插件

修改代码后必须重新加载：

1. 访问 `chrome://extensions/`
2. 找到插件
3. 点击「刷新」按钮（🔄）
4. 刷新目标网页

## 常见问题

### Q1: Cookie 提取失败或为空？

**可能原因：**

- 未登录 Gemini Business
- 不在正确的页面（URL 必须匹配 `https://business.gemini.google/home/cid*`）
- Cookies 已过期
- 网络请求尚未发生

**解决方法：**

1. 确保已登录 Gemini Business
2. 在页面上执行操作（点击、滚动）触发网络请求
3. 刷新页面重试
4. 检查 Service Worker 控制台是否有错误

### Q2: 无法访问 Service Worker 控制台？

1. 访问 `chrome://extensions/`
2. 找到 "Auto GB Cookies Script"
3. 点击蓝色的「Service Worker」链接
4. 如果显示 "inactive"，先访问目标页面激活

### Q3: 提示权限不足？

**检查步骤：**

1. 打开 `chrome://extensions/`
2. 找到插件，点击「详细信息」
3. 向下滚动到「网站访问权限」
4. 确保包含 `https://*.google/*` 等域名

**解决方法：**

- 删除插件后重新安装
- 或在权限设置中手动添加网站权限

### Q4: httpOnly Cookie 仍然获取不到？

确认以下几点：

- manifest.json 中包含 `"cookies"` 权限 ✅
- background.js 使用了 `chrome.cookies.get()` API ✅
- 目标 Cookie 确实存在（在 DevTools > Application > Cookies 中查看）

### Q5: 如何修改匹配的网址范围？

编辑 `manifest.json`：

```json
{
  "content_scripts": [
    {
      "matches": ["https://business.gemini.google/home/cid*"],
      ...
    }
  ],
  "host_permissions": [
    "https://*.google/*",
    "https://*.google.com/*",
    ...
  ]
}
```

修改后需要重新加载插件。

## 注意事项

⚠️ **隐私和安全**

- 此插件仅用于个人账号管理和开发测试
- 不要分享提取的 Cookie 信息
- Cookies 可能包含敏感信息，请妥善保管
- 定期检查和更新插件权限

⚠️ **使用限制**

- 仅在 Gemini Business 相关域名工作
- 需要先登录才能获取有效 Cookies
- Cookies 有有效期，过期后需重新获取

## 技术支持

如遇到问题：

1. 查看控制台日志（F12 和 Service Worker）
2. 确认 URL 和权限配置正确
3. 尝试重新加载插件
4. 检查 Chrome 版本（建议最新版）

## 更新日志

### v1.0.0 (2025-12-19)

- ✨ 支持提取 httpOnly Cookies
- 🔄 双重获取机制（chrome.cookies API + webRequest 监听）
- 🎨 可视化浮窗显示结果
- 📋 一键复制 JSON 格式数据
- 🐛 修复无法获取 httpOnly Cookie 的问题

## 许可证

MIT License

---

## 贡献

欢迎提交 Issue 和 Pull Request！

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！

**项目地址**: [https://github.com/Mouseww/GeminiBusiness_CookieExtractor](https://github.com/Mouseww/GeminiBusiness_CookieExtractor)

---

**项目名称**: GeminiBusiness_CookieExtractor  
**作者**: [Mouseww](https://github.com/Mouseww)  
**版本**: 1.0.0  
**更新日期**: 2025年12月19日
