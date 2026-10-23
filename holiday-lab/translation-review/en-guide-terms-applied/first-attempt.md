# 首次套用與工具假紅

首次實際命令：

```text
node holiday-lab/translation-review/en-guide-terms-applied/apply-verify.cjs --apply
AssertionError [ERR_ASSERTION]: Forbidden locale/faculty mutation
actual: CRLF worktree text
expected: LF git-show text
exit 1
```

該命令已完成29個winning值的精確四檔寫入，最後比較禁改檔案時才因EOL不同假紅。`apply-output.txt`為0 bytes，因原Tee只接到stdout，錯誤在stderr；沒有把空檔當成成功收據。

未重套、未還原產品。工具改為EOL正規比對再加`git diff --exit-code`，保護檢查移到任何寫入之前及驗證之後。其後直接對現有結果執行`--verify`，固定base全JSON深比與精確29值均通過，見verification.json與verify-output.txt。語法與git diff --check亦為exit0。
