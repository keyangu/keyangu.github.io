// クイズデータ
// type: number | color | shape : 数字当て、色当て、形当て
// no: 問題番号。今は使っていない。
// qstr: 問題文
// sel: 選択肢。number の場合 int, color の場合色名, shape の場合 phina.displya.XXXShape
// ans: 正解データ
var question_v2 = [{
    "type": "number",
    "no": 1,
    "qstr": "「いち」はどっち?",
    "sel": [1, 2],
    "ans": 1,
},
{
    "type": "number",
    "no": 2,
    "qstr": "「に」はどっち？",
    "sel": [2, 7],
    "ans": 2,
},
{
    "type": "number",
    "no": 3,
    "qstr": "「さん」はどっち？",
    "sel": [5, 3],
    "ans": 3,
},
{
    "type": "number",
    "no": 4,
    "qstr": "「よん」はどっち？",
    "sel": [4, 8],
    "ans": 4,
},
{
    "type": "number",
    "no": 5,
    "qstr": "「ご」はどっち？",
    "sel": [5, 2],
    "ans": 5,
},
{
    "type": "number",
    "no": 6,
    "qstr": "「ろく」はどっち？",
    "sel": [6, 9],
    "ans": 6,
},
{
    "type": "number",
    "no": 7,
    "qstr": "「なな」はどっち？",
    "sel": [2, 7],
    "ans": 7,
},
{
    "type": "number",
    "no": 8,
    "qstr": "「はち」はどっち？",
    "sel": [8, 1],
    "ans": 8,
},
{
    "type": "number",
    "no": 9,
    "qstr": "「きゅう」はどっち？",
    "sel": [9, 3],
    "ans": 9,
},
{
    "type": "color",
    "no": 10,
    "qstr": "「あか」はどっち?",
    "sel": ["black", "red"],
    "ans": "red",
},
{
    "type": "color",
    "no": 11,
    "qstr": "「あお」はどっち?",
    "sel": ["blue", "green"],
    "ans": "blue",
},
{
    "type": "color",
    "no": 12,
    "qstr": "「みどり」はどっち?",
    "sel": ["red", "green"],
    "ans": "green",
},
{
    "type": "color",
    "no": 13,
    "qstr": "「きいろ」はどっち?",
    "sel": ["yellow", "blue"],
    "ans": "yellow",
},
{
    "type": "shape",
    "no": 14,
    "qstr": "「さんかく」はどっち?",
    "sel": ["phina.display.TriangleShape", "phina.display.RectangleShape"],
    "ans": "phina.display.TriangleShape",
},
{
    "type": "shape",
    "no": 15,
    "qstr": "「まる」はどっち?",
    "sel": ["phina.display.CircleShape", "phina.display.TriangleShape"],
    "ans": "phina.display.CircleShape",
},
{
    "type": "shape",
    "no": 16,
    "qstr": "「しかく」はどっち?",
    "sel": ["phina.display.CircleShape", "phina.display.RectangleShape"],
    "ans": "phina.display.RectangleShape",
},
];
