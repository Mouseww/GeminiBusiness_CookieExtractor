// 自动执行的脚本
(function () {
    'use strict';

    console.log('Auto GB Cookies Script 已加载');
    console.log('当前URL:', window.location.href);

    // 在这里编写你想要自动执行的代码
    // 例如:

    function autoExecute() {
        console.log('开始执行自动化任务...');
        console.log('💡 正在监听网络请求以捕获 Cookie...');
        
        // 从 URL 获取 cid 和 csesidx
        const urlParams = new URLSearchParams(window.location.search);
        const cid = window.location.pathname.match(/\/cid\/([^\/]+)/)?.[1] || '';
        const csesidx = urlParams.get('csesidx') || '';
        const userAgent = navigator.userAgent;

        // 延迟获取，等待网络请求发生
        setTimeout(() => {
            fetchCookies(cid, csesidx, userAgent);
        }, 1000);
    }

    function fetchCookies(cid, csesidx, userAgent) {
        // 通过 background script 获取从网络请求中捕获的 Cookies
        chrome.runtime.sendMessage(
            { 
                action: 'getCookies',
                url: window.location.href
            },
            (response) => {
                if (!response) {
                    console.error('❌ 未收到 background 响应');
                    console.error('这可能是因为:');
                    console.error('1. background.js 未加载');
                    console.error('2. 扩展未正确重新加载');
                    console.error('3. manifest.json 配置错误');
                    showResult('', '', cid, csesidx, userAgent, true);
                    return;
                }

                if (response.success) {
                    const secureCSES = response.cookies.secure_c_ses;
                    const hostCOSES = response.cookies.host_c_oses;
                    
                    console.log('✅ Cookie 获取成功！');
                    console.log('__Secure-C_SES:', secureCSES ? `✓ 已获取 (长度: ${secureCSES.length})` : '❌ 未找到');
                    console.log('__Host-C_OSES:', hostCOSES ? `✓ 已获取 (长度: ${hostCOSES.length})` : '❌ 未找到');
                    
                    if (response.debug) {
                        console.log('🔍 调试信息:');
                        console.log('- 已监听请求数:', response.debug.requestCount);
                        console.log('- 最后捕获时间:', response.debug.lastUpdate || '从未捕获');
                        console.log('- 两个 Cookie 都已捕获:', response.debug.hasBothCookies ? '✓' : '✗');
                        
                        if (response.debug.fromCookiesAPI) {
                            console.log('- Cookie 来源:');
                            console.log('  __Secure-C_SES:', response.debug.fromCookiesAPI.secure_c_ses ? 'chrome.cookies API' : '请求头捕获');
                            console.log('  __Host-C_OSES:', response.debug.fromCookiesAPI.host_c_oses ? 'chrome.cookies API' : '请求头捕获');
                        }
                        
                        if (response.debug.cookieDetails) {
                            console.log('- Cookie 属性:');
                            console.log('  __Secure-C_SES httpOnly:', response.debug.cookieDetails.secure_c_ses_httpOnly);
                            console.log('  __Host-C_OSES httpOnly:', response.debug.cookieDetails.host_c_oses_httpOnly);
                        }
                        
                        if (!secureCSES || !hostCOSES) {
                            console.log('💡 提示: 如果 Cookie 未捕获，请:');
                            console.log('   1. 查看 Service Worker 控制台（chrome://extensions/ -> Service Worker）');
                            console.log('   2. 在页面上执行任何操作（如点击、滚动）');
                            console.log('   3. 刷新页面重试');
                            console.log('   4. 检查是否有网络请求发送（F12 -> Network）');
                        }
                    }
                    
                    showResult(secureCSES, hostCOSES, cid, csesidx, userAgent, false);
                } else {
                    console.error('❌ 获取 Cookie 失败:', response.error);
                    showResult('', '', cid, csesidx, userAgent, true);
                }
            }
        );
    }

    // 显示结果的独立函数
    function showResult(secureCSES, hostCOSES, cid, csesidx, userAgent, hasError) {
        const result = {
            team_id: cid,
            secure_c_ses: secureCSES,
            host_c_oses: hostCOSES,
            csesidx: csesidx,
            user_agent: userAgent
        };

        // 显示结果
        console.log('📋 请复制以下 JSON 内容：');
        console.log(JSON.stringify(result, null, 2));

        // 创建可视化显示（避免使用 innerHTML，使用 createElement）
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:20px;right:20px;background:white;padding:20px;border:2px solid #4285f4;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:99999;width:500px;max-height:80vh;overflow:auto;font-family:sans-serif;';

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '✅ 账号信息已提取';
        title.style.cssText = 'margin:0 0 12px 0;color:#4285f4;';
        div.appendChild(title);

        // 创建文本域
        const textarea = document.createElement('textarea');
        textarea.value = JSON.stringify(result, null, 2);
        textarea.readOnly = true;
        textarea.style.cssText = 'width:100%;height:200px;font-family:monospace;font-size:12px;padding:8px;border:1px solid #ddd;border-radius:4px;resize:none;';
        div.appendChild(textarea);

        // 创建按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'margin-top:8px;display:flex;gap:8px;';

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 复制 JSON';
        copyBtn.style.cssText = 'padding:8px 16px;background:#4285f4;color:white;border:none;border-radius:4px;cursor:pointer;flex:1;';
        copyBtn.onclick = function () {
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            try {
                document.execCommand('copy');
                copyBtn.textContent = '✅ 已复制！';
                setTimeout(() => {
                    copyBtn.textContent = '📋 复制 JSON';
                }, 2000);
            } catch (e) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textarea.value).then(() => {
                        copyBtn.textContent = '✅ 已复制！';
                        setTimeout(() => {
                            copyBtn.textContent = '📋 复制 JSON';
                        }, 2000);
                    });
                }
            }
        };
        btnContainer.appendChild(copyBtn);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = 'padding:8px 16px;background:#ea4335;color:white;border:none;border-radius:4px;cursor:pointer;flex:1;';
        closeBtn.onclick = function () {
            div.remove();
        };
        btnContainer.appendChild(closeBtn);

        div.appendChild(btnContainer);
        document.body.appendChild(div);

        // 如果 Cookie 为空或有错误,显示警告
        if (hasError || !secureCSES || !hostCOSES) {
            const warning = document.createElement('div');
            if (hasError) {
                warning.innerHTML = `
                    <strong>⚠️ 错误：无法获取 Cookie</strong><br>
                    <small>请按以下步骤操作：<br>
                    1. 打开 chrome://extensions<br>
                    2. 找到此扩展，点击"刷新"按钮<br>
                    3. 确保"权限"包含 cookies<br>
                    4. 刷新此页面重试<br>
                    5. 按 F12 查看控制台日志</small>
                `;
            } else if (!secureCSES && !hostCOSES) {
                warning.innerHTML = `
                    <strong>⚠️ 警告：Cookie 信息为空</strong><br>
                    <small>可能的原因：<br>
                    1. 未登录 Gemini Business<br>
                    2. Cookie 已过期<br>
                    3. 不在正确的页面<br>
                    请确保已登录并在正确页面</small>
                `;
            } else {
                warning.textContent = `⚠️ 部分 Cookie 缺失 - __Secure-C_SES: ${secureCSES ? '✓' : '✗'}, __Host-C_OSES: ${hostCOSES ? '✓' : '✗'}`;
            }
            warning.style.cssText = 'margin-top:8px;padding:8px;background:#fff3e0;color:#f57c00;border-radius:4px;font-size:12px;line-height:1.5;';
            div.insertBefore(warning, textarea);
        }

        return result;
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoExecute);
    } else {
        autoExecute();
    }

    // 如果需要监听页面变化(适用于单页应用)
    const observer = new MutationObserver((mutations) => {
        // console.log('页面发生变化');
        // 可以在这里添加响应页面变化的逻辑
    });

    // 开始观察页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
