// 漫畫版資料 → WordPress 舊頁面內容產生器
// 用途：把 data/*.json 轉成各 WordPress 頁面的 HTML，讓 Google 搜到的舊頁與漫畫版首頁資料一致
// 限制：不用 style／script／iframe（子站管理員存檔會被濾掉）；版面靠 agdc- class，樣式在 wp-skin/comic-skin.css
// 同一份程式在 Node（產生預覽、跑檢查）與瀏覽器（實際寫入 WordPress）都能用
(function (root) {
  const SITE = 'https://www.dgd.stu.edu.tw/';
  const UPDATED = '2026-11-03';

  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const p = (s) => `<p>${esc(s)}</p>`;
  const h2 = (s) => `<h2>${esc(s)}</h2>`;
  const h3 = (s) => `<h3>${esc(s)}</h3>`;
  const ul = (arr) => (arr && arr.length ? `<ul>\n${arr.map((x) => `<li>${esc(x)}</li>`).join('\n')}\n</ul>` : '');
  const a = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
  // w：限制顯示寬度（老師照片原圖 1024px，不限會佔滿整個畫面）
  const img = (src, alt, w) => (src ? `<p><img src="${esc(src)}" alt="${esc(alt)}"${w ? ` width="${w}"` : ''} /></p>` : '');
  const comic = (hash, text) => a(SITE + hash, text || '到動遊系首頁看完整內容');
  const src = (hash) => `<p class="agdc-src">資料來源：${comic(hash, '動遊系首頁')}（更新日期 ${UPDATED}）</p>`;

  // ---------- 漫畫版型（2026-11-03）：class 一律 agdc- 開頭，樣式在 wp-skin/comic-skin.css 第 13 節 ----------
  // WordPress 子站管理員存檔會保留 class、data-*、role、details（2026-11-03 草稿頁實測）
  const EN = {
    專長: 'SKILLS', 研究領域: 'RESEARCH', 授課科目: 'COURSES', 學歷: 'EDU', 證照: 'CERTS', 經歷: 'CAREER',
    指導與榮譽: 'ACHIEVEMENTS', 著作: 'PAPERS', 重點提醒: 'NOTES', 準備方向: 'PREP', 重要時程: 'SCHEDULE',
    費用: 'FEES', 聯絡窗口: 'CONTACT', 相關連結: 'LINKS', 學習軸線: 'TRACKS', 各學期課程: 'STAGES',
    系所特色: 'FEATURES', 三大學習主軸: 'STREAMS', 延伸閱讀: 'MORE', 預約參訪: 'VISIT',
  };
  // 章節頭：CSS 用 data-en 畫英文小標（例：COURSES · 授課科目）
  const ch2 = (s) => `<h2 class="agdc-ch2">${esc(s)}</h2>`;
  const ch3 = (s, en) => `<h3 class="agdc-ch" data-en="${esc(en ?? EN[s] ?? '')}">${esc(s)}</h3>`;
  // 彩色區塊：tone = yellow／red／blue／dots／ink／plain，對齊漫畫版 Panel 的配色
  const sec = (tone, title, body) => (body ? `<section class="agdc-sec agdc-${tone}">\n${ch3(title)}\n${body}\n</section>` : '');
  // 表格每格附欄名，手機改成一列一張卡時由 CSS 顯示（td::before）
  const table = (heads, rows, cls) =>
    `<table class="agdc-table${cls ? ' ' + cls : ''}">\n` +
    (heads.some(Boolean) ? `<thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>\n` : '') +
    `<tbody>\n${rows.map((r) => `<tr>${r.map((c, i) => `<td data-label="${esc(heads[i] || '')}">${c}</td>`).join('')}</tr>`).join('\n')}\n</tbody>\n</table>`;
  // 重點數字：黑框貼紙排一排
  const facts = (arr) => (arr && arr.length ? `<ul class="agdc-facts">\n${arr.map((x) => `<li>${esc(x)}</li>`).join('\n')}\n</ul>` : '');

  // 純文字段落：空行分段；「■」開頭當小標；「● / • / 1.」開頭的連續行當清單
  function prose(text) {
    const out = [];
    for (const block of String(text || '').split(/\n\s*\n/)) {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (!lines.length) continue;
      if (/^■/.test(lines[0])) { out.push(h3(lines.shift().replace(/^■\s*/, ''))); if (!lines.length) continue; }
      const isItem = (l) => /^([●•・]|\d+[.、])\s*/.test(l);
      let buf = [];
      const flush = () => { if (buf.length) { out.push(p(buf.join(' '))); buf = []; } };
      let list = [];
      const flushList = () => { if (list.length) { out.push(ul(list)); list = []; } };
      for (const l of lines) {
        if (isItem(l)) { flush(); list.push(l.replace(/^([●•・]|\d+[.、])\s*/, '')); }
        else { flushList(); buf.push(l); }
      }
      flush(); flushList();
    }
    return out.join('\n');
  }

  const join = (...parts) => parts.filter(Boolean).join('\n\n');

  // ---------- 系所簡介 ----------
  const ABOUT_LEAD = '培育動畫創作、遊戲設計、影音後製、互動設計（AR / VR）所需的專業人才。';
  const ABOUT_HISTORY = '2006 年成立全國第一所「數位遊戲設計系」，2011 年依產業人才需求更名為「動畫與遊戲設計系」。完整的專業學習課程＋產學合作機制，師生定期參與企業參訪、教學講座，掌握產業脈動；持續在放視大賞、巴哈姆特 ACG、金犢獎等競賽屢獲佳績。';

  function aboutStats(D) {
    const aw = D.stats.find((s) => s.slug === 'awards');
    const awardTotal = aw.highlights.reduce((t, h) => t + (+h.count || 0), 0);
    return [
      `${D.faculty.length} 位業界派老師`,
      `${D.labs.length} 間特色實驗室`,
      '日本 HC 公司國際實習合作 9 屆',
      `學生競賽得獎 ${Math.floor(awardTotal / 10) * 10}+ 件（${aw.subtitle.split('·')[0].trim()}）`,
    ];
  }

  function aboutPage(D) {
    return join(
      ch2('動畫與遊戲設計系在學什麼？'),
      `<p class="agdc-lead">${esc(ABOUT_LEAD)}</p>`,
      p(ABOUT_HISTORY),
      sec('yellow', '系所特色', facts(aboutStats(D))),
      sec('dots', '三大學習主軸', ul(['動畫製作：2D / 3D / 偶動畫 / 動態捕捉', '遊戲設計：Unity / Unreal / 美術 / 程式', '互動媒體：VR / AR / 體感互動 / 自媒體'])),
      sec('plain', '延伸閱讀', `<ul>\n<li>${a(SITE + '課程資訊新/', '課程資訊（四年課程地圖）')}</li>\n<li>${a(SITE + '系所成員/', '專任教師')}</li>\n<li>${a(SITE + '特色實驗室/', '特色實驗室')}</li>\n</ul>`),
      src('#about')
    );
  }

  function aboutWidget() {
    return `<h3>系所簡介</h3>\n<p>${esc(ABOUT_LEAD)}</p>\n<p>${esc(ABOUT_HISTORY)}</p>`;
  }

  // ---------- 課程 ----------
  function curriculumBody(D) {
    const c = D.curriculum;
    const sems = c.semesters.map((s) => `${s.year}${s.term.replace('第', '').replace('學期', '')}`);
    const names = (t, i) => (t.courses[i] || []).map((x) => x.name).join('、');
    // 關卡軌道：一學期一關，每關列出各軸線的課（沒有課的軸線不列）
    const stages = c.semesters.map((s, i) => {
      const lines = c.tracks
        .filter((t) => names(t, i))
        .map((t) => `<li class="agdc-tk agdc-tk-${esc(t.key)}"><b>${esc(t.name.replace(/軸線$/, ''))}</b>${esc(names(t, i))}</li>`);
      return `<li class="agdc-stage${i % 2 === 0 ? ' agdc-year-start' : ''}"><p class="agdc-stage-name"><span class="agdc-lv">LV.${i + 1}</span>${esc(s.year + ' ' + s.term)}</p>\n<ul>\n${lines.join('\n')}\n</ul></li>`;
    });
    const legend = `<p class="agdc-legend">${c.tracks.map((t) => `<span class="agdc-tk-${esc(t.key)}">${esc(t.name)}</span>`).join(' ')}</p>`;
    // 原表格保留在「展開」裡，給要一次看全貌的人
    const full = table(['軸線', ...sems], c.tracks.map((t) => [esc(t.name), ...t.courses.map((list) => esc((list || []).map((x) => x.name).join('、')) || '—')]), 'agdc-wide');
    return join(
      facts([`畢業 ${c.credits.total} 學分`, `必修 ${c.credits.required}`, `選修 ${c.credits.elective}`, `校外實習 ${c.credits.internshipHours} 小時`]),
      p(`${c.yearTag}（${c.yearRange}）：畢業學分 ${c.credits.total} 學分，其中必修 ${c.credits.required} 學分、選修 ${c.credits.elective} 學分，另含校外實習 ${c.credits.internshipHours} 小時。`),
      sec('dots', '學習軸線', ul(c.tracks.map((t) => `${t.name}（${t.nameEn}）：${t.desc}`))),
      ch3('各學期課程'),
      legend,
      `<ol class="agdc-map">\n${stages.join('\n')}\n</ol>`,
      `<details class="agdc-more"><summary>展開完整課程表格</summary>\n${full}\n</details>`
    );
  }

  function curriculumPage(D) {
    return join(ch2('四年課程地圖'), curriculumBody(D), src('#/curriculum/map'));
  }

  function introCurriculumPage(D) {
    return join(ch2('系所介紹'), `<p class="agdc-lead">${esc(ABOUT_LEAD)}</p>`, p(ABOUT_HISTORY), facts(aboutStats(D)), ch2('四年課程地圖'), curriculumBody(D), src('#about'));
  }

  // ---------- 招生 ----------
  const ADM_PAGE = { 'high-school-application': '高中申請/', selection: '甄選入學/', 'tech-star': '科技繁星/', 'tech-elite': '技優甄選/', scholarship: '菁英獎學金/', visit: '參訪聯繫師長/' };

  // 115 學年度時程已全部結束（2026-10）；參訪是全年開放，不加註
  const ADM_CLOSED = '115 學年度招生已結束，以下時程與名額僅供參考；116 學年度簡章公布後更新。';
  // 已結束的公告：紅框加「已截止」印章（CSS 畫印章）
  const closedNote = () => `<p class="agdc-notice"><strong>${esc(ADM_CLOSED)}</strong></p>`;
  const admissionNotice = (x) => (/115/.test(x.year || '') && x.slug !== 'visit' ? closedNote() : '');

  function admissionPage(x) {
    const meta = [x.year, x.quota && (/\d+\s*名/.test(x.quota) ? `名額：${x.quota}` : x.quota), x.code, x.schedule_short].filter(Boolean);
    const tl = (x.timeline || []).map((t) => [esc(t.date), esc(t.label)]);
    const fees = x.fees ? Object.values(x.fees).filter(Boolean) : [];
    const links = (x.links || []).map((l) => `<li>${a(l.url, l.label)}</li>`);
    const contact = x.contact
      ? ul([
          `${x.contact.advisor.name}（${x.contact.advisor.title}）分機 ${x.contact.advisor.ext}｜${x.contact.advisor.email}`,
          `${x.contact.assistant.name}（${x.contact.assistant.title}）分機 ${x.contact.assistant.ext}｜${x.contact.assistant.email}`,
          `總機 ${x.contact.phone}｜${x.contact.address}`,
        ])
      : '';
    return join(
      ch2(x.title),
      admissionNotice(x),
      facts(meta),
      x.summary && `<p class="agdc-lead">${esc(x.summary)}</p>`,
      prose(x.content),
      x.key_notes && x.key_notes.length && sec('yellow', '重點提醒', ul(x.key_notes)),
      x.stu_focus && x.stu_focus.length && sec('dots', '準備方向', ul(x.stu_focus)),
      tl.length && sec('plain', '重要時程', table(['日期', '事項'], tl, 'agdc-timeline')),
      fees.length && sec('blue', '費用', ul(fees)),
      contact && sec('ink', '聯絡窗口', contact),
      links.length && sec('plain', '相關連結', `<ul>\n${links.join('\n')}\n</ul>`),
      src('#/admission/' + x.slug)
    );
  }

  function admissionHub(D) {
    const items = D.admission.map((x) => {
      const page = ADM_PAGE[x.slug];
      const name = page ? a(SITE + page, x.title) : esc(x.title);
      // 只有真的是名額（含「名」）才加「名額」字樣；參訪、獎學金的 quota 欄位放的是別的說明
      const q = x.quota && (/\d+\s*名/.test(x.quota) ? `名額 ${x.quota}` : x.quota);
      const bits = [x.year, q, x.schedule_short].filter(Boolean).map(esc).join('｜');
      return `<li>${name}｜${bits}<br />${esc(x.summary || '')}</li>`;
    });
    return join(ch2('招生管道一覽'), closedNote(), `<ul class="agdc-routes">\n${items.join('\n')}\n</ul>`, `<p>另有${a(SITE + '特殊選才/', '特殊選才')}管道，請見專頁。</p>`, src('#/admission/visit'));
  }

  function contactPage(D) {
    const c = D.admission.find((x) => x.slug === 'visit').contact;
    return join(
      ch2('聯絡資訊'),
      ul([`地址：${c.address}`, `總機：${c.phone}`]),
      sec('ink', '聯絡窗口', ul([
        `${c.advisor.name}（${c.advisor.title}）分機 ${c.advisor.ext}｜${c.advisor.email}`,
        `${c.assistant.name}（${c.assistant.title}）分機 ${c.assistant.ext}｜${c.assistant.email}`,
      ])),
      sec('yellow', '預約參訪', p('想實際走進動遊系？預約深度參訪，由專人帶你體驗實驗室、了解四年所學、規劃適合的入學管道。每週六固定開放，平日可另行協調。') + '\n' + `<p>${a(SITE + '參訪聯繫師長/', '預約一日參訪說明')}</p>`),
      src('#/admission/visit')
    );
  }

  // ---------- 師資 ----------
  const mail = (e) => (e ? a('mailto:' + e, e) : '');
  // 專長「遊戲設計 / 劇本創作」拆成一顆顆貼紙
  const chips = (s) => `<p class="agdc-chips">${String(s || '').split(/\s*\/\s*/).filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join(' ')}</p>`;

  // 角色卡牆：一位老師一張卡（取代原本 5 欄表格，手機不再擠成一字一行）
  function facultyList(D) {
    const cards = D.faculty.map((f) => [
      `<li class="agdc-card">`,
      `<p class="agdc-card-name">${a(SITE + '?page_id=' + f.id, f.name)}<small>${esc(f.en || '')}</small></p>`,
      `<p class="agdc-role">${esc(f.role)}</p>`,
      chips(f.spec),
      `<p class="agdc-card-contact">分機 ${esc(f.ext)}｜${mail(f.email)}</p>`,
      `</li>`,
    ].join('\n'));
    return join(ch2(`專任教師（${D.faculty.length} 位）`), `<ul class="agdc-cast">\n${cards.join('\n')}\n</ul>`, src('#faculty'));
  }

  // 教師個人頁：版面對齊漫畫版 pages.jsx 教師頁（照片＋黑底名片，下面依序彩色區塊）
  function facultyPage(f) {
    const meta = [esc(f.en), f.ext && `分機 ${esc(f.ext)}`, mail(f.email), f.officeHours && `Office Hour：${esc(f.officeHours)}`].filter(Boolean);
    const papers = (f.papers || []).map((x) => `<li><b class="agdc-year">${esc(x.year)}</b>${esc(x.title)}<small>${esc(x.venue)}</small></li>`);
    // 頁面標題已經是老師姓名（主題的黃色標題貼紙），內文不再重複姓名
    return join(
      `<div class="agdc-hero">`,
      f.photo && `<p class="agdc-photo"><img src="${esc(f.photo)}" alt="${esc(`${f.name} ${f.role}`)}" width="420" /></p>`,
      `<div class="agdc-id">\n<p class="agdc-role">${esc(f.role)}</p>\n<ul class="agdc-meta">\n${meta.map((x) => `<li>${x}</li>`).join('\n')}\n</ul>\n${f.spec ? `<p class="agdc-tag">專長 · ${esc(f.spec)}</p>` : ''}\n</div>`,
      `</div>`,
      sec('dots', '研究領域', f.research && p(f.research)),
      sec('yellow', '授課科目', f.courses && p(f.courses)),
      sec('blue', '學歷', f.education && p(f.education)),
      sec('red', '證照', f.certs && p(f.certs)),
      sec('plain', '經歷', f.experience && f.experience.length && ul(f.experience)),
      sec('ink', '指導與榮譽', f.achievements && f.achievements.length && ul(f.achievements)),
      sec('dots', '著作', papers.length && `<ul class="agdc-papers">\n${papers.join('\n')}\n</ul>`),
      src('#/faculty/' + f.slug)
    );
  }

  // ---------- 實驗室 ----------
  const LAB_PAGE = { D0604: 2981, D0628: 4186, D0631: 2988, D0633: 2991, D0637: 2997, 'DB101-1': 3012, DB104: 6819, DB105: 3014 };

  function labPage(l) {
    // 頁面標題已經是實驗室名稱，內文不再重複
    return join(
      l.tagline && p(`${l.tagline}｜${l.shortDesc || ''}`),
      (l.photos || []).slice(0, 4).map((u, i) => img(u, `${l.code} ${l.name}${i ? `（${i + 1}）` : ''}`, 560)).join('\n'),
      prose(l.content),
      src('#/labs/' + l.slug)
    );
  }

  function labsList(D) {
    const items = D.labs.map((l) => {
      const id = LAB_PAGE[l.code];
      const name = id ? a(SITE + '?page_id=' + id, `${l.code} ${l.name}`) : esc(`${l.code} ${l.name}`);
      return `<li>${name}：${esc(l.shortDesc || '')}</li>`;
    });
    return join(ch2(`特色實驗室（${D.labs.length} 間）`), `<ul class="agdc-routes">\n${items.join('\n')}\n</ul>`, src('#labs'));
  }

  // ---------- 統計類 ----------
  function statsPage(s, hash) {
    return join(
      ch2(s.title),
      s.subtitle && `<p class="agdc-lead">${esc(s.subtitle)}</p>`,
      s.summary && p(s.summary),
      s.highlights && facts(s.highlights.map((h) => `${h.year}：${h.count}`)),
      (s.groups || []).map((g, i) => sec(i === 0 ? 'yellow' : 'plain', g.year, ul(g.items))).join('\n\n'),
      s.note && p(s.note),
      src(hash)
    );
  }

  // ---------- 全部頁面 ----------
  function buildAll(D) {
    const adm = (slug) => D.admission.find((x) => x.slug === slug);
    const stat = (slug) => D.stats.find((x) => x.slug === slug);
    const pages = [
      { id: 23, label: '系所簡介', html: aboutPage(D) },
      { id: 3295, label: '課程資訊', html: curriculumPage(D) },
      { id: 7141, label: '系所介紹與課程地圖', html: introCurriculumPage(D) },
      { id: 7139, label: '招生資訊', html: admissionHub(D) },
      { id: 6906, label: '高中申請', html: admissionPage(adm('high-school-application')) },
      { id: 6926, label: '甄選入學', html: admissionPage(adm('selection')) },
      { id: 6908, label: '科技繁星', html: admissionPage(adm('tech-star')) },
      { id: 6919, label: '技優甄選', html: admissionPage(adm('tech-elite')) },
      { id: 1952, label: '技優甄審（舊頁）', html: admissionPage(adm('tech-elite')) },
      { id: 2001, label: '菁英獎學金', html: admissionPage(adm('scholarship')) },
      { id: 3138, label: '參訪聯繫師長', html: admissionPage(adm('visit')) },
      { id: 7137, label: '聯絡我們', html: contactPage(D) },
      { id: 25, label: '專任教師', html: facultyList(D) },
      ...D.faculty.map((f) => ({ id: f.id, label: `教師：${f.name}`, html: facultyPage(f) })),
      { id: 1627, label: '特色實驗室', html: labsList(D) },
      ...D.labs.filter((l) => LAB_PAGE[l.code]).map((l) => ({ id: LAB_PAGE[l.code], label: `實驗室：${l.code}`, html: labPage(l) })),
      { id: 791, label: '榮譽事蹟', html: statsPage(stat('honors'), '#/stats/honors') },
      { id: 4238, label: '實習資訊', html: statsPage(stat('international'), '#/stats/international') },
    ];
    return { pages, widget: { id: 'custom_html-3', html: aboutWidget() } };
  }

  const api = { buildAll, prose, esc, LAB_PAGE, ADM_PAGE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AGDGen = api;
})(typeof window !== 'undefined' ? window : globalThis);
