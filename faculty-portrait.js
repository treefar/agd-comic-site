// Manually annotated from each unchanged 1024px source; 2026-10-22.
// Crown-to-chin head height, eye midpoint and lateral head bounds are separate landmarks.
const FacultyPortraitModel = (() => {
  const landmarks = {
  "tengshuyuan": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/09/78pan_0-scaled-e1725608026576-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 112,
    "chin": 608,
    "eyeX": 490,
    "eyeY": 354,
    "left": 300,
    "right": 690
  },
  "chiangyamei": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/1176pan-scaled-e1712908337437-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 36,
    "chin": 534,
    "eyeX": 560,
    "eyeY": 296,
    "left": 330,
    "right": 758
  },
  "chenchungkuang": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/09/1189pan_0-scaled-e1725608414852-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 50,
    "chin": 604,
    "eyeX": 428,
    "eyeY": 354,
    "left": 306,
    "right": 668
  },
  "yangchihchang": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/1092pan-scaled-e1712909734467-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 18,
    "chin": 496,
    "eyeX": 490,
    "eyeY": 244,
    "left": 355,
    "right": 730
  },
  "chenchinghung": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/09/311pan-scaled-e1725608387187-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 156,
    "chin": 600,
    "eyeX": 552,
    "eyeY": 394,
    "left": 452,
    "right": 778
  },
  "changchunya": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/990pan-YAYA-scaled-e1712910086728-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 40,
    "chin": 412,
    "eyeX": 528,
    "eyeY": 206,
    "left": 285,
    "right": 646
  },
  "chiushinchan": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/jjjj-scaled-e1712910712234-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 26,
    "chin": 510,
    "eyeX": 500,
    "eyeY": 276,
    "left": 380,
    "right": 772
  },
  "chenmeijung": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/1185pan-scaled-e1712910426723-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 16,
    "chin": 490,
    "eyeX": 441,
    "eyeY": 266,
    "left": 308,
    "right": 710
  },
  "wuyenshen": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/09/513-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 46,
    "chin": 610,
    "eyeX": 546,
    "eyeY": 312,
    "left": 394,
    "right": 834
  },
  "wangtsungli": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/09/1223pan-scaled-e1725608460881-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 48,
    "chin": 620,
    "eyeX": 380,
    "eyeY": 444,
    "left": 240,
    "right": 665
  },
  "chentsaiyu": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/157pan-scaled-e1712912482260-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 50,
    "chin": 416,
    "eyeX": 592,
    "eyeY": 238,
    "left": 466,
    "right": 758
  },
  "chiangtienhua": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/04/1170pan-scaled-e1712911533827-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 22,
    "chin": 488,
    "eyeX": 532,
    "eyeY": 242,
    "left": 285,
    "right": 688
  },
  "yinli": {
    "photo": "https://www.dgd.stu.edu.tw/wp-content/uploads/sites/132/2024/09/192pan_0-scaled-e1725608280681-1024x1024.jpg",
    "size": [
      1024,
      1024
    ],
    "crown": 66,
    "chin": 556,
    "eyeX": 485,
    "eyeY": 342,
    "left": 300,
    "right": 656
  }
};
  const target = Object.freeze({headHeight: .66, eyeY: .50, eyeX: .50});
  function styleFor(slug, photo) {
    const p = landmarks[slug];
    // New source photos must be measured again; do not reuse a different crop silently.
    if (!p || p.photo !== photo) return null;
    const height = p.size[1] * target.headHeight / (p.chin - p.crown) * 100;
    return {height: height + '%', top: (target.eyeY * 100 - p.eyeY / p.size[1] * height) + '%', left: '50%', transform: 'translateX(' + (-p.eyeX / p.size[0] * 100) + '%)'};
  }
  return {landmarks, target, styleFor};
})();
