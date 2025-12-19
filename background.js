// Background Service Worker
console.log('Background Service Worker 已加载');

// 存储捕获到的 Cookie
let capturedCookies = {
    secure_c_ses: '',
    host_c_oses: '',
    lastUpdate: null
};

// 请求计数器（用于调试）
let requestCount = 0;

// 监听网络请求，提取 Cookie
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        requestCount++;
        
        if (details.requestHeaders) {
            const cookieHeader = details.requestHeaders.find(
                header => header.name.toLowerCase() === 'cookie'
            );
            
            if (cookieHeader && cookieHeader.value) {
                const cookies = cookieHeader.value;
                
                // 调试：每10个请求输出一次统计
                if (requestCount % 10 === 0) {
                    console.log(`已监听 ${requestCount} 个请求`);
                }
                
                // 提取 __Secure-C_SES
                const secureMatch = cookies.match(/__Secure-C_SES=([^;]+)/);
                if (secureMatch && secureMatch[1]) {
                    if (capturedCookies.secure_c_ses !== secureMatch[1]) {
                        capturedCookies.secure_c_ses = secureMatch[1];
                        capturedCookies.lastUpdate = new Date().toISOString();
                        console.log('✓ 捕获到 __Secure-C_SES:', secureMatch[1].substring(0, 30) + '...', 'URL:', details.url);
                    }
                }
                
                // 提取 __Host-C_OSES
                const hostMatch = cookies.match(/__Host-C_OSES=([^;]+)/);
                if (hostMatch && hostMatch[1]) {
                    if (capturedCookies.host_c_oses !== hostMatch[1]) {
                        capturedCookies.host_c_oses = hostMatch[1];
                        capturedCookies.lastUpdate = new Date().toISOString();
                        console.log('✓ 捕获到 __Host-C_OSES:', hostMatch[1].substring(0, 30) + '...', 'URL:', details.url);
                    }
                }
            }
        }
    },
    { 
        urls: [
            "https://*.google/*",
            "https://*.google.com/*",
            "https://*.googleapis.com/*",
            "https://*.gstatic.com/*"
        ] 
    },
    ["requestHeaders"]
);

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        console.log('收到获取 Cookie 请求');
        console.log('已监听请求总数:', requestCount);
        console.log('当前从请求头捕获的 Cookie:', {
            secure_c_ses: capturedCookies.secure_c_ses ? `已捕获 (${capturedCookies.secure_c_ses.length} 字符)` : '未捕获',
            host_c_oses: capturedCookies.host_c_oses ? `已捕获 (${capturedCookies.host_c_oses.length} 字符)` : '未捕获',
            lastUpdate: capturedCookies.lastUpdate
        });
        
        // 使用 chrome.cookies API 获取 httpOnly cookies
        const url = request.url || 'https://business.gemini.google';
        
        Promise.all([
            chrome.cookies.get({
                url: url,
                name: '__Secure-C_SES'
            }),
            chrome.cookies.get({
                url: url,
                name: '__Host-C_OSES'
            })
        ]).then(([secureCSESCookie, hostCOSESCookie]) => {
            console.log('✅ 使用 chrome.cookies API 获取结果:');
            console.log('__Secure-C_SES:', secureCSESCookie ? `✓ 已获取 (长度: ${secureCSESCookie.value.length}, httpOnly: ${secureCSESCookie.httpOnly})` : '❌ 未找到');
            console.log('__Host-C_OSES:', hostCOSESCookie ? `✓ 已获取 (长度: ${hostCOSESCookie.value.length}, httpOnly: ${hostCOSESCookie.httpOnly})` : '❌ 未找到');
            
            // 优先使用 chrome.cookies API 的结果，如果不存在则使用从请求头捕获的
            const secure_c_ses = secureCSESCookie?.value || capturedCookies.secure_c_ses;
            const host_c_oses = hostCOSESCookie?.value || capturedCookies.host_c_oses;
            
            sendResponse({
                success: true,
                cookies: {
                    secure_c_ses: secure_c_ses,
                    host_c_oses: host_c_oses
                },
                debug: {
                    lastUpdate: capturedCookies.lastUpdate,
                    hasBothCookies: !!(secure_c_ses && host_c_oses),
                    requestCount: requestCount,
                    fromCookiesAPI: {
                        secure_c_ses: !!secureCSESCookie,
                        host_c_oses: !!hostCOSESCookie
                    },
                    cookieDetails: {
                        secure_c_ses_httpOnly: secureCSESCookie?.httpOnly,
                        host_c_oses_httpOnly: hostCOSESCookie?.httpOnly
                    }
                }
            });
        }).catch(error => {
            console.error('❌ 获取 Cookie 时出错:', error);
            
            // 出错时使用从请求头捕获的 Cookie
            sendResponse({
                success: true,
                cookies: {
                    secure_c_ses: capturedCookies.secure_c_ses,
                    host_c_oses: capturedCookies.host_c_oses
                },
                debug: {
                    lastUpdate: capturedCookies.lastUpdate,
                    hasBothCookies: !!(capturedCookies.secure_c_ses && capturedCookies.host_c_oses),
                    requestCount: requestCount,
                    error: error.message
                }
            });
        });
        
        return true; // 保持消息通道打开以进行异步响应
    }
});
