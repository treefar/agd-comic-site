# Lantern 影子裁切專項

來源：固定 .measure-integrated-08，http://127.0.0.1:8845/holiday-lab/ 。僅補原採樣器對 image:lan-shadow 的 264 筆 PAINT_HIT_TARGET_UNRESOLVED；原 raw、sampler、安全區與官方 R0 報告均不改。

| 驗收 | yes/no | 實際證據 |
|---|---|---|
| 中英日 1440 dynamic-max 實際 DOM 復現 | yes | 3/3；14 個原 target 依 owner、全文、墨跡與 computed font 對應 |
| 每筆原墨跡都在影子固定 stage clip 水平範圍外 | yes | 264/264；最小水平距離 56px |
| 兩種原框反推 stage right 互證 | yes | 最大差 0.007211538461547207px；不是依文字擬合 |
| 實際 stage overflow:hidden、影子為其後代 | yes | 三語均驗；右界 851.265625px，controls paper 左界 871.265625px |
| 真影子遮字負例能攔住 | yes | 只暫改 stage inline overflow:visible，真 image-above-text blocker，5 項 geometry errors |
| 還原原 style 後幾何 | yes | style 完全一致，0 errors |
| 原固定來源試前試後相同 | yes | 7/7 served SHA 對原 08 source receipt；完整值見 report.json |
| 全專案正式 gate 通過 | no | 此專項不替代 2076 必要案例與其他未閉合方法證據 |

實際命令與輸出（exit 0）：

```text
node holiday-lab/layout-qa/lantern-clip-proof.cjs
LANTERN_CLIP YES probes=3/3 original_flags=264/264 negative=true
```

方法：從每筆原 sample 的 controls paper 固定 bounds.x 減實際 grid gap 20px；另從同筆 lan-screen 原 bounds 與來源 x42%、width52%、centered/translate(-50%) 反推 stage right。三語新 DOM 重驗來源百分比、grid、stage 無 transform、shadow descendant 與固定 clip。兩式逐筆相符，且全部目標墨跡至少距 clip 右界 56px，影子不可能在該水平區域繪製。0.1px 僅用於新舊量測對應誤差，沒有修改任何文字安全區。來源片段與 SHA 見 source-relations.json。

保留原 264 flags；未概括放行其他未註冊圖片、其他寬度或缺失 hit 證據。geometry 0 不單獨當作完整捲動／跑馬燈可讀證據。本次沒有重新驗其他遊戲或宣稱美術由使用者通過。

截圖：zh-normal.webp、en-normal.webp、ja-normal.webp、negative-overflow-visible.webp；SHA 均在 report.json。
