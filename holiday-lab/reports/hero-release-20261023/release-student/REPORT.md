## 最新：student02（8863）

本批 .measure-student-hero-20261023-02，360檔；策展手機修復後重新建置與補驗。字型採樣方法的獨立複驗另見student-independent，不以本表代替。

`C:\Program Files\nodejs\node.exe C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\release-student\run.cjs --site=.measure-student-hero-20261023-02 --base=http://127.0.0.1:8863` → actual exit 0。

| 檢查 | yes／no／unknown |
|---|---|
| runtime-allowlist | yes |
| all-runtime-http-body-sha | yes |
| server-private-path-and-real-missing-status | yes |
| server-listens-on-loopback-only | yes |
| keyboard-pause-audio-cleanup-zh | yes |
| keyboard-pause-audio-cleanup-en | yes |
| keyboard-pause-audio-cleanup-ja | yes |
| reduced-narration-scroll-zh | yes |
| reduced-narration-scroll-en | yes |
| reduced-narration-scroll-ja | yes |
| local-game-with-third-party-network-blocked | yes |
| module-load-failure-has-readable-recovery | yes |
| real-background-visibility-evidence | unknown |

```text
YES runtime-allowlist
YES all-runtime-http-body-sha
YES server-private-path-and-real-missing-status
YES server-listens-on-loopback-only
YES keyboard-pause-audio-cleanup-zh
YES keyboard-pause-audio-cleanup-en
YES keyboard-pause-audio-cleanup-ja
YES reduced-narration-scroll-zh
YES reduced-narration-scroll-en
YES reduced-narration-scroll-ja
YES local-game-with-third-party-network-blocked
YES module-load-failure-has-readable-recovery
UNKNOWN real-background-visibility-evidence
RESULT pass-with-explicit-limitations {"yes":12,"no":0,"unknown":1}
EVIDENCE C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\release-student\runs\2026-10-23T09-41-13-935Z
```

主控read-only verify → pass=true，runtime_files360/http_sha_matches360/screenshots6，source_stable=true；public_release=false/full_project_approved=false。

真背景hidden在headless Chrome無法取得，未注入假旗標；仍為unknown。下方01原始批保留。

---

# 學生作品版：本機發布前補驗（2026-10-23）

來源為fresh build .measure-student-hero-20261023-01；此版策展手機換行稍後由獨立驗收發現問題，不能作為最新交付版。下表只記本批技術補驗，原證據保留。

命令：`C:\Program Files\nodejs\node.exe C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\release-student\run.cjs --site=.measure-student-hero-20261023-01 --base=http://127.0.0.1:8862`

| 檢查 | yes／no／unknown |
|---|---|
| runtime-allowlist | yes |
| all-runtime-http-body-sha | yes |
| server-private-path-and-real-missing-status | yes |
| server-listens-on-loopback-only | yes |
| keyboard-pause-audio-cleanup-zh | yes |
| keyboard-pause-audio-cleanup-en | yes |
| keyboard-pause-audio-cleanup-ja | yes |
| reduced-narration-scroll-zh | yes |
| reduced-narration-scroll-en | yes |
| reduced-narration-scroll-ja | yes |
| local-game-with-third-party-network-blocked | yes |
| module-load-failure-has-readable-recovery | yes |
| real-background-visibility-evidence | unknown |

實際輸出：
```text
RESULT pass-with-explicit-limitations {"yes":12,"no":0,"unknown":1}
360 files HTTP 200 / body SHA match
```

全域UI合約、實體手機、真背景hidden、使用者美術確認仍未通過。沒有封包、發布、勞動節或main變更。新02通過後另追加，不覆寫本批。
