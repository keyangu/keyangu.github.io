// グローバルに展開
phina.globalize();

// 定数
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;
var PIECE_NUM_X = 2;
var PIECE_NUM_Y = 1;
var PIECE_GROUP_OFS_Y = 200;
// XXX 選択肢を可変にするなら個々の対応は必須
var GRID_SIZE = SCREEN_WIDTH / PIECE_NUM_X;
var PIECE_SIZE = GRID_SIZE * 0.8;
var PIECE_OFFSET = GRID_SIZE / 2;
var qidx = 0;

var LOCAL_DEBUG = false;

// アセット
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

if (LOCAL_DEBUG) {
    ASSETS.sound = {};
}

/*
 * タイトルシーンを結果表示シーンとして利用
 * ゲーム開始時は MainScene からスタート、全問正解後にこのシーンを表示
 * タップで MainScene に戻る。
 * phina デフォルトの ResultScene は余計な機能がついているので使っていない。
 */
phina.define("TitleScene", {
    superClass: 'DisplayScene',
    init : function(option) {
        this.superInit(option);

        // XXX Shape追加するより BGColor設定だけでいいかも
        // this.backgroundColor = '#444';
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

        // 効果音再生
        if (!LOCAL_DEBUG) {
            SoundManager.play('kansei');
        }

        // 画面タッチで次のシーンへ
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
        var quiz = question_v2;     // from quiz_data.js
        // 2周目以降の場合を考慮し qidx 初期化
        qidx = 0;
        // super init
        this.superInit();
        // 背景色
        this.backgroundColor = '#444';
        // グリッド
        var grid = Grid(640, PIECE_NUM_X);

        // 問題文表示ラベル
        var qtext = Label({
            text: quiz[qidx]["qstr"],
            fontSize: 60,
            fill: '#eee',
            }).addChildTo(this);
        qtext.setPosition(this.gridX.center(), 80);

        // ピース(選択肢)グループ
        var pieceGroup = DisplayElement({y: 200}).addChildTo(this);

        // 正解時の◎表示
        var correct = Sprite('correct').addChildTo(this);
        correct.setPosition(320, 320);

        // 問題作成関数
        // qi は 問題インデックス(qidx)
        var createQuestion = function(qi) {
            // 正解時エフェクトの初期化
            correct.setSize(1200, 1200);
            correct.alpha = 0;

            // 問題文テキストをセット
            qtext.text = quiz[qi]["qstr"];

            // ピースグループの再生成
            // 前問の選択肢をクリア
            // XXX remove() だと挙動がおかしかったので、空配列上書きにしている
            // JavaScriptでこの書き方をするとリークする？
            pieceGroup.children = [];

            // ピース選択時に実行するコールバック
            var touchEvent = function() {
                //経過時間取得
                resultDispSta = elapsedMS;
                // 結果表示中フラグ
                fresultDisp = true;
                // 選択したピースと正解の突き合わせ
                // 問題の種類によって確認するものが異なる
                var checkVal;
                if (quiz[qidx]["type"] == "number") {
                    checkVal = this.num;
                } else if (quiz[qidx]["type"] == "color") {
                    checkVal = this.fill;
                } else if (quiz[qidx]["type"] == "shape") {
                    checkVal = this.className;
                }
                if (quiz[qidx]["ans"] == checkVal) {
                    // 正解時の処理
                    if (!LOCAL_DEBUG) {
                        SoundManager.play('correct');
                    }
                    var easing = correct.tweener.to({
                        width: 600,
                        height: 600,
                        alpha: 1.0,
                    }, 300, "easeOutQuint").play();
                    qtext.text = "せいかい！";
                    fcorrect = true;
                } else {
                    // 不正解時の処理
                    if (!LOCAL_DEBUG) {
                        SoundManager.play('blip');
                    }
                    qtext.text = "あれれ～?";
                    fcorrect = false;
                }
                // console.log(this.num);
            };

            // ピース(選択肢)配置
            // XXX 選択肢分のループを回すが、現状はGridが2つ分しか
            // 対応していないため、実質2択
            quiz[qidx]["sel"].forEach(function(value, index) {
                var piece;
                // 問題の種別に応じて選択肢の形状を変える
                // XXX ファクトリメソッドでも用意すると良い
                if (quiz[qidx]["type"] == 'number') {
                    // 番号
                    var num = value;
                    // ピース作成
                    piece = Piece(num).addChildTo(pieceGroup);
                } else if (quiz[qidx]["type"] == 'color') {
                    piece = CircleShape({
                        radius: PIECE_SIZE / 2,
                        fill: quiz[qidx]["sel"][index],
                    }).addChildTo(pieceGroup);
                    piece.setInteractive(true);
                    piece.onpointend = touchEvent;
                } else if (quiz[qidx]["type"] == 'shape') {
                    if (quiz[qidx]['sel'][index] == "phina.display.CircleShape") {
                        piece = CircleShape({
                            radius: PIECE_SIZE / 2,
                            fill: "#00C",
                        }).addChildTo(pieceGroup);
                    } else if (quiz[qidx]['sel'][index] == "phina.display.TriangleShape") {
                        piece = TriangleShape({
                            radius: PIECE_SIZE / 3 * 2,
                            fill: "#00E",
                        }).addChildTo(pieceGroup);
                    } else if (quiz[qidx]['sel'][index] == "phina.display.RectangleShape") {
                        piece = RectangleShape({
                            width: PIECE_SIZE,
                            height: PIECE_SIZE,
                            fill: "#00E",
                        }).addChildTo(pieceGroup);
                    }
                }
                piece.x = grid.span(index) + PIECE_OFFSET;
                piece.y = grid.span(0) + PIECE_OFFSET;
                // Triangle だけ サイズと位置指定の結果が意図と異なるので微調整
                if (quiz[qidx]["type"] == "shape" && quiz[qidx]["sel"][index] == "phina.display.TriangleShape") {
                    piece.x = grid.span(index) + PIECE_OFFSET;
                    piece.y = grid.span(0) + PIECE_OFFSET + (PIECE_SIZE/5);
                }
                // タッチ有効
                piece.setInteractive(true);
                // タッチ時の処理
                piece.onpointend = touchEvent;
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

        // update
        // やることが少なく、クロージャにしたほうが便利なのでここで定義してしまう
        this.update = function(app) {
            // 経過時間の取得
            elapsedMS = app.elapsedTime;
            if (fresultDisp && (elapsedMS - resultDispSta > 3000)) {
                // 結果表示中 かつ 3秒経過したら、結果表示をクリアする
                fresultDisp = false;
                if (fcorrect) {
                    // 正解していた場合は次の問題に進む
                    qidx++;
                    if (qidx >= quiz.length) {
                        // 全問正解の場合は TitleScene へ
                        self.nextLabel = "title";
                        self.exit();
                    } else {
                        // 問題生成
                        createQuestion(qidx);
                    }
                } else {
                    // 問題文の表示をもとに戻す
                    qtext.text = quiz[qidx]["qstr"];
                }
            }
        }
    },

    // XXX 今はメソッド定義ではなく、init 内で処理をしている。
    // ちゃんとやるなら メンバ変数や持ち回りのゲーム内変数を使ってこっちで実装すべき
//   update: function(app) {
//   },
});

/*
 * ピースクラス
 * 数字当て問題の選択肢。角丸Rectに数字を貼り付けたもの
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
    setSize: function(width, height) {
        this.width = width;
        this.height = height;
    }
});

// ポーズ画面用のシーン。今は使っていない
// XXX 正解、不正解表示をこっちのシーンにすると、表示中にボタンを押されることがなくなったり、
// フラグで状態管理する必要がなくなるのでより良い。
// 時限で戻る
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
    // 画面をフィットさせない
    // fit: false,
    assets: ASSETS,
  });
  // fps表示
//   app.enableStats();
  // 実行
  app.run();
});
