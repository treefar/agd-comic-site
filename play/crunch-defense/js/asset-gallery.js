/* ============================================================
 * Multiverse Pixel V1 素材圖鑑：只讀取 manifest，不把物件烘焙進底圖。
 * ============================================================ */
'use strict';
var CD = window.CD || (window.CD = {});

CD.AssetGallery = (function () {
  const MANIFEST_URL = 'assets/reusable/multiverse_pixel_v1/manifest.json';
  let manifest = null;
  let currentKind = 'characters';

  function $(id) { return document.getElementById(id); }

  function displayName(slug) {
    return String(slug || '').split('_').map(function (part) {
      return part ? part.charAt(0).toUpperCase() + part.slice(1) : '';
    }).join(' ');
  }

  function imageFor(kind, item) {
    if (kind === 'characters') return item.preview.path;
    if (kind === 'scenes') return item.preview.path;
    return item.preview.path;
  }

  function sizeFor(kind, item) {
    const info = kind === 'characters' ? item.base : (kind === 'scenes' ? item.base : item.game);
    return info.width + '×' + info.height;
  }

  function setDetail(kind, item) {
    const image = $('asset-detail-image');
    image.src = imageFor(kind, item);
    image.alt = item.id + ' ' + displayName(item.slug);
    $('asset-detail-title').textContent = item.id + '｜' + displayName(item.slug);
    if (kind === 'characters') {
      $('asset-detail-meta').textContent = '基礎 16×16・4 表情・4 動作・獨立透明影格';
    } else if (kind === 'scenes') {
      $('asset-detail-meta').textContent = '底圖 ' + sizeFor(kind, item) + '・5 件物件以 JSON 配置';
    } else {
      $('asset-detail-meta').textContent = '透明物件 ' + sizeFor(kind, item) + '・8px 網格・預設場景 ' + item.defaultScene;
    }
  }

  function makeCard(kind, item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'asset-card';
    button.setAttribute('aria-label', item.id + ' ' + displayName(item.slug));

    const image = document.createElement('img');
    image.src = imageFor(kind, item);
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = kind === 'scenes' ? 209 : 128;
    image.height = kind === 'scenes' ? 118 : 128;

    const id = document.createElement('b');
    id.textContent = item.id;
    const name = document.createElement('span');
    name.textContent = displayName(item.slug);
    const meta = document.createElement('small');
    meta.textContent = sizeFor(kind, item);

    button.append(image, id, name, meta);
    button.addEventListener('click', function () { setDetail(kind, item); });
    return button;
  }

  function render(kind) {
    if (!manifest) return;
    currentKind = kind;
    document.querySelectorAll('.asset-tab').forEach(function (button) {
      const active = button.dataset.kind === kind;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const grid = $('asset-library-grid');
    grid.replaceChildren();
    const items = manifest[kind];
    items.forEach(function (item) { grid.appendChild(makeCard(kind, item)); });
    if (items.length) setDetail(kind, items[0]);
  }

  function updateStats() {
    const counts = manifest.counts;
    $('asset-library-stats').textContent =
      counts.characters + ' 名角色｜' + counts.expressionFrames + ' 表情影格｜' +
      counts.actionFrames + ' 動作影格｜' + counts.scenes + ' 場景｜' +
      counts.objects + ' 可拆分物件';
  }

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    return fetch(MANIFEST_URL, { cache: 'no-cache' }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }).then(function (data) {
      manifest = data;
      updateStats();
      render(currentKind);
      return data;
    });
  }

  function open() {
    $('asset-library-overlay').classList.remove('hidden');
    loadManifest().catch(function (error) {
      // 這裡有兩種完全不同的失敗，訊息不能混為一談：
      //  a) 用 file:// 直接開 index.html —— fetch 被 CORS 擋掉，換伺服器就好
      //  b) 這個發行版沒有打包素材包 —— 桌面版與單檔版預設不含（167MB），
      //     叫玩家「改用伺服器」是錯的指示，只會讓人白忙
      const isFileProtocol = location.protocol === 'file:';
      $('asset-library-stats').textContent = isFileProtocol
        ? '素材清單載入失敗：' + error.message
        : '這個版本沒有內含素材包';
      $('asset-library-grid').textContent = isFileProtocol
        ? '直接雙擊 index.html 時瀏覽器會擋下讀取，請改用 node tools/serve.js 開啟。'
        : '素材圖鑑需要 assets/reusable/（約 167 MB），桌面發行版預設不打包。'
          + '完整版請用專案原始碼搭配 node tools/serve.js 開啟。';
      // 已經確定拿不到就把入口收起來，不要讓人一直點
      const btn = $('btn-asset-library');
      if (btn && !isFileProtocol) btn.classList.add('hidden');
    });
  }

  function close() { $('asset-library-overlay').classList.add('hidden'); }

  function init() {
    $('btn-asset-library').addEventListener('click', open);
    $('btn-asset-library-close').addEventListener('click', close);
    document.querySelectorAll('.asset-tab').forEach(function (button) {
      button.addEventListener('click', function () { render(button.dataset.kind); });
    });
    window.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !$('asset-library-overlay').classList.contains('hidden')) close();
    });
  }

  return { init: init, open: open, close: close };
})();

window.addEventListener('DOMContentLoaded', function () { CD.AssetGallery.init(); });
