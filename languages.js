// 🗂️ 文件1：languages.js （直接上传到根目录）
const translations = {
    'zh': {
        // 网站基本信息
        title: 'LibreTV - 免费在线视频搜索与观看平台',
        slogan: '自由观影，畅享精彩',
        
        // 搜索相关
        searchPlaceholder: '输入关键词搜索视频...',
        searchButton: '搜索',
        searching: '搜索中...',
        noResults: '没有找到相关视频',
        
        // 播放器
        episodes: '选集',
        loading: '加载中...',
        playError: '播放失败',
        
        // 设置
        settings: '设置',
        language: '语言设置',
        close: '关闭',
        save: '保存',
        
        // 消息
        success: '操作成功',
        error: '操作失败',
        
        // 其他
        about: '关于',
        home: '首页'
    },
    
    'en': {
        title: 'LibreTV - Free Online Video Search & Streaming',
        slogan: 'Free Streaming, Endless Entertainment',
        
        searchPlaceholder: 'Enter keywords to search videos...',
        searchButton: 'Search',
        searching: 'Searching...',
        noResults: 'No videos found',
        
        episodes: 'Episodes',
        loading: 'Loading...',
        playError: 'Playback failed',
        
        settings: 'Settings',
        language: 'Language',
        close: 'Close',
        save: 'Save',
        
        success: 'Success',
        error: 'Error',
        
        about: 'About',
        home: 'Home'
    },
    
    'ja': {
        title: 'LibreTV - 無料オンライン動画検索・視聴',
        slogan: '自由な視聴、素晴らしいエンターテイメント',
        
        searchPlaceholder: 'キーワードを入力して動画を検索...',
        searchButton: '検索',
        searching: '検索中...',
        noResults: '動画が見つかりません',
        
        episodes: 'エピソード',
        loading: '読み込み中...',
        playError: '再生に失敗',
        
        settings: '設定',
        language: '言語',
        close: '閉じる',
        save: '保存',
        
        success: '成功',
        error: 'エラー',
        
        about: 'について',
        home: 'ホーム'
    }
};

// 🗂️ 文件2：simple-i18n.js （直接上传到根目录）
class SimpleI18n {
    constructor() {
        this.currentLang = this.getCurrentLanguage();
        this.init();
    }
    
    getCurrentLanguage() {
        // 1. 检查本地存储
        const saved = localStorage.getItem('libretv-lang');
        if (saved && translations[saved]) return saved;
        
        // 2. 检查浏览器语言
        const browser = navigator.language || 'zh';
        if (browser.startsWith('zh')) return 'zh';
        if (browser.startsWith('ja')) return 'ja';
        if (browser.startsWith('en')) return 'en';
        
        return 'zh'; // 默认中文
    }
    
    init() {
        this.updatePage();
        this.addLanguageSwitcher();
        this.bindEvents();
    }
    
    updatePage() {
        const texts = translations[this.currentLang];
        
        // 更新页面标题
        document.title = texts.title;
        
        // 更新所有带有lang-key属性的元素
        document.querySelectorAll('[lang-key]').forEach(el => {
            const key = el.getAttribute('lang-key');
            if (texts[key]) {
                if (el.tagName === 'INPUT' && el.type === 'text') {
                    el.placeholder = texts[key];
                } else if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
                    el.value = texts[key];
                } else {
                    el.textContent = texts[key];
                }
            }
        });
    }
    
    addLanguageSwitcher() {
        // 如果已存在语言切换器，直接返回
        if (document.getElementById('lang-switcher')) return;
        
        // 创建语言切换器HTML
        const switcher = document.createElement('div');
        switcher.innerHTML = `
            <select id="lang-switcher" style="
                padding: 5px 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 14px;
            ">
                <option value="zh" ${this.currentLang === 'zh' ? 'selected' : ''}>中文</option>
                <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>English</option>
                <option value="ja" ${this.currentLang === 'ja' ? 'selected' : ''}>日本語</option>
            </select>
        `;
        
        // 尝试找到合适的位置插入
        const header = document.querySelector('header') || 
                      document.querySelector('nav') || 
                      document.querySelector('.header') ||
                      document.querySelector('.nav');
        
        if (header) {
            header.appendChild(switcher);
        } else {
            // 如果找不到header，插入到页面顶部
            document.body.insertBefore(switcher, document.body.firstChild);
        }
    }
    
    bindEvents() {
        const switcher = document.getElementById('lang-switcher');
        if (switcher) {
            switcher.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });
        }
    }
    
    switchLanguage(lang) {
        if (!translations[lang]) return;
        
        this.currentLang = lang;
        localStorage.setItem('libretv-lang', lang);
        this.updatePage();
        
        // 更新选择器
        const switcher = document.getElementById('lang-switcher');
        if (switcher) switcher.value = lang;
        
        // 触发自定义事件，供其他脚本使用
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }
    
    // 供外部调用的翻译方法
    t(key) {
        return translations[this.currentLang][key] || key;
    }
}

// 自动初始化
let i18n;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n = new SimpleI18n();
        window.i18n = i18n; // 全局访问
    });
} else {
    i18n = new SimpleI18n();
    window.i18n = i18n;
}

// 🗂️ 文件3：lang-styles.css （直接上传到根目录）
/* 语言切换器样式 */
#lang-switcher {
    position: relative;
    padding: 6px 25px 6px 10px !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 6px !important;
    background: white !important;
    font-size: 13px !important;
    cursor: pointer !important;
    outline: none !important;
    transition: all 0.3s ease !important;
    min-width: 80px !important;
}

#lang-switcher:hover {
    border-color: #4CAF50 !important;
    box-shadow: 0 2px 5px rgba(76,175,80,0.2) !important;
}

#lang-switcher:focus {
    border-color: #4CAF50 !important;
    box-shadow: 0 0 0 2px rgba(76,175,80,0.2) !important;
}

/* 消息提示样式 */
.toast-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: #4CAF50;
    color: white;
    border-radius: 6px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
}

.toast-message.error {
    background: #f44336;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* 移动端适配 */
@media (max-width: 768px) {
    #lang-switcher {
        font-size: 12px !important;
        padding: 4px 20px 4px 8px !important;
        min-width: 70px !important;
    }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    #lang-switcher {
        background: #333 !important;
        color: white !important;
        border-color: #555 !important;
    }
    
    #lang-switcher option {
        background: #333 !important;
        color: white !important;
    }
}
