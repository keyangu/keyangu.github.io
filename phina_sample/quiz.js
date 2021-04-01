// グローバルに展開
phina.globalize();

// 問題
var question = {
    "no": 1,
    "qstr": "1はどっち?",
    "sel": [1, 2],
    "ans": 1,
};

// 定数
var SCREEN_WIDTH = 800
var SCREEN_HEIGHT = 600
var PIECE_NUM_X = 2;
var PIECE_NUM_Y = 1;
var PIECE_GROUP_OFS_Y = 200;
// var GRID_SIZE = SCREEN_WIDTH / PIECE_NUM_X;
var GRID_SIZE = 200;
var PIECE_SIZE = GRID_SIZE * 0.95;
var PIECE_OFFSET = GRID_SIZE / 2;

var ASSETS = {
   image: {
    //  'bg': './images/bg.jpg',
//     'Player': './images/ETNR_TOMITA_01.png',
//     'again': './images/A_48.png',
//     'block': './images/Box_06.png',
//     'goal': './images/Goal_00.png',
//     'wall_0': './images/Block_05.png',
//     'wall_1': './images/Block_04.png',
        'correct': './images/correct.png',
    },
    sound: {
        'correct': './sound/crrect_answer3.mp3',
        'blip': './sound/blip01.mp3',
    },
};

/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // 初期化
  init: function() {
    // super init
    this.superInit();
    // 背景色
    this.backgroundColor = '#444';
    // グリッド
    var grid = Grid(SCREEN_WIDTH, PIECE_NUM_X);
    
    // ラベルを生成
    var label = Label({
        text: question["qstr"],
        fontSize: 60,
        fill: '#eee',
        }).addChildTo(this);
    label.setPosition(this.gridX.center(), 80);
    
    // ピースグループ
    var pieceGroup = DisplayElement().addChildTo(this);
    pieceGroup.y = 200;
    // ピース配置
    PIECE_NUM_X.times(function(spanX) {
        PIECE_NUM_Y.times(function(spanY) {
            // 番号
            var num = spanY * PIECE_NUM_X + spanX + 1;
            // ピース作成
            var piece = Piece(num).addChildTo(pieceGroup);
            piece.x = grid.span(spanX) + PIECE_OFFSET;
            piece.y = grid.span(spanY) + PIECE_OFFSET;
            
            // タッチ有効
            piece.setInteractive(true);
            // タッチ時の処理
            piece.onpointend = function() {
                if (question["ans"] == this.num) {
                    SoundManager.play('correct');
                    label.text = "正解！"
                } else {
                    SoundManager.play('blip');
                    label.text = "あれれ～?"
                }
                console.log(this.num);
            };
        });
    });
    
    var button = Button({
        x: this.gridX.center(),
        y: 500,
        text: "リセット",
    }).addChildTo(this);
    
    button.onpointend = function() {
        label.text = question["qstr"]
    }


    
    // var rect = Shape({
    //   x: 200,
    //   y: 200,
    //   width: 100,
    //   height: 100,
    // }).addChildTo(this);
    
    // rect.tweener.rotateTo(-45, 1000, "swing").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutCubic").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutQuart").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutQuint").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutExpo").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutBounce").play();
  },
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
            fill: 'silver',
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

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    startLabel: 'main', // MainScene から開始
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
  });

  // fps表示
  app.enableStats();

  // 実行
  app.run();
});
