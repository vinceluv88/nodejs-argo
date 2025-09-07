const express = require("express");
const app = express();
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');

const UPLOAD_URL = process.env.UPLOAD_URL || '';
const PROJECT_URL = process.env.PROJECT_URL || '';
const AUTO_ACCESS = process.env.AUTO_ACCESS || false;
const FILE_PATH = process.env.FILE_PATH || '/home/container/tmp';  // Leapcell 可写目录
const SUB_PATH = process.env.SUB_PATH || 'sub';
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const UUID = process.env.UUID || '9afd1229-b893-40c1-84dd-51e7ce204913';
const NEZHA_SERVER = process.env.NEZHA_SERVER || '';
const NEZHA_PORT = process.env.NEZHA_PORT || '';
const NEZHA_KEY = process.env.NEZHA_KEY || '';
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || '';
const ARGO_AUTH = process.env.ARGO_AUTH || '';
const ARGO_PORT = process.env.ARGO_PORT || 8001;
const CFIP = process.env.CFIP || 'www.visa.com.sg';
const CFPORT = process.env.CFPORT || 443;
const NAME = process.env.NAME || 'Vls';

// 确保目录存在
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH, { recursive: true });

// 文件路径
const npmPath = path.join(FILE_PATH, 'npm');
const phpPath = path.join(FILE_PATH, 'php');
const webPath = path.join(FILE_PATH, 'web');
const botPath = path.join(FILE_PATH, 'bot');
const subPath = path.join(FILE_PATH, 'sub.txt');
const listPath = path.join(FILE_PATH, 'list.txt');
const bootLogPath = path.join(FILE_PATH, 'boot.log');
const configPath = path.join(FILE_PATH, 'config.json');

// 清理历史文件
function cleanupOldFiles() {
  [webPath, botPath, npmPath, phpPath, subPath, bootLogPath].forEach(file => {
    if (fs.existsSync(file)) fs.unlink(file, () => {});
  });
}

// 根路由
app.get("/", (req, res) => res.send("Hello world!"));

// 写 config.json
const config = {
  log: { access: '/dev/null', error: '/dev/null', loglevel: 'none' },
  inbounds: [
    { port: ARGO_PORT, protocol: 'vless', settings: { clients: [{ id: UUID, flow: 'xtls-rprx-vision' }], decryption: 'none' }, streamSettings: { network: 'tcp' } }
  ],
  outbounds: [{ protocol: "freedom", tag: "direct" }, { protocol: "blackhole", tag: "block" }]
};
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// 系统架构
function getSystemArchitecture() {
  const arch = os.arch();
  return (arch === 'arm' || arch === 'arm64' || arch === 'aarch64') ? 'arm' : 'amd';
}

// 下载文件
function downloadFile(fileName, fileUrl) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(FILE_PATH, fileName);
    const writer = fs.createWriteStream(filePath);
    axios.get(fileUrl, { responseType: 'stream' })
      .then(response => {
        response.data.pipe(writer);
        writer.on('finish', () => { writer.close(); resolve(filePath); });
        writer.on('error', err => { fs.unlink(filePath, () => {}); reject(err); });
      })
      .catch(err => reject(err));
  });
}

// 根据架构获取下载列表
function getFilesForArchitecture(arch) {
  const files = [];
  if (NEZHA_SERVER && NEZHA_KEY) {
    if (NEZHA_PORT) {
      const npmUrl = arch === 'arm' ? "https://arm64.ssss.nyc.mn/agent" : "https://amd64.ssss.nyc.mn/agent";
      files.push({ fileName: 'npm', fileUrl: npmUrl });
    } else {
      const phpUrl = arch === 'arm' ? "https://arm64.ssss.nyc.mn/v1" : "https://amd64.ssss.nyc.mn/v1";
      files.push({ fileName: 'php', fileUrl: phpUrl });
    }
  }
  if (arch === 'arm') {
    files.push({ fileName: 'web', fileUrl: 'https://arm64.ssss.nyc.mn/web' });
    files.push({ fileName: 'bot', fileUrl: 'https://arm64.ssss.nyc.mn/2go' });
  } else {
    files.push({ fileName: 'web', fileUrl: 'https://amd64.ssss.nyc.mn/web' });
    files.push({ fileName: 'bot', fileUrl: 'https://amd64.ssss.nyc.mn/2go' });
  }
  return files;
}

