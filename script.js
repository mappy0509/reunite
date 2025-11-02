/* * Reunite Group コーポレートサイト
 * メインスクリプト (script.js)
 */

document.addEventListener('DOMContentLoaded', (event) => {
    
    // ===== ページ切り替え機能 =====
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-section');
    const header = document.querySelector('header');
    // ヘッダーの高さを取得 (デフォルト80px)
    const headerHeight = header ? header.offsetHeight : 80; 

    // ページ表示を管理する関数
    function showPage(pageId) {
        // 全てのページを非表示
        pages.forEach(page => {
            page.classList.add('hidden');
        });

        // 対象のページを表示
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            // ページの先頭にスクロール
            window.scrollTo(0, 0);

            // 新しいページのアニメーション要素をトリガー
            triggerScrollAnimations(targetPage);
        }

        // モバイルメニューを閉じる
        document.getElementById('mobile-menu').classList.add('hidden');
        document.getElementById('hamburger-btn').classList.remove('mobile-menu-open');
    }

    // ナビリンクのクリックイベント
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            showPage(pageId);
        });
    });

    // ===== ハンバーガーメニュー機能 =====
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('mobile-menu-open');
        mobileMenu.classList.toggle('hidden');
    });
    
    // ===== コピーライトの年を自動更新 =====
    // id="current-year" が存在する場合のみ実行
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ===== スクロールアニメーション機能 =====
    let observer;

    function setupIntersectionObserver() {
        const options = {
            root: null, // ビューポートを基準
            rootMargin: '0px',
            threshold: 0.1 // 10%見えたらトリガー
        };

        observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // 一度表示したら監視を解除
                }
            });
        }, options);
    }

    // ページ内の.scroll-animate要素を監視する関数
    function triggerScrollAnimations(container) {
        // 既存のObserverがあれば切断
        if (observer) {
            observer.disconnect();
        }
        
        // Observerをセットアップ
        setupIntersectionObserver();
        
        // コンテナ内のアニメーション対象要素を取得して監視
        const elements = container.querySelectorAll('.scroll-animate');
        elements.forEach(el => {
            // 監視する前に、もし 'is-visible' が残っていたら一度消してアニメーションをリセット
            el.classList.remove('is-visible');
            observer.observe(el);
        });
    }

    // ===== 初期表示 =====
    setupIntersectionObserver();
    // 初期表示時に'home'をアクティブにする
    showPage('home');
});
