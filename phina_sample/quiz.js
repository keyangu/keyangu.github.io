/*
 * Runstant
 * 思いたったらすぐ開発. プログラミングに革命を...
 */

// https://qiita.com/alkn203/items/70c09abc21c60bf75899
// を参考にしたクイズゲームを作る予定

// グローバルに展開
phina.globalize();

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
    // 位置決め補助のためのグリッドを生成する。
    // グリッドはコンテナではなく、座標計算のためのユーティリティとして用いる。
    // Grid(width, columns, loop, offset)
    // Grid.span(index): returns `unitWitdh * index + offset`
    // Grid.center(offset) returns `(width/2) + (unitWidth*offset)`
    // Grid.unit() returns `unitWidth`
    var grid = Grid(SCREEN_WIDTH, PIECE_NUM_X);
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
                console.log(this.num);
            };
        });
    });

    // ラベルを生成
    var label = Label({
        x: 80,
        y: 80,
        text: '問題',
        fontSize: 60,
        fill: '#eee',
        }).addChildTo(this);

    var rand = Random()
    console.log(rand.randint(0, 100))
    console.log(rand.randint(0, 100))
    console.log(rand.randint(0, 100))
    console.log(rand.randarray(10, 1, 10))

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
  });

  app.enableStats();

  // 実行
  app.run();
});
