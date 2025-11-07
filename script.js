/* * Reunite Group コーポレートサイト
 * メインスクリプト (script.js)
 * MPA (Multi-Page Application)
 */

document.addEventListener('DOMContentLoaded', (event) => {
    
    // ===== ★★★ 新規: コンポーネント読み込み機能 ★★★ =====
    
    // ヘッダー (header.html) を読み込む
    // 読み込みが完了してから、ハンバーガーメニューのイベントリスナーを設定
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            // id="header-placeholder" の要素にヘッダーを挿入
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }

            // ===== ハンバーガーメニュー機能 (ヘッダー読み込み後に実行) =====
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            if (hamburgerBtn && mobileMenu) {
                hamburgerBtn.addEventListener('click', () => {
                    hamburgerBtn.classList.toggle('mobile-menu-open');
                    mobileMenu.classList.toggle('hidden');
                });
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // フッター (footer.html) を読み込む
    // 読み込みが完了してから、コピーライト年の更新を実行
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            // id="footer-placeholder" の要素にフッターを挿入
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }

            // ===== コピーライトの年を自動更新 (フッター読み込み後に実行) =====
            const currentYearEl = document.getElementById('current-year');
            if (currentYearEl) {
                currentYearEl.textContent = new Date().getFullYear();
            }

            // ===== ★★★ 新規: フッターアコーディオン機能 (フッター読み込み後に実行) ★★★ =====
            const footerToggles = document.querySelectorAll('.footer-accordion-toggle');
            footerToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    
                    // md (768px) 以上のスクリーンではJSによるトグルを無効化 (CSSで制御するため)
                    if (window.innerWidth >= 768) {
                        return;
                    }

                    const content = toggle.nextElementSibling;
                    const icon = toggle.querySelector('.footer-accordion-icon');
                    
                    if (content && content.classList.contains('footer-accordion-content')) {
                        // 'hidden' クラスをトグルする
                        content.classList.toggle('hidden');
                        
                        // アイコンのテキストをトグルする
                        if (icon) {
                            if (content.classList.contains('hidden')) {
                                icon.textContent = '+';
                            } else {
                                icon.innerHTML = '&minus;'; // マイナス記号
                            }
                        }
                    }
                });
            });

        })
        .catch(error => console.error('Error loading footer:', error));

    
    // ===== スクロールアニメーション機能 =====
    // (SPAの時と異なり、ページロード時に一度だけ実行すれば良い)
    
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
    function initializeScrollAnimations() {
        // Observerをセットアップ
        setupIntersectionObserver();
        
        // ページ内のすべてのアニメーション対象要素を取得して監視
        const elements = document.querySelectorAll('.scroll-animate');
        elements.forEach(el => {
            // 監視する前に、もし 'is-visible' が残っていたら一度消してアニメーションをリセット
            el.classList.remove('is-visible');
            observer.observe(el);
        });
    }

    // ===== ★★★ 変更: 初期表示処理 ★★★ =====
    // スクロールアニメーションの初期化のみ実行
    initializeScrollAnimations();
});