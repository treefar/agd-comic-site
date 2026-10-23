# native-shots.json與圖片的用途澄清

2026-10-23追加，原JSON、圖片、指令輸出不修改。

`native-ja-320-140-flight.png`與`native-ja-1440-140-flight.png`是由真實完成作品、在shot1**取消pending RAF停格**後取得的排印圖。字幕與作品資料沒有被寫入假值，但播放排程受到測試干預。因此它們只佐證該保存作品於該鏡的字幕、姿態及版面，**不能佐證未干預時長為140ms，不能稱未凍時鐘的動態截圖**。JSON中的`fixtureTextWrites:false`只表示沒改字，不表示沒有時序干預；`pause`欄記錄了RAF取消。

54鏡的原生觀察是分開的證據：green-03的launch兩寬各9鏡在每個context的freeze之前先完成；native-intents的flight／landing四context各9鏡沒有freeze。兩者證明實際互動與字幕依序出現，不能單憑首次觀測epoch推斷精密鏡長。主控另安排未凍時鐘collector補整合版140ms動態驗證。
