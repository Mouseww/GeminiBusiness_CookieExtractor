# Auto GB Cookies - Chrome 插件

自动在访问 Google Business 页面时执行脚本的 Chrome 浏览器插件。

## 功能说明

当访问 `https://business.gemini.google/home/cid*` 开头的网页时，自动执行预设的 JavaScript 代码。

## 项目结构

```
AutoGBCookies/
├── manifest.json      # 插件配置文件
├── content.js         # 自动执行的脚本
├── icons/            # 插件图标文件夹
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # 说明文档
```

## 安装步骤

### 1. 准备图标文件

在 `icons/` 文件夹中添加三个尺寸的图标文件：
- `icon16.png` (16x16 像素)
- `icon48.png` (48x48 像素)
- `icon128.png` (128x128 像素)

如果暂时没有图标，可以使用任意 PNG 图片，或者在线生成简单图标。

### 2. 加载插件到 Chrome

1. 打开 Chrome 浏览器
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 在右上角开启「开发者模式」
4. 点击左上角的「加载已解压的扩展程序」
5. 选择 `AutoGBCookies` 文件夹
6. 插件安装完成！

## 自定义脚本

在 `content.js` 文件中的 `autoExecute()` 函数内添加你想要执行的代码：

```javascript
function autoExecute() {
    console.log('开始执行自动化任务...');
    
    // 在这里添加你的代码
    // 例如:
    
    // 1. 查找并点击某个按钮
    const button = document.querySelector('button.your-class');
    if (button) {
        button.click();
    }
    
    // 2. 自动填写表单
    const input = document.querySelector('#your-input');
    if (input) {
        input.value = '你的内容';
    }
    
    // 3. 获取页面数据
    const data = document.querySelector('.your-data');
    console.log('获取的数据:', data?.textContent);
}
```

## 使用说明

1. 确保插件已在 Chrome 中启用
2. 访问 `https://business.gemini.google/home/cid*` 开头的任意页面
3. 脚本将自动执行
4. 打开浏览器控制台（F12）可以查看执行日志

## 调试技巧

1. **查看控制台日志**：按 F12 打开开发者工具，查看 Console 标签页
2. **检查插件状态**：在 `chrome://extensions/` 页面查看插件是否已启用
3. **刷新插件**：修改代码后，在扩展程序页面点击刷新按钮重新加载插件
4. **检查权限**：确保插件有访问目标网站的权限

## 常见问题

**Q: 脚本没有执行？**
- 检查 URL 是否匹配 `https://business.gemini.google/home/cid*`
- 在 `chrome://extensions/` 确认插件已启用
- 打开控制台查看是否有错误信息

**Q: 如何修改匹配的网址？**
- 编辑 `manifest.json` 中的 `matches` 和 `host_permissions` 字段

**Q: 如何在页面加载后延迟执行？**
```javascript
setTimeout(() => {
    // 延迟执行的代码
}, 2000); // 延迟 2 秒
```

## 许可证

MIT License
