# 音效授權帳本（AUDIO_LICENSES）

來源一律為使用者自有素材庫 Google Drive `06_素材庫`（下表「原始檔路徑」為相對於 `06_素材庫` 的路徑，碟號因機而異）。
轉檔：ffmpeg，單聲道、44.1 kHz、MP3 96 kbps；只做頭尾靜音移除（-60 dB 門檻，hum 不去靜音以保留循環長度）與整體增益（目標 -16 LUFS，真峰值上限 -1.5 dBTP，峰值先到上限者以上限為準）。未剪接、未加效果。

授權判定說明：
- Kenney 三包為 CC0，依據為包內 `License.txt`（Creative Commons Zero）。
- Unity Asset Store 兩包（WOW SOUND、IMPHENZIA）包內未附授權檔；授權依據是 Unity Asset Store 購買紀錄（`game-asset-finder/references/assets_tagged.json`）與 Asset Store 標準 EULA：可作為遊戲的一部分散布，不可單獨轉售或以素材形式散布。網頁遊戲中這些 mp3 可被直接下載，屬「遊戲內使用」範圍，但不要另外提供音檔下載或打包成素材包。

| 檔名 | 音效名 | 作者／素材包 | 來源（自有庫平台） | 原始檔路徑 | 取得日期 2026-10-15 | 授權名稱 | 標示要求 | 用途 |
|---|---|---|---|---|---|---|---|---|
| exit6/audio/sfx_footstep.mp3 | FOOTSTEPS_Asphalt_Trainers_Walk_Slow_x8_loop_mono | IMPHENZIA／Universal Sound FX v1.6 | Unity Asset Store（2023-08-13 購買） | UnityArtLibrary/音效_音樂/IMPHENZIA/Universal Sound FX/Assets/Universal Sound FX/HUMAN/Footsteps/Asphalt_Trainers_Walk_Slow/FOOTSTEPS_Asphalt_Trainers_Walk_Slow_x8_loop_mono.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 走廊腳步（5.0 秒 8 步，柏油地慢走，與「磁磚 1～2 秒」需求不完全相符） |
| exit6/audio/sfx_hum.mp3 | LIGHT_Fluorescent_02_loop_mono | IMPHENZIA／Universal Sound FX v1.6 | Unity Asset Store（2023-08-13 購買） | UnityArtLibrary/音效_音樂/IMPHENZIA/Universal Sound FX/Assets/Universal Sound FX/LIGHTS/LIGHT_Fluorescent_02_loop_mono.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 日光燈嗡嗡環境聲（循環，6.04 秒，保留原長） |
| exit6/audio/sfx_sting.mp3 | GUIP_MSting_GameOver_Dark_Hit_01 | WOW SOUND／Game UI & Puzzle Sound Effects Pack v1.0 | Unity Asset Store（2026-05-19 購買） | UnityArtLibrary/音效_音樂/WOW SOUND/Game UI Puzzle Sound Effects Pack/Assets/Game UI & Puzzle Sound Effects Pack/Music Stingers/GUIP_MSting_GameOver_Dark_Hit_01.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 恐怖驚嚇／揭露異常重音 |
| exit6/audio/sfx_found.mp3 | GUIP_Cute_MatchClear_Explode_04 | WOW SOUND／Game UI & Puzzle Sound Effects Pack v1.0 | Unity Asset Store（2026-05-19 購買） | UnityArtLibrary/音效_音樂/WOW SOUND/Game UI Puzzle Sound Effects Pack/Assets/Game UI & Puzzle Sound Effects Pack/Puzzle/GUIP_Cute_MatchClear_Explode_04.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 抓到異常的爽快 pop |
| exit6/audio/sfx_wrong.mp3 | GUIP_Generic_MatchClear_Error_03 | WOW SOUND／Game UI & Puzzle Sound Effects Pack v1.0 | Unity Asset Store（2026-05-19 購買） | UnityArtLibrary/音效_音樂/WOW SOUND/Game UI Puzzle Sound Effects Pack/Assets/Game UI & Puzzle Sound Effects Pack/Puzzle/GUIP_Generic_MatchClear_Error_03.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 答錯提示 |
| exit6/audio/sfx_dean.mp3 | CARTOON_Boing_01_mono | IMPHENZIA／Universal Sound FX v1.6 | Unity Asset Store（2023-08-13 購買） | UnityArtLibrary/音效_音樂/IMPHENZIA/Universal Sound FX/Assets/Universal Sound FX/CARTOON/CARTOON_Boing_01_mono.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 系主任搞笑出場 boing |
| exit6/audio/sfx_correct.mp3 | confirmation_002 | Kenney／Interface Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_interface-sounds.zip → Audio/confirmation_002.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 答對提示音 |
| exit6/audio/sfx_clear.mp3 | GUIP_MSting_Victory_Fanfare_04 | WOW SOUND／Game UI & Puzzle Sound Effects Pack v1.0 | Unity Asset Store（2026-05-19 購買） | UnityArtLibrary/音效_音樂/WOW SOUND/Game UI Puzzle Sound Effects Pack/Assets/Game UI & Puzzle Sound Effects Pack/Music Stingers/GUIP_MSting_Victory_Fanfare_04.wav | 2026-10-15 | Unity Asset Store EULA（Standard） | 無 | 破關勝利樂句 |
| exit6/audio/sfx_click.mp3 | click_001 | Kenney／Interface Sounds 1.0 | 跨引擎共用_CC0（Kenney 官方下載） | 跨引擎共用_CC0/Kenney/Audio/kenney_interface-sounds.zip → Audio/click_001.ogg | 2026-10-15 | CC0 1.0 | 不需標示（Kenney 歡迎署名，非必要） | 點擊物件 UI 音 |
