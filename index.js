const express = require("express");
const app = express();
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');

// ========== 配置 ========== //
const UPLOAD_URL = process.env.UPLOAD_URL || '';
const PROJECT_URL = process.env.PROJECT_URL || '';
const AUTO_ACCESS = process.env.AUTO_ACCESS || false;
const FILE_PATH = process.env.FILE_PATH || './tmp';
const SUB_PATH = process.env.SUB_PATH || 'sub';
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const UUID = process.env.UUID || '9afd1229-b893-40c1-84dd-51e7ce204913';
const NEZHA_SERVER = process.env.NEZHA_SERVER || '';
const NEZHA_PORT = process.env.NEZHA_PORT || '';
const NEZHA_KEY = process.env.NEZHA_KEY || '';
const ARGO_PORT = process.env.ARGO_PORT || 8001;
const CFIP = process.env.CFIP || 'www.visa.com.sg';
const CFPORT = process.env.CFPORT || 443;
const NAME = process.env.NAME || 'Vls';

// ========== 创建文件夹 ========== //
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH);

// 文件路径
const npmPath = path.join(FILE_PATH, 'npm');
const phpPath = path.join(FILE_PATH, 'php');
const webPath = path.join(FILE_PATH, 'web');
const botPath = path.join(FILE_PATH, 'bot');
const subPath = path.join(FILE_PATH, 'sub.txt');
const listPath = path.join(FILE_PATH, 'list.txt');
const bootLogPath = path.join(FILE_PATH, 'boot.log');
const configPath = path.join(FILE_PATH, 'config.json');

// ========== 清理历史文件 ========== //
function cleanupOldFiles() {
  const filesToDelete = ['web', 'bot', 'npm', 'php', 'sub.txt', 'boot.log'];
  filesToDelete.forEach(f => {
    const p = path.join(FILE_PATH, f);
    fs.unlink(p, () => {});
  });
}

// ========== 根路由 ========== //
app.get("/", (req, res) => res.send("Hello world!"));

// ========== XR-AY 配置文件 ========== //
const config = {
  log: { access: '/dev/null', error: '/dev/null', loglevel: 'none' },
  inbounds: [
    { port: ARGO_PORT, protocol: 'vless', settings: { clients: [{ id: UUID, flow: 'xtls-rprx-vision' }], decryption: 'none', fallbacks: [{ dest: 3001 }, { path: "/vless-argo", dest: 3002 }, { path: "/vmess-argo", dest: 3003 }, { path: "/trojan-argo", dest: 3004 }] }, streamSettings: { network: 'tcp' } },
    { port: 3001, listen: "127.0.0.1", protocol: "vless", settings: { clients: [{ id: UUID }], decryption: "none" }, streamSettings: { network: "tcp", security: "none" } },
    { port: 3002, listen: "127.0.0.1", protocol: "vless", settings: { clients: [{ id: UUID, level: 0 }], decryption: "none" }, streamSettings: { network: "ws", security: "none", wsSettings: { path: "/vless-argo" } }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"], metadataOnly: false } },
    { port: 3003, listen: "127.0.0.1", protocol: "vmess", settings: { clients: [{ id: UUID, alterId: 0 }] }, streamSettings: { network: "ws", wsSettings: { path: "/vmess-argo" } }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"], metadataOnly: false } },
    { port: 3004, listen: "127.0.0.1", protocol: "trojan", settings: { clients: [{ password: UUID }] }, streamSettings: { network: "ws", security: "none", wsSettings: { path: "/trojan-argo" } }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"], metadataOnly: false } },
  ],
  dns: { servers: ["https+local://8.8.8.8/dns-query"] },
  outbounds: [ { protocol: "freedom", tag: "direct" }, { protocol: "blackhole", tag: "block" } ]
};
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// ========== 系统架构 ========== //
function getSystemArchitecture() {
  const arch = os.arch();
  return (arch === 'arm' || arch === 'arm64' || arch === 'aarch64') ? 'arm' : 'amd';
}

// ========== 下载文件 ========== //
function downloadFile(fileName, fileUrl) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(FILE_PATH, fileName);
    const writer = fs.createWriteStream(filePath);

    axios({ method: 'get', url: fileUrl, responseType: 'stream' })
      .then(res => {
        res.data.pipe(writer);
        writer.on('finish', () => { writer.close(); resolve(fileName); });
        writer.on('error', err => { fs.unlink(filePath, () => {}); reject(err); });
      }).catch(reject);
  });
}

