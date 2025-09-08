const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = "/tmp/app";
const SUB_PATH = "sub"; // 固定订阅路径
let subContent = "sub not ready";

// 注册 /sub 路由
app.get(`/${SUB_PATH}`, (req, res) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(subContent);
});

// 下载 cloudflared
function downloadCloudflared() {
  return new Promise((resolve, reject) => {
    const url =
      "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64";
    const file = path.join(FILE_PATH, "cloudflared");

    if (fs.existsSync(file)) {
      console.log("cloudflared 已存在，跳过下载");
      resolve(file);
      return;
    }

    console.log("下载 cloudflared ...");
    const fileStream = fs.createWriteStream(file);
    https.get(url, (res) => {
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        fs.chmodSync(file, 0o755);
        console.log("cloudflared 下载完成");
        resolve(file);
      });
    }).on("error", (err) => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
      reject(err);
    });
  });
}

// 启动 cloudflared 隧道
function startArgo() {
  console.log("启动 Argo Quick Tunnel...");
  const logFile = path.join(FILE_PATH, "boot.log");
  const argo = spawn("./cloudflared", ["tunnel", "--url", "http://localhost:" + PORT], {
    cwd: FILE_PATH,
    stdio: ["ignore", fs.openSync(logFile, "a"), fs.openSync(logFile, "a")],
  });

  // 定时解析域名并生成订阅
  setInterval(() => {
    if (!fs.existsSync(logFile)) return;
    const log = fs.readFileSync(logFile, "utf-8");
    const match = log.match(/https?:\/\/([^ ]*trycloudflare\.com)/);
    if (match) {
      const argoDomain = match[1];
      console.log("ArgoDomain:", argoDomain);

      const uuid = "11111111-2222-3333-4444-555555555555"; // 你可以改成自己的 UUID

      // VMess 节点
      const vmess = {
        v: "2",
        ps: "argo-vmess",
        add: argoDomain,
        port: "443",
        id: uuid,
        aid: "0",
        net: "ws",
        type: "none",
        host: argoDomain,
        path: "/",
        tls: "tls",
      };

      const vmessStr = "vmess://" + Buffer.from(JSON.stringify(vmess)).toString("base64");

      // VLESS 节点
      const vlessStr =
        `vless://${uuid}@${argoDomain}:443` +
        `?encryption=none&security=tls&type=ws&host=${argoDomain}&path=/` +
        `#argo-vless`;

      // 更新订阅内容（VMess + VLESS）
      subContent = [vmessStr, vlessStr].join("\n");
    }
  }, 5000);
}

// 启动 HTTP server
app.listen(PORT, async () => {
  console.log(`HTTP server running on port:${PORT}!`);
  fs.mkdirSync(FILE_PATH, { recursive: true });
  await downloadCloudflared();
  startArgo();
});
