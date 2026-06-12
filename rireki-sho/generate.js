#!/usr/bin/env node
'use strict';

/**
 * 履歴書ジェネレータ
 *
 * main.yaml に書いた個人情報から、厚生労働省フォーマット（令和3年版）に沿った
 * 履歴書PDFを生成する。横長の見開き1枚（A3横）で出力。
 *
 *   node rireki-sho/generate.js [入力yaml] [出力pdf]
 *
 * デフォルト: rireki-sho/main.yaml -> rireki-sho/履歴書.pdf
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const puppeteer = require('puppeteer');

// ---- 引数 -----------------------------------------------------------------
const ROOT = __dirname;
const inputPath = process.argv[2] || path.join(ROOT, 'main.yaml');
const outputPath = process.argv[3] || path.join(ROOT, '履歴書.pdf');

// ---- ユーティリティ -------------------------------------------------------
function esc(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 改行を <br> に
function multiline(s) {
  return esc(s).replace(/\r?\n/g, '<br>');
}

// Date または "YYYY-MM-DD" 文字列を {y, m, d} に正規化（タイムゾーンの影響を避ける）
function parseDate(v) {
  if (v === undefined || v === null || v === '') return null;
  if (v instanceof Date) {
    return { y: v.getUTCFullYear(), m: v.getUTCMonth() + 1, d: v.getUTCDate() };
  }
  const m = String(v).match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (m) return { y: +m[1], m: +m[2], d: +m[3] };
  return null;
}

// 満年齢
function calcAge(birth, ref) {
  if (!birth || !ref) return '';
  let age = ref.y - birth.y;
  if (ref.m < birth.m || (ref.m === birth.m && ref.d < birth.d)) age -= 1;
  return age;
}

function dataUrlForImage(p) {
  const abs = path.isAbsolute(p) ? p : path.resolve(ROOT, p);
  if (!fs.existsSync(abs)) {
    console.warn(`⚠ 写真が見つかりません: ${abs}（写真欄は空のまま生成します）`);
    return null;
  }
  const ext = path.extname(abs).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  const b64 = fs.readFileSync(abs).toString('base64');
  return `data:image/${mime};base64,${b64}`;
}

// ---- 読み込み -------------------------------------------------------------
if (!fs.existsSync(inputPath)) {
  console.error(`入力ファイルがありません: ${inputPath}`);
  console.error('rireki-sho/main.example.yaml をコピーして main.yaml を作成してください。');
  process.exit(1);
}

const data = yaml.load(fs.readFileSync(inputPath, 'utf8')) || {};

const today = new Date();
const refDate = parseDate(data.date) || {
  y: today.getFullYear(),
  m: today.getMonth() + 1,
  d: today.getDate(),
};
const birth = parseDate(data.birth_date);
const age = calcAge(birth, refDate);

const address = data.address || {};
const contact = data.contact || {};
const education = Array.isArray(data.education_work) ? data.education_work : [];
const licenses = Array.isArray(data.licenses) ? data.licenses : [];

const photoUrl = data.photo ? dataUrlForImage(data.photo) : null;

// 学歴・職歴は左カラムに優先で詰め、あふれた分を右カラムへ続ける
const LEFT_HISTORY_ROWS = 16;
const RIGHT_HISTORY_ROWS = 8;
const LICENSE_ROWS = 9;

const leftHistory = education.slice(0, LEFT_HISTORY_ROWS);
const rightHistory = education.slice(LEFT_HISTORY_ROWS);

// 行を生成（不足分は空行で埋めて罫線の見た目を保つ）
function historyRows(items, minRows, kind) {
  const rows = items.map((it) => {
    const text = it && (it.text || it.title || '');
    return `<tr><td class="y">${esc(it && it.year)}</td><td class="m">${esc(it && it.month)}</td><td class="t">${multiline(text)}</td></tr>`;
  });
  while (rows.length < minRows) {
    rows.push('<tr><td class="y"></td><td class="m"></td><td class="t"></td></tr>');
  }
  return rows.join('\n');
}

function historyTable(items, minRows, headerLabel) {
  return `<table class="grid">
    <colgroup><col class="cy"><col class="cm"><col class="ct"></colgroup>
    <thead><tr><th class="y">年</th><th class="m">月</th><th class="t">${headerLabel}</th></tr></thead>
    <tbody>${historyRows(items, minRows)}</tbody>
  </table>`;
}

const HISTORY_LABEL = '学　歴・職　歴<span class="thin">（各別にまとめて書く）</span>';
const LICENSE_LABEL = '免　許・資　格';

// 写真欄
const photoCell = photoUrl
  ? `<img src="${photoUrl}" alt="写真">`
  : `<div class="photo-guide">
       <div class="pg-title">写真をはる位置</div>
       <div class="pg-body">
         写真をはる必要が<br>ある場合<br>
         1.&#12288;縦&#12288;&#12288;&#12288;cm<br>
         &#12288;&#12288;横&#12288;&#12288;&#12288;cm<br>
         2.本人単身胸から上<br>
         3.裏面のりづけ
       </div>
     </div>`;

// ---- HTML 構築 ------------------------------------------------------------
const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<style>
  @page { size: A3 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Hiragino Mincho ProN", "YuMincho", "Yu Mincho", "MS Mincho", serif;
    color: #000;
    font-size: 10pt;
    line-height: 1.3;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .spread { display: flex; gap: 10mm; height: 273mm; }
  .col { width: 190mm; display: flex; flex-direction: column; }
  .col.right { flex: 1; }

  /* タイトル行 */
  .titlebar { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3mm; }
  .title { font-size: 26pt; letter-spacing: 0.5em; font-weight: 700; }
  .asof { font-size: 11pt; }

  /* 上部情報ボックス */
  .topbox { border: 1.2px solid #000; }
  .topbox .row { display: flex; border-top: 1px solid #000; }
  .topbox .row:first-child { border-top: none; }
  .lbl { font-size: 8pt; }
  .k { font-weight: 400; margin-right: 0.6em; }

  .name-area { flex: 1; padding: 0; display: flex; flex-direction: column; }
  .name-area .furi { font-size: 8pt; padding: 1mm 2mm; border-bottom: 1px solid #000; }
  .name-area .name { flex: 1; display: flex; align-items: center; padding: 2mm 3mm; font-size: 18pt; }
  .name-area .name .k { font-size: 10pt; align-self: flex-start; }
  .photo-area { width: 32mm; min-height: 42mm; border-left: 1px solid #000; display: flex; align-items: center; justify-content: center; text-align: left; }
  .photo-area img { max-width: 30mm; max-height: 40mm; }
  .photo-guide { font-size: 7.5pt; line-height: 1.5; padding: 1mm; }
  .photo-guide .pg-title { text-align: center; margin-bottom: 1mm; }

  .birth-row .birth { flex: 1; padding: 1.5mm 3mm; font-size: 11pt; display: flex; align-items: center; }
  .birth-row .gender { width: 50mm; border-left: 1px solid #000; padding: 1.5mm 3mm; display: flex; align-items: center; }

  .addr-row .addr { flex: 1; }
  .addr-row .addr .furi { font-size: 8pt; padding: 1mm 2mm; border-bottom: 1px solid #000; }
  .addr-row .addr .a { padding: 1.5mm 3mm; min-height: 9mm; }
  .addr-row .addr .a.email { border-top: 1px solid #000; min-height: 7mm; }
  .addr-row .tel { width: 40mm; border-left: 1px solid #000; }
  .addr-row .tel .th { font-size: 8pt; padding: 1mm 2mm; border-bottom: 1px solid #000; }
  .addr-row .tel .tv { padding: 1.5mm 2mm; }
  .note { font-size: 7.5pt; }

  /* 表（学歴・職歴 / 免許・資格） */
  table.grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
  table.grid th, table.grid td { border: 1px solid #000; padding: 1mm 2mm; vertical-align: middle; }
  table.grid th { text-align: center; font-weight: 400; height: 8mm; }
  table.grid td { height: 8.6mm; }
  table.grid col.cy { width: 14mm; }
  table.grid col.cm { width: 12mm; }
  table.grid th.y, table.grid td.y, table.grid th.m, table.grid td.m { text-align: center; }
  table.grid td.t { text-align: left; }
  .thin { font-size: 8pt; }

  .section-gap { height: 4mm; }

  /* 自由記述ボックス */
  .freebox { border: 1.2px solid #000; display: flex; flex-direction: column; }
  .freebox .head { border-bottom: 1px solid #000; padding: 1.5mm 2mm; font-size: 9.5pt; }
  .freebox .area { flex: 1; padding: 2.5mm 3mm; white-space: pre-wrap; }
  .freebox.motivation { flex: 1.6; }
  .freebox.request { flex: 1; margin-top: 4mm; }

  .footnote { font-size: 8pt; margin-top: 2mm; }
</style>
</head>
<body>
  <div class="spread">
    <!-- 左ページ -->
    <div class="col left">
      <div class="titlebar">
        <div class="title">履歴書</div>
        <div class="asof">${esc(refDate.y)}&#12288;年&#12288;${esc(refDate.m)}&#12288;月&#12288;${esc(refDate.d)}&#12288;日現在</div>
      </div>

      <div class="topbox">
        <div class="row name-row">
          <div class="name-area">
            <div class="furi">ふりがな&#12288;${esc(data.furigana)}</div>
            <div class="name"><span class="k">氏&#12288;名</span>${esc(data.name)}</div>
          </div>
          <div class="photo-area">${photoCell}</div>
        </div>
        <div class="row birth-row">
          <div class="birth">${esc(birth ? birth.y : '')}&#12288;年&#12288;${esc(birth ? birth.m : '')}&#12288;月&#12288;${esc(birth ? birth.d : '')}&#12288;日生&#12288;（満&#12288;${esc(age)}&#12288;歳）</div>
          <div class="gender">※性別&#12288;${esc(data.gender)}</div>
        </div>
        <div class="row addr-row">
          <div class="addr">
            <div class="furi">ふりがな&#12288;${esc(address.furigana)}</div>
            <div class="a"><span class="k">現住所</span>〒${esc(address.postal)}&#12288;${esc(address.text)}</div>
            ${address.email ? `<div class="a email"><span class="k">E-mail</span>${esc(address.email)}</div>` : ''}
          </div>
          <div class="tel">
            <div class="th">電話</div>
            <div class="tv">${esc(address.phone)}</div>
          </div>
        </div>
        <div class="row addr-row">
          <div class="addr">
            <div class="furi">ふりがな&#12288;${esc(contact.furigana)}</div>
            <div class="a"><span class="k">連絡先</span>〒${esc(contact.postal)}&#12288;${esc(contact.text)}&#12288;<span class="note">（現住所以外に連絡を希望する場合のみ記入）</span></div>
          </div>
          <div class="tel">
            <div class="th">電話</div>
            <div class="tv">${esc(contact.phone)}</div>
          </div>
        </div>
      </div>

      <div class="section-gap"></div>
      ${historyTable(leftHistory, LEFT_HISTORY_ROWS, HISTORY_LABEL)}
      <div class="footnote">※「性別」欄：記載は任意です。未記載とすることも可能です。</div>
    </div>

    <!-- 右ページ -->
    <div class="col right">
      ${historyTable(rightHistory, RIGHT_HISTORY_ROWS, HISTORY_LABEL)}
      <div class="section-gap"></div>
      ${historyTable(licenses, LICENSE_ROWS, LICENSE_LABEL)}
      <div class="section-gap"></div>
      <div class="freebox motivation">
        <div class="head">志望の動機、特技、好きな学科、アピールポイントなど</div>
        <div class="area">${multiline(data.motivation)}</div>
      </div>
      <div class="freebox request">
        <div class="head">本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）</div>
        <div class="area">${multiline(data.request)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

// ---- PDF 生成 -------------------------------------------------------------
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`✓ 履歴書を生成しました: ${outputPath}`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error('生成に失敗しました:', err);
  process.exit(1);
});