function getFilesForArchitecture(arch) {
  let files = arch === 'arm' ? 
    [{ fileName: "web", fileUrl: "https://arm64.ssss.nyc.mn/web" }, { fileName: "bot", fileUrl: "https://arm64.ssss.nyc.mn/2go" }] :
    [{ fileName: "web", fileUrl: "https://amd64.ssss.nyc.mn/web" }, { fileName: "bot", fileUrl: "https://amd64.ssss.nyc.mn/2go" }];

  if (NEZHA_SERVER && NEZHA_KEY) {
    if (NEZHA_PORT) {
      files.unshift({ fileName: "npm", fileUrl: arch === 'arm' ? "https://arm64.ssss.nyc.mn/agent" : "https://amd64.ssss.nyc.mn/agent" });
    } else {
      files.unshift({ fileName: "php", fileUrl: arch === 'arm' ? "https://arm64.ssss.nyc.mn/v1" : "https://amd64.ssss.nyc.mn/v1" });
    }
  }

  return files;
}

// ========== 下载并运行依赖 ========== //
async function downloadFilesAndRun() {
  const arch = getSystemArchitecture();
  const files = getFilesForArchitecture(arch);
  try {
    await Promise.all(files.map(f => downloadFile(f.fileName, f.fileUrl)));
    console.log('All files downloaded');
  } catch (err) {
    console.error('Download error:', err);
    return;
  }

  // 授权
  const filesToAuth = NEZHA_PORT ? ['./npm','./web','./bot'] : ['./php','./web','./bot'];
  filesToAuth.forEach(f => {
    const fp = path.join(FILE_PATH, f);
    if (fs.existsSync(fp)) fs.chmodSync(fp, 0o775);
  });

  // 运行 web
  exec(`${webPath} -c ${configPath} >/dev/null 2>&1 &`).catch(console.error);

  // 运行 bot (临时 Argo 隧道)
  const args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${bootLogPath} --loglevel info --url http://localhost:${ARGO_PORT}`;
  exec(`${botPath} ${args} >/dev/null 2>&1 &`).catch(console.error);
}

// ========== 自动提取临时隧道 ========== //
async function extractDomains() {
  try {
    if (fs.existsSync(bootLogPath)) {
      const content = fs.readFileSync(bootLogPath, 'utf-8');
      const match = content.match(/https?:\/\/([^ ]*trycloudflare\.com)/);
      if (match) return generateLinks(match[1]);
    }
    console.log('Waiting bot to create Argo domain...');
    await new Promise(r => setTimeout(r, 3000));
    await extractDomains();
  } catch (err) { console.error(err); }
}

// ========== 生成 Base64 节点 ========== //
async function generateLinks(argoDomain) {
  const ISP = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { encoding: 'utf-8' }).trim();

  const VMESS = { v:'2', ps:`${NAME}-${ISP}`, add:CFIP, port:CFPORT, id:UUID, aid:'0', scy:'none', net:'ws', type:'none', host:argoDomain, path:'/vmess-argo?ed=2560', tls:'tls', sni:argoDomain, alpn:'' };

  const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless-argo%3Fed%3D2560#${NAME}-${ISP}

vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}

trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}-${ISP}
`;

  fs.writeFileSync(subPath, Buffer.from(subTxt).toString('base64'));
  app.get(`/${SUB_PATH}`, (req, res) => {
    res.set('Content-Type','text/plain; charset=utf-8');
    res.send(Buffer.from(subTxt).toString('base64'));
  });
  console.log(`${subPath} saved`);
}

// ========== 启动流程 ========== //
async function startserver() {
  cleanupOldFiles();
  await downloadFilesAndRun();
  await extractDomains();
}
startserver();

app.listen(PORT, () => console.log(`http server is running on port:${PORT}!`));
