# 音效授權帳本（AUDIO_LICENSES）

來源一律為使用者自有素材庫 Google Drive `06_素材庫/跨引擎共用_CC0/Kenney/Audio/`（下表「原始檔路徑」相對於 `06_素材庫`，碟號因機而異）。
2026-10-15 依使用者決定：推上公開 GitHub 前全部改用 CC0，原 7 個 Unity Asset Store 來源已撤換或移除。

轉檔：ffmpeg，單聲道、44.1 kHz、MP3 96 kbps；只做頭尾靜音移除（-60 dB 門檻，hum 不去靜音以保留循環長度）與整體增益（目標 -16 LUFS，真峰值上限 -1.5 dBTP，先撞峰值上限者以上限為準）。未剪接、未加效果。

授權依據：每個 Kenney 包內 `License.txt` 皆載明「Creative Commons Zero, CC0」（http://creativecommons.org/publicdomain/zero/1.0/）。

| 檔名 | 音效名 | 作者／素材包 | 來源（自有庫平台） | 原始檔路徑 | 取得日期 2026-10-15 | 授權名稱 | 標示要求 | 用途 |
|---|---|---|---|---|---|---|---|---|
| exit6/audio/sfx_footstep.mp3 | footstep_concrete_000 | Kenney／Impact Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_impact-sounds.zip → Audio/footstep_concrete_000.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 水泥地單步腳步（每走一格播一次） |
| exit6/audio/sfx_hum.mp3 | spaceEngineLow_002 | Kenney／Sci-Fi Sounds | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_sci-fi-sounds.zip → Audio/spaceEngineLow_002.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 低頻嗡嗡環境聲（循環，5.0 秒，保留原長） |
| exit6/audio/sfx_sting.mp3 | impactBell_heavy_000 | Kenney／Impact Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_impact-sounds.zip → Audio/impactBell_heavy_000.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 恐怖揭露異常重音（沉重鐘擊） |
| exit6/audio/sfx_found.mp3 | impactPunch_heavy_000 | Kenney／Impact Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_impact-sounds.zip → Audio/impactPunch_heavy_000.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 抓到異常的打擊音 |
| exit6/audio/sfx_wrong.mp3 | error_003 | Kenney／Interface Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_interface-sounds.zip → Audio/error_003.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 答錯提示 |
| exit6/audio/sfx_correct.mp3 | confirmation_002 | Kenney／Interface Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_interface-sounds.zip → Audio/confirmation_002.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 答對提示音 |
| exit6/audio/sfx_click.mp3 | click_001 | Kenney／Interface Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_interface-sounds.zip → Audio/click_001.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 點擊物件 UI 音 |
| exit6/audio/sfx_dean.mp3 | phaseJump1 | Kenney／Digital Audio 1.0 | kenney.nl 官網下載（使用者 2026-10-15 同意），已存入跨引擎共用_CC0 | 跨引擎共用_CC0/Kenney/Audio/kenney_digital-audio.zip → phaseJump1.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 系主任彈出場的彈跳音（0.47 秒） |
| exit6/audio/sfx_clear.mp3 | jingles_PIZZI02 | Kenney／Music Jingles 1.0 | kenney.nl 官網下載（使用者 2026-10-15 同意），已存入跨引擎共用_CC0 | 跨引擎共用_CC0/Kenney/Audio/kenney_music-jingles.zip → Pizzicato jingles/jingles_PIZZI02.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 破關上揚撥弦短樂句（0.96 秒） |

原本的兩個缺口（dean、clear）已於 2026-10-15 由上面兩列補上；兩包下載自 https://kenney.nl/assets/digital-audio 與 https://kenney.nl/assets/music-jingles，包內 License.txt 皆為 CC0。
