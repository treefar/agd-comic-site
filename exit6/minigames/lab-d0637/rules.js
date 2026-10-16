/**
 * lab-d0637「影格接龍」— D0637 偶動畫實驗室 純規則函式
 * 遵守 orders/_lab-contract.md 與 orders/_mg-contract.md
 * 不碰 DOM、不用 window，給 node:test 與瀏覽器共用
 */
(function (root) {
  const R = {
    ID: "lab-d0637",
    TITLE: "影格接龍",
    LAB: "D0637 偶動畫實驗室",
    SKILL: "定格動畫",
    TOTAL_SECONDS: 60,
    SCORE2: 1000,
    FLAWLESS_DESC: "零失誤過關",
    LESSON: "定格動畫一秒要拍好幾張照片，每一格的順序和微小位移，決定動作看起來順不順。",
    
    // 影格帶顏色（符合規格六色：紅、藍、黃）
    BAND_COLORS: ["red", "blue", "yellow"],
    BAND_NAMES: {
      red: "紅帶（走路偶）",
      blue: "藍帶（起跳偶）",
      yellow: "黃帶（旋轉偶）"
    },

    // 三階難度設定（三輪）
    // 參數嚴格遞增：帶數遞增、卡牌總數遞增、蓋牌數遞增
    ROUNDS: [
      {
        round: 1,
        bands: ["red"],
        cardCount: 6,
        pileCount: 3,
        faceDownCount: 0,
        name: "第 1 輪：1 條帶、不蓋牌"
      },
      {
        round: 2,
        bands: ["red", "blue"],
        cardCount: 12,
        pileCount: 4,
        faceDownCount: 2,
        name: "第 2 輪：2 條帶、部分蓋牌"
      },
      {
        round: 3,
        bands: ["red", "blue", "yellow"],
        cardCount: 18,
        pileCount: 5,
        faceDownCount: 5,
        name: "第 3 輪：3 條帶、更多蓋牌"
      }
    ],

    /**
     * 檢查卡牌是否可放置到時間軸槽（完成區）
     * 必須同色，且從 1 開始依序放到 6
     * @param {Object} card - { color: string, rank: number }
     * @param {Array} timelinePile - 目前該顏色的時間軸牌列
     * @param {string} bandColor - 該槽對應的顏色
     * @returns {boolean}
     */
    canStackTimeline(card, timelinePile, bandColor) {
      if (!card || !timelinePile || !bandColor) return false;
      if (card.color !== bandColor) return false;
      const expectedRank = timelinePile.length + 1;
      return card.rank === expectedRank && expectedRank <= 6;
    },

    /**
     * 檢查卡牌（或卡牌串的第一張）是否可疊到下方牌疊
     * 規則：空列可放任意牌；非空列只能疊在同色的上一格號碼「大 1」的牌上（例如紅 3 疊在紅 4 上）
     * @param {Object} card - 欲疊放的卡牌（或牌串最底層那張）
     * @param {Array} targetPile - 目標牌列
     * @returns {boolean}
     */
    canStackTableau(card, targetPile) {
      if (!card || !targetPile) return false;
      if (targetPile.length === 0) return true; // 空欄可暫放任何牌
      const top = targetPile[targetPile.length - 1];
      if (!top.up) return false;
      return top.color === card.color && top.rank === card.rank + 1;
    },

    /**
     * 檢查指定輪次的影格帶是否全數收集完畢（每帶皆為 1～6）
     * @param {Object} timelines - { red: [...], blue: [...], yellow: [...] }
     * @param {Array} bands - 當前輪包含的顏色陣列
     * @returns {boolean}
     */
    isRoundCleared(timelines, bands) {
      if (!timelines || !bands || bands.length === 0) return false;
      for (let i = 0; i < bands.length; i++) {
        const color = bands[i];
        const pile = timelines[color];
        if (!pile || pile.length !== 6) return false;
      }
      return true;
    },

    /**
     * 判定遊戲勝負：60 秒內完成第 1、2 輪即算獲勝
     * @param {number} completedRounds - 已完成的輪數
     * @returns {boolean}
     */
    isGameWin(completedRounds) {
      return typeof completedRounds === "number" && completedRounds >= 2;
    },

    /**
     * 判定是否完美通關（flawless）
     * 全程沒有被退回的拖放且遊戲勝利
     * @param {Object} stats - { win: boolean, wrongDrops: number }
     * @returns {boolean}
     */
    isFlawless(stats) {
      if (!stats) return false;
      return stats.win === true && stats.wrongDrops === 0;
    },

    /**
     * 計分公式：完成的影格帶數×300＋剩餘秒數×10－放錯次數×20（最低 0）
     * @param {Object} stats - { completedBands: number, remainingSeconds: number, wrongDrops: number }
     * @returns {number}
     */
    calcScore(stats) {
      if (!stats) return 0;
      const bands = Number(stats.completedBands) || 0;
      const seconds = Math.max(0, Math.floor(Number(stats.remainingSeconds) || 0));
      const wrong = Number(stats.wrongDrops) || 0;
      const total = bands * 300 + seconds * 10 - wrong * 20;
      return Math.max(0, total);
    },

    /**
     * 計算星等
     * ★1＝win（完成 1、2 輪）
     * ★2＝score >= score2
     * ★3＝flawless === true
     */
    calcStars(stats, customScore2) {
      const score2 = typeof customScore2 === "number" ? customScore2 : R.SCORE2;
      const win = stats && stats.win === true;
      const score = R.calcScore(stats);
      const flawless = R.isFlawless(stats);

      const star1 = win;
      const star2 = win && score >= score2;
      const star3 = win && flawless;

      const count = (star1 ? 1 : 0) + (star2 ? 1 : 0) + (star3 ? 1 : 0);
      return {
        count: count,
        star1: star1,
        star2: star2,
        star3: star3,
        text: (star1 ? "★" : "☆") + (star2 ? "★" : "☆") + (star3 ? "★" : "☆")
      };
    },

    /**
     * 深拷貝盤面狀態（給求解器與模擬用）
     */
    cloneBoard(board) {
      return {
        piles: board.piles.map(function (pile) {
          return pile.map(function (c) {
            return { id: c.id, color: c.color, rank: c.rank, up: c.up };
          });
        }),
        timelines: {
          red: board.timelines.red.map(function (c) { return { id: c.id, color: c.color, rank: c.rank, up: true }; }),
          blue: board.timelines.blue.map(function (c) { return { id: c.id, color: c.color, rank: c.rank, up: true }; }),
          yellow: board.timelines.yellow.map(function (c) { return { id: c.id, color: c.color, rank: c.rank, up: true }; })
        }
      };
    },

    /**
     * 盤面狀態字串序列化（狀態雜湊，供 BFS 查重）
     */
    serializeState(board, bands) {
      const pStr = board.piles.map(function (pile) {
        return pile.map(function (c) {
          return c.up ? (c.color[0] + c.rank) : "X";
        }).join(",");
      }).join("|");

      const tStr = bands.map(function (col) {
        return col[0] + (board.timelines[col] ? board.timelines[col].length : 0);
      }).join("");

      return pStr + "@" + tStr;
    },

    /**
     * 求解器（BFS）：判定指定盤面是否存在合法解通往完成當輪全部影格帶
     * @param {Object} initialBoard - { piles: [...], timelines: { red:[], ... } }
     * @param {Array} bands - 當前輪目標顏色帶
     * @param {number} maxStates - 狀態搜尋上限，避免無解或複雜狀態爆炸
     * @returns {boolean}
     */
    isSolvable(initialBoard, bands, maxStates) {
      if (!initialBoard || !bands || bands.length === 0) return false;
      const limit = maxStates || 1200;
      const queue = [R.cloneBoard(initialBoard)];
      const visited = new Set();
      visited.add(R.serializeState(initialBoard, bands));

      while (queue.length > 0) {
        if (visited.size > limit) break;
        const current = queue.shift();

        // 檢查是否已全部完成
        if (R.isRoundCleared(current.timelines, bands)) {
          return true;
        }

        // 1. 優先嘗試將各牌疊頂端送入時間軸槽
        let pushedToTimeline = false;
        for (let pIdx = 0; pIdx < current.piles.length; pIdx++) {
          const pile = current.piles[pIdx];
          if (pile.length === 0) continue;
          const top = pile[pile.length - 1];
          if (!top.up) continue;

          if (bands.indexOf(top.color) >= 0 && R.canStackTimeline(top, current.timelines[top.color], top.color)) {
            const nextState = R.cloneBoard(current);
            const card = nextState.piles[pIdx].pop();
            // 自動翻開露出來的底牌
            const srcPile = nextState.piles[pIdx];
            if (srcPile.length > 0 && !srcPile[srcPile.length - 1].up) {
              srcPile[srcPile.length - 1].up = true;
            }
            nextState.timelines[card.color].push(card);

            const key = R.serializeState(nextState, bands);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(nextState);
              pushedToTimeline = true;
            }
          }
        }

        // 若有牌可以直接進時間軸，克朗代克規則通常直接推進即可，但為了完整性也繼續探索其他移牌
        // 2. 探索在牌疊之間移動合法牌串
        for (let srcIdx = 0; srcIdx < current.piles.length; srcIdx++) {
          const srcPile = current.piles[srcIdx];
          if (srcPile.length === 0) continue;

          // 找出所有翻開的起始位置（連續降序同色）
          for (let cardIdx = 0; cardIdx < srcPile.length; cardIdx++) {
            if (!srcPile[cardIdx].up) continue;

            // 檢查從 cardIdx 到頂端是否為合法同色降序串
            let isValidSequence = true;
            for (let k = cardIdx; k < srcPile.length - 1; k++) {
              if (srcPile[k].color !== srcPile[k + 1].color || srcPile[k].rank !== srcPile[k + 1].rank + 1) {
                isValidSequence = false;
                break;
              }
            }
            if (!isValidSequence) continue;

            const baseCard = srcPile[cardIdx];

            // 嘗試移動到其他牌疊
            for (let dstIdx = 0; dstIdx < current.piles.length; dstIdx++) {
              if (srcIdx === dstIdx) continue;
              const dstPile = current.piles[dstIdx];

              if (R.canStackTableau(baseCard, dstPile)) {
                // 不要做毫無意義的空欄對調（如果是從空欄底牌搬去另一個空欄，跳過）
                if (cardIdx === 0 && dstPile.length === 0) continue;

                const nextState = R.cloneBoard(current);
                const moving = nextState.piles[srcIdx].splice(cardIdx);
                for (let m = 0; m < moving.length; m++) {
                  nextState.piles[dstIdx].push(moving[m]);
                }
                // 翻開來源疊頂牌
                const remainingSrc = nextState.piles[srcIdx];
                if (remainingSrc.length > 0 && !remainingSrc[remainingSrc.length - 1].up) {
                  remainingSrc[remainingSrc.length - 1].up = true;
                }

                const key = R.serializeState(nextState, bands);
                if (!visited.has(key)) {
                  visited.add(key);
                  queue.push(nextState);
                }
              }
            }
          }
        }
      }
      return false;
    },

    /**
     * 構造法保證可解的發牌器
     * 以確定有解的逆向移動（Reverse construction）將時間軸上的牌拆散至牌疊，
     * 並經 isSolvable 檢驗，確保 100% 存在解！
     * @param {number} roundIndex - 0, 1, 2
     * @param {Function} rng - 0~1 亂數產生器
     * @returns {Object} 初始盤面 { piles, timelines, roundInfo }
     */
    createSolvableBoard(roundIndex, rng) {
      const idx = typeof roundIndex === "number" ? Math.max(0, Math.min(2, roundIndex)) : 0;
      const r = R.ROUNDS[idx];
      const rand = typeof rng === "function" ? rng : Math.random;

      // 產生所有該輪的卡牌
      const allCards = [];
      let cardIdCounter = 1;
      for (let b = 0; b < r.bands.length; b++) {
        const color = r.bands[b];
        for (let rank = 1; rank <= 6; rank++) {
          allCards.push({
            id: color + "-" + rank + "-" + (cardIdCounter++),
            color: color,
            rank: rank,
            up: true
          });
        }
      }

      // 倒推構造（主控 2026-10-16 改）：從「三條時間軸都排好」開始，反覆把某條時間軸最上面那張放回隨機一疊。
      // 倒過來看，每一步都是合法的「疊頂 → 時間軸」，所以發出來的局必定有解，不用搜尋。
      // 原本「洗牌後用 isSolvable(上限 600) 檢查」會把有解的局誤判成無解，第 2、3 輪幾乎每次都退回同一個固定牌局。
      const piles = [];
      for (let p = 0; p < r.pileCount; p++) piles.push([]);
      const tops = {};
      r.bands.forEach(function (c) { tops[c] = 6; });
      const byKey = {};
      allCards.forEach(function (c) { byKey[c.color + "-" + c.rank] = c; });
      for (let left = allCards.length; left > 0; left--) {
        const live = r.bands.filter(function (c) { return tops[c] > 0; });
        const color = live[Math.floor(rand() * live.length)];
        const card = byKey[color + "-" + tops[color]];
        tops[color]--;
        piles[Math.floor(rand() * piles.length)].push({ id: card.id, color: card.color, rank: card.rank, up: true });
      }
      // 蓋牌：只蓋「不是疊頂」的牌（玩家拿走上面的就會翻開），不影響有解
      const hideable = [];
      piles.forEach(function (pile, pi) { for (let k = 0; k < pile.length - 1; k++) hideable.push([pi, k]); });
      for (let n = 0; n < r.faceDownCount && hideable.length; n++) {
        const pick = hideable.splice(Math.floor(rand() * hideable.length), 1)[0];
        piles[pick[0]][pick[1]].up = false;
      }
      return { piles: piles, timelines: { red: [], blue: [], yellow: [] } };
    },

    /**
     * 內部保底建構：保證可解的固定結構
     */
    _generateGuaranteedBoard(roundInfo) {
      const piles = [];
      for (let p = 0; p < roundInfo.pileCount; p++) {
        piles.push([]);
      }
      let cIdx = 0;
      for (let b = 0; b < roundInfo.bands.length; b++) {
        const color = roundInfo.bands[b];
        // 將 6..1 逆向排列，讓 1 在最頂端，玩家立即可移入時間軸
        for (let rank = 6; rank >= 1; rank--) {
          const p = cIdx % roundInfo.pileCount;
          piles[p].push({
            id: color + "-" + rank,
            color: color,
            rank: rank,
            up: true
          });
          cIdx++;
        }
      }
      return {
        piles: piles,
        timelines: { red: [], blue: [], yellow: [] }
      };
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = R;
  } else {
    root.EXIT6_RULES_LAB_D0637 = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
