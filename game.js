kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [0.5, 5, 7, 1], //rgbe
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("p", "pipe_up.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("hr", "heart.png");
let score = 0;
let hearts = 3;
scene("game", () => {
  loadSound("gam", "gamesound.mp3");
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                                ==c c  ===                                  k             ",
    "                                       cc           ==                                                ",
    "                                      ===     === ",
    "                                      ====         ====               ===                                ",
    "                                    ==     =$==$==    ==         ===       ===                            ",
    "                                  ==                       ==                                          ",
    "                                 ===                        ===    ===  ===                                    ",
    "                                    ==                ==     $        ====                                ",
    "                                      ==== == === ===              ====     ===                                   p   ",
    "        m                         ===                        m   ====            ===                     m      ",
    "==========   =====  ===       =============================================================================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    c: [sprite("coin"), solid(), "coin"],
    p: [sprite("p"), solid(), "p"],
    $: [sprite("surprise"), solid(), "surprise_coin"],
    "^": [sprite("surprise"), solid(), "surprise_mushroom"],
    m: [sprite("mario"), solid(), "mario", body()],
  };

  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("block"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scorelabel = add([text("Score: 0")]);
  const heartObj = add([sprite("hr"), text("    x3", 12), origin("center")]);
  keyDown("d", () => {
    player.move(200, 0);
  });
  keyDown("a", () => {
    player.move(-200, 0);
  });
  keyDown("space", () => {
    player.jump(CURRENT_JUMP_FORCE);
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("c", obj.gridPos.sub(0, 1));
    }
  });
  action("coin", (obj) => {
    obj.move(20, 0);
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    player.biggify(5);
  });
  player.collides("p", (obj) => {
    keyDown("s", () => {
      go("level2");
    });
  });

  player.action(() => {
    camPos(player.pos);
    scorelabel.pos = player.pos.sub(400, 200);
    heartObj.pos = player.pos.sub(400, 170);
    heartObj.text = "     x" + hearts;
    scorelabel.text = "score: " + score;
    if (player.pos.y > 500) hearts--;
    if (hearts <= 0) {
      go("lose");
    }
  });
  action("mario", (obj) => {
    obj.move(-30, 0);
  });

  let lastGrounded = true;
  player.collides("mario", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.action(() => {
    lastGrounded = player.grounded();
  });
});

scene("lose", () => {
  hearts = 3;
  add([
    text("GAME OVER\n u lost"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});
scene("win", () => {
  add([text("win"), origin("center"), pos(width() / 2, height() / 2)]);
});
start("game");
