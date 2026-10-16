// 隱藏結局與成就牆的系網連結：系網內走內頁路由，其他地方連官網首頁
import test from "node:test";
import assert from "node:assert/strict";
import { siteLink, OFFICIAL } from "../exit6/links.mjs";

test("嵌在漫畫系網 /exit6/ 時走 ../#/ 路由", () => {
  assert.equal(siteLink("works", "/exit6/"), "../#/works");
  assert.equal(siteLink("labs", "/agd/exit6/index.html"), "../#/labs");
});
test("私網試玩版、Artifact 等其他位置連官網首頁", () => {
  for (const p of ["/six-floor-exit/play/index.html", "/six-floor-exit/", "/", "", undefined, "/exit6/game.js"])
    assert.equal(siteLink("admission", p), OFFICIAL, String(p));
});
