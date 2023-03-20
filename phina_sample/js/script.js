// グローバルに展開
phina.globalize();

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

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

    // ラベルを生成
    var label = Label({
      text: 'Hello, phina.js!',
      x: this.gridX.center(),
      y: this.gridY.center(),
      fill: '#eee',
    }).addChildTo(this);

    var rect = Shape({
      x: 200,
      y: 200,
      width: 100,
      height: 100,
    }).addChildTo(this);

    rect.tweener.rotateTo(-15, 500, "easeOutCubic").play();    
    // rect.tweener.rotateTo(-45, 1000, "swing").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutCubic").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutQuart").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutQuint").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutExpo").play();
    // rect.tweener.rotateTo(-15, 1000, "easeOutBounce").play();
  },
});

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    startLabel: 'main', // MainScene から開始
  });

  app.enableStats();

  // 実行
  app.run();
});
