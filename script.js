/*
 * Reunite Group コーポレートサイト
 * メインスクリプト (script.js)
 *  - header.html / footer.html の読み込み
 *  - メニューの開閉・現在ページの印
 *  - スクロールに合わせた出現
 *  - 「赤い糸」の装飾線
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 現在のページ名（例: fukuoka.html） =====
    const currentPage = (location.pathname.split('/').pop() || 'index.html').replace(/^$/, 'index.html');

    const markCurrent = (root) => {
        root.querySelectorAll('a[href]').forEach((a) => {
            if (a.getAttribute('href') === currentPage && !a.classList.contains('brand')) {
                a.setAttribute('aria-current', 'page');
            }
        });
    };

    // ===== ヘッダー =====
    fetch('header.html')
        .then((response) => response.text())
        .then((data) => {
            const placeholder = document.getElementById('header-placeholder');
            if (!placeholder) return;
            placeholder.innerHTML = data;
            markCurrent(placeholder);

            const btn = document.getElementById('hamburger-btn');
            const menu = document.getElementById('mobile-menu');
            if (!btn || !menu) return;

            const setOpen = (open) => {
                document.body.classList.toggle('nav-open', open);
                btn.setAttribute('aria-expanded', String(open));
            };
            btn.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
            menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
            window.addEventListener('resize', () => { if (window.innerWidth >= 1100) setOpen(false); });
        })
        .catch((error) => console.error('Error loading header:', error));

    // ===== フッター =====
    fetch('footer.html')
        .then((response) => response.text())
        .then((data) => {
            const placeholder = document.getElementById('footer-placeholder');
            if (!placeholder) return;
            placeholder.innerHTML = data;
            const year = document.getElementById('current-year');
            if (year) year.textContent = new Date().getFullYear();
        })
        .catch((error) => console.error('Error loading footer:', error));

    // ===== 赤い糸（装飾） =====
    const thread = (viewBox, d, slice) =>
        '<svg class="thread" viewBox="' + viewBox + '" preserveAspectRatio="' + (slice ? 'xMidYMid slice' : 'xMaxYMid meet') +
        '" aria-hidden="true" focusable="false"><path pathLength="1" d="' + d + '"/></svg>';

    const hero = document.querySelector('.hero');
    if (hero) {
        hero.insertAdjacentHTML('beforeend', thread('0 0 1440 800',
            'M-40 590 C 220 470, 400 720, 690 560 S 1060 190, 1190 330 S 1040 600, 930 420 S 1160 110, 1500 210', true));
    }
    document.querySelectorAll('.page-head').forEach((head) => {
        head.insertAdjacentHTML('beforeend', thread('0 0 760 320',
            'M-20 300 C 150 150, 290 330, 420 190 S 610 40, 560 160 S 660 280, 800 70', false));
    });

    // ===== スクロールに合わせた出現 =====
    const targets = document.querySelectorAll('.reveal');

    // 同じ親の中に並ぶ要素は少しずつ遅らせる
    const groups = new Map();
    targets.forEach((el) => {
        const list = groups.get(el.parentElement) || [];
        list.push(el);
        groups.set(el.parentElement, list);
    });
    groups.forEach((list) => {
        if (list.length < 2) return;
        list.forEach((el, i) => el.style.setProperty('--d', (Math.min(i % 4, 3) * 0.09) + 's'));
    });

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => observer.observe(el));
});
