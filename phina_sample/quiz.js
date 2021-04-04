// グローバルに展開
phina.globalize();

// 問題
var question = [{
    "no": 1,
    "qstr": "「いち」はどっち?",
    "sel": [1, 2],
    "ans": 1,
},
{
    "no": 2,
    "qstr": "「に」はどっち？",
    "sel": [2, 7],
    "ans": 2,
},
{
    "no": 3,
    "qstr": "「さん」はどっち？",
    "sel": [5, 3],
    "ans": 3,
},
{
    "no": 4,
    "qstr": "「よん」はどっち？",
    "sel": [4, 8],
    "ans": 4,
},
{
    "no": 5,
    "qstr": "「ご」はどっち？",
    "sel": [5, 2],
    "ans": 5,
},
{
    "no": 6,
    "qstr": "「ろく」はどっち？",
    "sel": [6, 9],
    "ans": 6,
},
{
    "no": 7,
    "qstr": "「なな」はどっち？",
    "sel": [2, 7],
    "ans": 7,
},
{
    "no": 8,
    "qstr": "「はち」はどっち？",
    "sel": [8, 1],
    "ans": 8,
},
{
    "no": 9,
    "qstr": "「きゅう」はどっち？",
    "sel": [9, 3],
    "ans": 9,
},
];

// 定数
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;
var PIECE_NUM_X = 2;
var PIECE_NUM_Y = 1;
var PIECE_GROUP_OFS_Y = 200;
var GRID_SIZE = SCREEN_WIDTH / PIECE_NUM_X;
var PIECE_SIZE = GRID_SIZE * 0.8;
var PIECE_OFFSET = GRID_SIZE / 2;
var qidx = 0;

var ASSETS = {
   image: {
        'correct': './images/correct.png',
    },
    sound: {
        'correct': './sound/crrect_answer3.mp3',
        'blip': './sound/blip4.mp3',
        'kansei': './sound/kansei.mp3',
    },
};

phina.define("TitleScene", {
    superClass: 'DisplayScene',
    init : function(option) {
        this.superInit(option);
        var bg = Shape({
            fill: '#444',
            x: 320,
            y: 480,
            width: 640,
            height: 960,
        }).addChildTo(this);
        var label = Label({
            x: 320,
            y: 480,
            text: "やったね！！！",
            fontSize: 60,
            fill: '#eee',
        }).addChildTo(this);

        SoundManager.play('kansei');

        this.on('pointend', function() {
            this.exit();
        })
    },
});

/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // 初期化
  init: function() {
    var self = this;
    var elapsedMS = 0;
    var resultDispSta = 0;
    var fresultDisp = false;
    qidx = 0;
    // super init
    this.superInit();
    // 背景色
    this.backgroundColor = '#444';
    // グリッド
    var grid = Grid(640, PIECE_NUM_X);
    
    // 問題文
    var qtext = Label({
        text: question[qidx]["qstr"],
        fontSize: 60,
        fill: '#eee',
        }).addChildTo(this);
    qtext.setPosition(this.gridX.center(), 80);

    // ピースグループ
    var pieceGroup = DisplayElement({y: 200}).addChildTo(this);

    // 正解時の◎表示
    var correct = Sprite('correct').addChildTo(this);
    correct.setPosition(320, 320);

    // 問題作成関数
    var createQuestion = function(qi) {
        // 正解エフェクトの初期化
        correct.setSize(1200, 1200);
        correct.alpha = 0;

        // 問題文テキストをセット
        qtext.text = question[qi]["qstr"];

        // ピースグループの再生成
        pieceGroup.children = [];
        // pieceGroup.children.forEach(function(v) {
        //     v.remove();
        // });
        // pieceGroup.remove();
        // pieceGroup = DisplayElement({y: 200}).addChildTo(this);
        // ピース配置
        question[qidx]["sel"].forEach(function(value, index) {
            // 番号
            var num = value;
            // ピース作成
            var piece = Piece(num).addChildTo(pieceGroup);
            piece.x = grid.span(index) + PIECE_OFFSET;
            piece.y = grid.span(0) + PIECE_OFFSET;
            console.log("piece.x: " + piece.x);
            console.log("grid.span: " + grid.span(index));
            
            // タッチ有効
            piece.setInteractive(true);
            // タッチ時の処理
            piece.onpointend = function() {
                resultDispSta = elapsedMS;
                fresultDisp = true;
                if (question[qidx]["ans"] == this.num) {
                    // TODO 連続で押すと前の音が続くので止めておきたい
                    SoundManager.play('correct');
                    var easing = correct.tweener.to({
                        width: 600,
                        height: 600,
                        alpha: 1.0,
                    }, 300, "easeOutQuint").play();
                    // correct.show();
                    qtext.text = "せいかい！"
                    fcorrect = true;
                } else {
                    SoundManager.play('blip');
                    qtext.text = "あれれ～?"
                    fcorrect = false;
                }
                console.log(this.num);
            };
        });
    };

    // 最初の問題作成
    createQuestion(qidx);

    // リセットボタン
    var button = Button({
        x: this.gridX.center(),
        y: 700,
        text: "リセット",
    }).addChildTo(this);
    button.onpointend = function() {
        qidx = 0;
        createQuestion(qidx);
    }

    this.update = function(app) {
        elapsedMS = app.elapsedTime;
        if (fresultDisp && (elapsedMS - resultDispSta > 3000)) {
            fresultDisp = false;
            if (fcorrect) {
                qidx++;
                if (qidx >= question.length) {
                    self.nextLabel = "title";
                    self.exit();
                } else {
                    createQuestion(qidx);
                }
            } else {
                qtext.text = question[qidx]["qstr"];
            }
        }
    }
  },

//   update: function(app) {
//   },
});

/*
 * ピースクラス
 */
phina.define('Piece', {
    superClass: 'RectangleShape',
    init: function(num) {
        this.superInit({
            width: PIECE_SIZE,
            height: PIECE_SIZE,
            cornerRadius: 10,
            fill: 'gray',
            stroke: 'white',
        });
        this.num = num;
        this.label = Label({
            text: this.num + '',
            fontSize: PIECE_SIZE * 0.8,
            fontFamily:"'メイリオ'",
            fill: 'white',
        }).addChildTo(this);
    },
});


// ポーズ画面用のシーン。今は使っていない
// phina.define('ResultScene', {
//     superClass: 'DisplayScene',
//     init: function() {
//         this.superInit();
//         this.backgroundColor = 'rgba(0,0,0,0.7)';
//         var self = this;
//         this.update = function(app) {
//             var elapsedMS = app.elapsedTime;
//         }
//     },
// });

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    startLabel: 'main',
    assets: ASSETS,
  });
  // fps表示
  app.enableStats();
  // 実行
  app.run();
});
