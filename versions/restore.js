/* 金鶯官網後台：把存檔版本載回編輯器（由書籤載入，見 versions/README.md）。
   Works on common.php?act=edit&id=N (CMS pages), config.php?act=bottominfo (頁尾資訊) and config.php?act=code (轉換代碼).
   It only fills the editor; nothing is saved until 確認送出 is pressed. */
(function () {
  'use strict';
  var RAW = 'https://raw.githubusercontent.com/floatingbubblejesse-bit/drking-booking/main/versions/';
  var old = document.getElementById('dk-restore-panel');
  if (old) old.remove();
  var q = new URLSearchParams(location.search), act = q.get('act'), path = location.pathname, match = null, field = null;
  if (/\/sys_manage\/common\.php$/.test(path) && act === 'edit' && /^\d+$/.test(q.get('id') || '')) {
    var prefix = 'cms-' + String(q.get('id')).padStart(2, '0') + '-';
    match = function (item) { return item.key.indexOf(prefix) === 0; };
    field = 'content';
  } else if (/\/sys_manage\/config\.php$/.test(path) && act === 'bottominfo') {
    match = function (item) { return item.key === 'footer-info'; };
    field = 'contents[91]';
  } else if (/\/sys_manage\/config\.php$/.test(path) && act === 'code') {
    match = function (item) { return item.key === 'head-code'; };
    field = 'gadsevent';
  }

  var box = document.createElement('div');
  box.id = 'dk-restore-panel';
  box.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647;width:340px;padding:14px 16px;border:2px solid #2e8f87;border-radius:12px;background:#fff;box-shadow:0 8px 30px rgba(0,0,0,.25);font:14px/1.6 -apple-system,"Microsoft JhengHei",sans-serif;color:#24352f';
  box.innerHTML = '<div style="font-weight:700;font-size:16px;margin-bottom:8px">回復存檔版本</div>'
    + '<label style="display:block;margin-bottom:6px">版本 <select id="dk-restore-ver" style="margin-left:6px;min-width:200px"></select></label>'
    + '<div id="dk-restore-msg" style="min-height:44px;margin:6px 0 10px;color:#3d4b45">讀取版本清單…</div>'
    + '<button type="button" id="dk-restore-load" disabled style="padding:6px 14px;margin-right:8px;border:0;border-radius:8px;background:#2e8f87;color:#fff;cursor:pointer">載入到編輯器</button>'
    + '<button type="button" id="dk-restore-close" style="padding:6px 14px;border:1px solid #bbb;border-radius:8px;background:#fff;cursor:pointer">關閉</button>';
  document.body.appendChild(box);
  var sel = box.querySelector('#dk-restore-ver'), msg = box.querySelector('#dk-restore-msg'), load = box.querySelector('#dk-restore-load');
  box.querySelector('#dk-restore-close').onclick = function () { box.remove(); };
  function say(text, bad) { msg.textContent = text; msg.style.color = bad ? '#a1262e' : '#3d4b45'; }
  if (!match) { say('請在後台的「單元頁面編輯」、「頁尾資訊」或「追蹤碼設定」頁面使用。', true); return; }

  function getJSON(url) { return fetch(url, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function getText(url) { return fetch(url, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }); }
  /* the public page shows ' where the back office keeps &qpos;, and entity-encoded characters where the editor holds the characters */
  function toAdmin(text, encoding) {
    if (encoding === 'raw') return text;
    var ta = document.createElement('textarea');
    ta.innerHTML = text.split("'").join('&qpos;');
    return ta.value;
  }
  function editor() { return window.CKEDITOR && window.CKEDITOR.instances && window.CKEDITOR.instances[field]; }
  function area() { return document.querySelector('textarea[name="' + field + '"]'); }
  function current() { var ed = editor(), ta = area(); return { editor: ed ? ed.getData() : null, area: ta ? ta.value : null }; }

  var loaded = null;
  function pick() {
    var name = sel.value; loaded = null; load.disabled = true; say('讀取 ' + name + '…');
    getJSON(RAW + name + '/manifest.json').then(function (manifest) {
      var item = (manifest.items || []).filter(match)[0];
      if (!item) throw new Error('這個版本沒有本頁內容');
      return getText(RAW + name + '/' + item.file).then(function (text) {
        var value = toAdmin(text, item.encoding), now = current();
        var same = value === now.area || value === now.editor;
        loaded = { name: name, item: item, value: value };
        load.disabled = false;
        say(item.title + '：' + (same ? '目前內容和 ' + name + ' 相同，不需要回復。' : '目前內容和 ' + name + ' 不同（目前 ' + (now.area || '').length + ' 字，存檔 ' + value.length + ' 字）。'));
      });
    }).catch(function (e) { say('讀取失敗：' + e.message, true); });
  }
  load.onclick = function () {
    if (!loaded) return;
    var ed = editor(), ta = area();
    if (ta) ta.value = loaded.value;
    if (ed) ed.setData(loaded.value);
    say('已把 ' + loaded.name + ' 載入編輯器。請檢查畫面，確定要回復再按頁面下方的「確認送出」；不要回復就重新整理這一頁。');
  };
  sel.onchange = pick;
  getJSON(RAW + 'index.json').then(function (index) {
    var names = (index.versions || []).slice().reverse();
    names.forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
    var o = document.createElement('option'); o.value = index.live || 'live'; o.textContent = '最新快照（live）'; sel.appendChild(o);
    pick();
  }).catch(function (e) { say('讀取版本清單失敗：' + e.message, true); });
})();
