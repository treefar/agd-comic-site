// 遊戲裡連回系網的連結：嵌在漫畫系網（/exit6/）時走系網內頁路由；
// 單獨放在別處（私網試玩版、Artifact）時 ../#/ 會連錯，改連系上官網首頁
export const OFFICIAL = "https://www.dgd.stu.edu.tw/";

export function siteLink(route, pathname) {
  const inComicSite = /\/exit6\/(index\.html)?$/.test(String(pathname || ""));
  return inComicSite ? `../#/${route}` : OFFICIAL;
}
