/* * Reunite Group コーポレートサイト
 * メインスクリプト (script.js)
 */

document.addEventListener('DOMContentLoaded', (event) => {
    
    // ===== ページ切り替え機能 =====
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-section');
    const header = document.querySelector('header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let observer;

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
        } else {
            // もしIDが見つからなければ、homeを表示 (フォールバック)
            const homePage = document.getElementById('home');
            if (homePage) {
                homePage.classList.remove('hidden');
                window.scrollTo(0, 0);
                triggerScrollAnimations(homePage);
            }
        }

        // モバイルメニューを閉じる
        mobileMenu.classList.add('hidden');
        hamburgerBtn.classList.remove('mobile-menu-open');
    }

    // ===== ★★★ 新規: ルーティング処理 (Hash変更) ★★★ =====
    // URLのハッシュ（#）に基づいてページを表示する関数
    function handleRouteChange() {
        // URLのハッシュを取得 (例: #syktsr -> syktsr)
        let pageId = location.hash.substring(1);
        
        // ハッシュがない場合 (初期ロード時など) は 'home' をデフォルトにする
        if (!pageId) {
            pageId = 'home';
        }
        
        showPage(pageId);
    }
    // ===== ★★★ 変更ここまで ★★★ =====


    // ===== ★★★ 変更: ナビリンクのクリックイベント ★★★ =====
    // (e.preventDefault() を使って、デフォルトのアンカー動作を止める)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // 必須: ページ内スクロールを無効化
            const pageId = link.dataset.page;
            
            // URLのハッシュを更新 (これにより 'hashchange' イベントが発火する)
            // ただし、現在のハッシュと同じ場合は発火しないので、手動で showPage を呼ぶ
            if (location.hash !== `#${pageId}`) {
                location.hash = pageId;
            } else {
                // すでに同じハッシュの場合 (例: モバイルメニューで同じページを再クリック)
                // hashchangeイベントが発火しないので、手動でshowPageを呼んでメニューを閉じる
                showPage(pageId);
            }
        });
    });
    // ===== ★★★ 変更ここまで ★★★ =====

    // ===== ハンバーガーメニュー機能 =====
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

    // ===== ★★★ 変更: 初期表示処理 ★★★ =====
    setupIntersectionObserver();
    
    // ブラウザの「戻る」「進む」ボタン（hashchangeイベント）をリッスン
    window.addEventListener('hashchange', handleRouteChange);

    // ページロード時に現在のハッシュに基づいてページを表示
    handleRouteChange();
    // ===== ★★★ 変更ここまで =====
});
