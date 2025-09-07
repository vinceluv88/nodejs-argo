const express = require("express");
const app = express();
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');

// 环境变量
const UPLOAD_URL = process.env.UPLOAD_URL || '';
const PROJECT_URL = process.env.PROJECT_URL || '';
const AUTO_ACCESS = process.env.AUTO_ACCESS || false;
const FILE_PATH = process.env.FILE_PATH || './tmp';
const SUB_PATH = process.env.SUB_PATH || 'sub';
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const UUID = process.env.UUID || '15436478-8eea-47a3-93d4-3a92b6a6601f';
const NAME = process.env.NAME || 'Vls';
const CFIP = process.env.CFIP || 'www.visa.com.sg';
const CFPORT = process.env.CFPORT || 443;

// 创建运行文件夹
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH);

// 根路由
app.get("/", (req, res) => res.send("Hello world!"));

// 根据系统架构返回下载文件列表
function getFilesForArchitecture(arch) {
  const isArm = ['arm', 'arm64', 'aarch64'].includes(arch);
  return [
    { fileName: "web", fileUrl: isArm ? "https://arm64.ssss.nyc.mn/web" : "https://amd64.ssss.nyc.mn/web" },
    { fileName: "bot", fileUrl: isArm ? "https://arm64.ssss.nyc.mn/2go" : "https://amd64.ssss.nyc.mn/2go" }
  ];
}

// 下载文件
function downloadFile(fileName, fileUrl) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(FILE_PATH, fileName);
    const writer = fs.createWriteStream(filePath);
    axios({ method: 'get', url: fileUrl, responseType: 'stream' })
      .then(response => {
        response.data.pipe(writer);
        writer.on('finish', () => { writer.close(); resolve(fileName); });
        writer.on('error', err => { fs.unlink(filePath, () => {}); reject(err); });
      })
      .catch(err => reject(err));
  });
}

// 下载并运行依赖
async function downloadFilesAndRun() {
  const arch = os.arch();
  const files = getFilesForArchitecture(arch);
  for (const f of files) {
    try {
      await downloadFile(f.fileName, f.fileUrl);
      fs.chmodSync(path.join(FILE_PATH, f.fileName), 0o775);
    } catch (err) {
      console.error(`Download ${f.fileName} failed:`, err.message);
    }
  }

  // 运行 xr-ay
  const cmdWeb = `nohup ${FILE_PATH}/web >/dev/null 2>&1 &`;
  try { await exec(cmdWeb); console.log('web is running'); } 
  catch (err) { console.error('web running error:', err.message); }

  // 运行临时 Argo 隧道
  const cmdBot = `nohup ${FILE_PATH}/bot --url http://localhost:3000 >/dev/null 2>&1 &`;
  try { await exec(cmdBot); console.log('bot is running (temporary Argo tunnel)'); } 
  catch (err) { console.error('bot running error:', err.message); }
}

// 提取 Argo 临时域名并生成订阅
async function extractDomains() {
  const bootLog = path.join(FILE_PATH, 'boot.log');
  await new Promise(r => setTimeout(r, 3000)); // 等待隧道启动
  let argoDomain = '';
  if (fs.existsSync(bootLog)) {
    const content = fs.readFileSync(bootLog, 'utf-8');
    const match = content.match(/https?:\/\/([^ ]*trycloudflare\.com)/);
    if (match) argoDomain = match[1];
  }

  if (!argoDomain) {
    console.log('ArgoDomain not found yet');
    return;
  }

  const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless-argo%3Fed%3D2560#${NAME}
vmess://${Buffer.from(JSON.stringify({v: '2', ps: NAME, add: CFIP, port: CFPORT, id: UUID, net:'ws', host: argoDomain, path:'/vmess-argo?ed=2560', tls:'tls'})).toString('base64')}
trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}
  `;

  fs.writeFileSync(path.join(FILE_PATH, 'sub.txt'), Buffer.from(subTxt).toString('base64'));
  console.log(`${FILE_PATH}/sub.txt saved`);

  // 提供 HTTP 访问
  app.get(`/${SUB_PATH}`, (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(Buffer.from(subTxt).toString('base64'));
  });
}

// 自动访问 PROJECT_URL
async function AddVisitTask() {
  if (!AUTO_ACCESS || !PROJECT_URL) return;
  try { await axios.post('https://oooo.serv00.net/add-url', { url: PROJECT_URL }); console.log('automatic access added'); }
  catch (err) { console.error('AddVisitTask failed:', err.message); }
}

// 启动服务
async function startserver() {
  await downloadFilesAndRun();
  await extractDomains();
  await AddVisitTask();
}

startserver();

app.listen(PORT, () => console.log(`HTTP server running on port:${PORT}!`));