// 下载并运行依赖
async function downloadFilesAndRun() {
  const arch = getSystemArchitecture();
  const files = getFilesForArchitecture(arch);

  for (const file of files) {
    try {
      await downloadFile(file.fileName, file.fileUrl);
      fs.chmodSync(path.join(FILE_PATH, file.fileName), 0o775);
      console.log(`${file.fileName} ready`);
    } catch (err) {
      console.error(`Failed to download ${file.fileName}:`, err);
    }
  }

  // 启动 NEZHA
  if (NEZHA_SERVER && NEZHA_KEY) {
    if (NEZHA_PORT) {
      const tlsPorts = ['443', '8443', '2096', '2087', '2083', '2053'];
      const tlsFlag = tlsPorts.includes(NEZHA_PORT) ? '--tls' : '';
      await exec(`nohup ${npmPath} -s ${NEZHA_SERVER}:${NEZHA_PORT} -p ${NEZHA_KEY} ${tlsFlag} >/dev/null 2>&1 &`).catch(console.error);
      console.log('npm is running');
    } else {
      const configYaml = `client_secret: ${NEZHA_KEY}\nserver: ${NEZHA_SERVER}\nuuid: ${UUID}\n`;
      fs.writeFileSync(path.join(FILE_PATH, 'config.yaml'), configYaml);
      await exec(`nohup ${phpPath} -c ${FILE_PATH}/config.yaml >/dev/null 2>&1 &`).catch(console.error);
      console.log('php is running');
    }
  }

  // 启动 web
  await exec(`nohup ${webPath} -c ${configPath} >/dev/null 2>&1 &`).catch(console.error);
  console.log('web is running');

  // 启动 bot
  if (fs.existsSync(botPath)) {
    await exec(`nohup ${botPath} >/dev/null 2>&1 &`).catch(console.error);
    console.log('bot is running');
  }
}

// 生成 Argo 隧道配置
function argoType() {
  if (!ARGO_AUTH || !ARGO_DOMAIN) return;
  if (ARGO_AUTH.includes('TunnelSecret')) {
    fs.writeFileSync(path.join(FILE_PATH, 'tunnel.json'), ARGO_AUTH);
    const tunnelYaml = `
tunnel: ${ARGO_AUTH.split('"')[11]}
credentials-file: ${path.join(FILE_PATH, 'tunnel.json')}
protocol: http2

ingress:
  - hostname: ${ARGO_DOMAIN}
    service: http://localhost:${ARGO_PORT}
    originRequest:
      noTLSVerify: true
  - service: http_status:404
`;
    fs.writeFileSync(path.join(FILE_PATH, 'tunnel.yml'), tunnelYaml);
  }
}
argoType();

// 自动生成订阅
async function extractDomains() {
  let argoDomain;
  if (ARGO_AUTH && ARGO_DOMAIN) {
    argoDomain = ARGO_DOMAIN;
  } else {
    try {
      const bootLog = fs.readFileSync(bootLogPath, 'utf-8');
      const match = bootLog.match(/https?:\/\/([^ ]*trycloudflare\.com)/);
      if (match) argoDomain = match[1];
    } catch {}
  }

  if (!argoDomain) return;

  const metaInfo = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { encoding: 'utf-8' }).trim();
  const ISP = metaInfo;
  const VMESS = { v: '2', ps: `${NAME}-${ISP}`, add: CFIP, port: CFPORT, id: UUID, aid: '0', scy: 'none', net: 'ws', type: 'none', host: argoDomain, path: '/vmess-argo?ed=2560', tls: 'tls', sni: argoDomain };
  const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless-argo%3Fed%3D2560#${NAME}-${ISP}

vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}

trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}-${ISP}
`;
  fs.writeFileSync(subPath, Buffer.from(subTxt).toString('base64'));

  // Express 提供 /sub 路由
  app.get(`/${SUB_PATH}`, (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(Buffer.from(subTxt).toString('base64'));
  });
}

// 自动上传节点
async function uploadNodes() {
  if (!UPLOAD_URL) return;
  if (!fs.existsSync(listPath)) return;
  const content = fs.readFileSync(listPath, 'utf-8');
  const nodes = content.split('\n').filter(l => /(vless|vmess|trojan|hysteria2|tuic):\/\//.test(l));
  if (!nodes.length) return;
  try { await axios.post(`${UPLOAD_URL}/api/add-nodes`, JSON.stringify({ nodes }), { headers: { 'Content-Type': 'application/json' } }); } catch {}
}

// 自动访问 URL
async function AddVisitTask() {
  if (!AUTO_ACCESS || !PROJECT_URL) return;
  try { await axios.post('https://oooo.serv00.net/add-url', { url: PROJECT_URL }, { headers: { 'Content-Type': 'application/json' } }); } catch {}
}

// 启动服务
async function startServer() {
  cleanupOldFiles();
  await downloadFilesAndRun();
  await extractDomains();
  await uploadNodes();
  await AddVisitTask();
}
startServer();

// Express 启动
app.listen(PORT, () => console.log(`http server running on port ${PORT}`));
