'use strict';
/**
 * 窗口底板（叠加/抠色用）：默认读不到标记文件 → 返回 null，窗口照旧透明。
 *
 * 为什么存在：摄像头直播时，助手要「贴」在摄像头画面上，必须经 OBS/直播伴侣这类软件叠一层。
 * 透明窗口能不能被原样采到，取决于采集端是否支持 alpha——不可控。放一份
 * `runtime/electron-helper/window-backdrop.json`（`{"color":"#00FF00"}`）就把窗口变成不透明纯色底，
 * 采集端走最普通的「窗口采集 + 色度键/亮度键钩掉底色」，一定抓得到。
 *
 * 改完要 `POST /dsh-pet-7340/reload` 重建窗口才生效。透传/置顶/命中区不受影响，因为只换了绘制底板。
 * @module dsh-pet/runtime/electron-helper/window-backdrop
 */
const fs = require('node:fs');
const path = require('node:path');

/** 标记文件名（与 index.html 同目录）。 */
const BACKDROP_FILE = 'window-backdrop.json';

/**
 * 读底板配置。
 *
 * @param helperDir - runtime/electron-helper 的绝对目录。
 * @returns `{ color }` 或 `null`（没有标记、读不了、颜色不合法都按「透明」处理）。
 */
function readWindowBackdrop(helperDir) {
  if (typeof helperDir !== 'string' || helperDir === '') return null;
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(helperDir, BACKDROP_FILE), 'utf8'));
    const color = typeof raw?.color === 'string' ? raw.color.trim() : '';
    if (!/^#[0-9a-f]{6}$/i.test(color)) return null;
    return { color };
  } catch {
    return null;
  }
}

module.exports = { readWindowBackdrop, BACKDROP_FILE };
