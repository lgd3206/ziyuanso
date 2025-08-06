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

