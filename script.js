const creatures = [
  {
    id: "crab",
    name: "カニちゃん",
    author: "テスト投稿",
    location: "B区画",
    date: "撮影日未設定",
    species: "カニの仲間",
    comment: "草の奥で、こちらの様子をうかがっていました。",
    image: "images/creature-1.jpg",
    times: ["evening", "night"]
  },
  {
    id: "bird",
    name: "緑のハト",
    author: "テスト投稿",
    location: "いのだキャンプ場",
    date: "撮影日未設定",
    species: "ハトの仲間",
    comment: "ヤシの葉の下で、静かに枝へとまっていました。",
    image: "images/creature-2.jpg",
    times: ["day", "evening"]
  },
  {
    id: "turtle",
    name: "森のカメ",
    author: "テスト投稿",
    location: "いのだキャンプ場",
    date: "撮影日未設定",
    species: "カメの仲間",
    comment: "草に隠れながら、ゆっくり森を歩いていました。",
    image: "images/creature-3.jpg",
    times: ["day", "evening"]
  }
];

const stream = document.getElementById("forestStream");
const detail = document.getElementById("detail");
const encounterButton = document.getElementById("encounterButton");
const closeButton = document.getElementById("closeButton");
const themeButtons = [...document.querySelectorAll(".theme-button")];

let currentTheme = "day";

function makeCreatureCard(creature) {
  const button = document.createElement("button");
  button.className = "bird-card";
  button.type = "button";
  button.setAttribute("aria-label", creature.name + "の詳細を見る");

  const imageWrap = document.createElement("div");
  imageWrap.className = "bird-card-image";

  const image = document.createElement("img");
  image.src = creature.image;
  image.alt = creature.name;

  const label = document.createElement("span");
  label.className = "bird-card-label";
  label.textContent = creature.name;

  imageWrap.appendChild(image);
  button.append(imageWrap, label);
  button.addEventListener("click", () => openDetail(creature));

  return button;
}

function makeEmptyCard() {
  const div = document.createElement("div");
  div.className = "bird-card empty";
  div.setAttribute("aria-label", "まだ投稿のない空白");

  const circle = document.createElement("div");
  circle.className = "empty-circle";
  circle.textContent = "まだ、森に気配はありません";

  const spacer = document.createElement("span");
  spacer.className = "bird-card-label";
  spacer.setAttribute("aria-hidden", "true");
  spacer.innerHTML = "&nbsp;";

  div.append(circle, spacer);

  return div;
}

function buildRow(rowIndex, creature) {
  const wrap = document.createElement("div");
  wrap.className = "track-wrap";

  const track = document.createElement("div");
  track.className =
    "track" +
    (rowIndex === 1 ? " reverse" : "") +
    (rowIndex === 2 ? " slow" : "");

  /*
    1列につき実画像は1種類だけ。
    画像の間を十分な空白で離すため、
    画面内で同じ画像が並びにくい構成です。

    無限スクロールの継ぎ目用に列全体は複製しますが、
    複製同士は遠く離れています。
  */
  const unit = [
    makeEmptyCard(),
    makeEmptyCard(),
    creature ? makeCreatureCard(creature) : makeEmptyCard(),
    makeEmptyCard(),
    makeEmptyCard(),
    makeEmptyCard(),
    makeEmptyCard(),
    makeEmptyCard()
  ];

  const cloneUnit = unit.map((node) => {
    if (node.classList.contains("empty")) {
      return makeEmptyCard();
    }

    return makeCreatureCard(creature);
  });

  [...unit, ...cloneUnit].forEach((node) => {
    track.appendChild(node);
  });

  wrap.appendChild(track);

  return wrap;
}

function rebuildStream() {
  stream.replaceChildren();

  const available = creatures.filter((creature) =>
    creature.times.includes(currentTheme)
  );

  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    /*
      同じ画像を複数列に出さない。
      足りない列は空白のままにする。
    */
    stream.appendChild(
      buildRow(rowIndex, available[rowIndex] || null)
    );
  }
}

function setTheme(theme) {
  currentTheme = theme;
  document.body.dataset.theme = theme;

  themeButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.themeValue === theme
    );
  });

  rebuildStream();
}

function openDetail(creature) {
  document.getElementById("birdName").textContent = creature.name;
  document.getElementById("author").textContent = creature.author;
  document.getElementById("location").textContent = creature.location;
  document.getElementById("date").textContent = creature.date;
  document.getElementById("species").textContent = creature.species;
  document.getElementById("comment").textContent = creature.comment;

  document.getElementById(
    "detailImage"
  ).style.backgroundImage = `url("${creature.image}")`;

  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");
}

function closeDetail() {
  detail.classList.remove("open");
  detail.setAttribute("aria-hidden", "true");
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTheme(button.dataset.themeValue);
  });
});

const hour = new Date().getHours();

setTheme(
  hour >= 5 && hour < 16
    ? "day"
    : hour >= 16 && hour < 19
      ? "evening"
      : "night"
);

encounterButton.addEventListener("click", () => {
  const available = creatures.filter((creature) =>
    creature.times.includes(currentTheme)
  );

  if (available.length === 0) {
    return;
  }

  const creature =
    available[Math.floor(Math.random() * available.length)];

  openDetail(creature);
});

closeButton.addEventListener("click", closeDetail);

detail.addEventListener("click", (event) => {
  if (event.target === detail) {
    closeDetail();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDetail();
  }
});
