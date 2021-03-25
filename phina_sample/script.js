/*
 * Runstant
 * 思いたったらすぐ開発. プログラミングに革命を...
 */

// グローバルに展開
phina.globalize();

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
    var label = Label('Hello, phina.js!').addChildTo(this);
    label.x = this.gridX.center(); // x 軸
    label.y = this.gridY.center(); // y 軸
    label.fill = '#eee';  // 塗りつぶし色

    var rect = Shape({
      x: 200,
      y: 200,
      width: 100,
      height: 100,
    }).addChildTo(this);

    rect.tweener.rotateTo(-10, 500).play();
    rect.tweener.rotateTo(-13, 300).play();
    rect.tweener.rotateTo(-15, 200).play();
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
