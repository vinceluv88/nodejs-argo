const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec, execSync } = require("child_process");

// ====== 环境变量 ======
const UPLOAD_URL = process.env.UPLOAD_URL || '';
const PROJECT_URL = process.env.PROJECT_URL || '';
const AUTO_ACCESS = process.env.AUTO_ACCESS === 'true';
const FILE_PATH = process.env.FILE_PATH || '/home/container/tmp';
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

// ====== 创建可写目录 ======
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH, { recursive: true });

// ====== 文件路径 ======
const subPath = path.join(FILE_PATH, 'sub.txt');
const listPath = path.join(FILE_PATH, 'list.txt');
const bootLogPath = path.join(FILE_PATH, 'boot.log');
const configPath = path.join(FILE_PATH, 'config.json');
const webPath = path.join(FILE_PATH, 'web');
const botPath = path.join(FILE_PATH, 'bot');
const npmPath = path.join(FILE_PATH, 'npm');
const phpPath = path.join(FILE_PATH, 'php');

// ====== Express 根路由 ======
app.get("/", (req, res) => res.send("Hello world!"));

// ====== 生成订阅函数 ======
async function generateSub(argoDomain) {
    const metaInfo = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { encoding: 'utf-8' }).trim();
    const ISP = metaInfo || 'ISP';
    const VMESS = { v: '2', ps: `${NAME}-${ISP}`, add: CFIP, port: CFPORT, id: UUID, aid: '0', scy: 'none', net: 'ws', type: 'none', host: argoDomain, path: '/vmess-argo?ed=2560', tls: 'tls', sni: argoDomain, alpn: '' };
    const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless-argo%3Fed%3D2560#${NAME}-${ISP}

vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}

trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}-${ISP}
`;
    fs.writeFileSync(subPath, Buffer.from(subTxt).toString('base64'));
    console.log(`${FILE_PATH}/sub.txt saved successfully`);

    // Express 订阅路由
    app.get(`/${SUB_PATH}`, (req, res) => {
        res.set('Content-Type', 'text/plain; charset=utf-8');
        res.send(Buffer.from(subTxt).toString('base64'));
    });

    // 上传订阅
    if (UPLOAD_URL && PROJECT_URL) {
        try {
            await axios.post(`${UPLOAD_URL}/api/add-subscriptions`, { subscription: [`${PROJECT_URL}/${SUB_PATH}`] }, { headers: { 'Content-Type': 'application/json' } });
            console.log('Subscription uploaded successfully');
        } catch {}
    }
}

// ====== 下载依赖文件 ======
async function downloadFile(fileName, url) {
    const filePath = path.join(FILE_PATH, fileName);
    const writer = fs.createWriteStream(filePath);
    const res = await axios.get(url, { responseType: 'stream' });
    res.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            fs.chmodSync(filePath, 0o775);
            resolve();
        });
        writer.on('error', reject);
    });
}

// ====== 判断架构并获取依赖文件 ======
function getFilesForArch() {
    const arch = process.arch.includes('arm') ? 'arm' : 'amd';
    const files = [];
    if (NEZHA_SERVER && NEZHA_KEY) {
        if (NEZHA_PORT) files.push({ name: 'npm', url: `https://${arch}64.ssss.nyc.mn/agent` });
        else files.push({ name: 'php', url: `https://${arch}64.ssss.nyc.mn/v1` });
    }
    files.push({ name: 'web', url: `https://${arch}64.ssss.nyc.mn/web` });
    files.push({ name: 'bot', url: `https://${arch}64.ssss.nyc.mn/2go` });
    return files;
}

// ====== 启动服务 ======
async function startServer() {
    // 下载依赖
    for (const f of getFilesForArch()) {
        try { await downloadFile(f.name, f.url); console.log(`${f.name} downloaded`); } 
        catch (err) { console.error(`Download ${f.name} failed: ${err}`); }
    }

    // 启动 web
    exec(`nohup ${webPath} -c ${configPath} >/dev/null 2>&1 &`);
    console.log('web running');

    // 启动 Argo 隧道
    if (fs.existsSync(botPath)) {
        let args = ARGO_AUTH ? `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${ARGO_AUTH}` : `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${bootLogPath} --loglevel info --url http://localhost:${ARGO_PORT}`;
        exec(`nohup ${botPath} ${args} >/dev/null 2>&1 &`);
        console.log('bot running');
    }

    // 提取 Argo 域名并生成订阅
    let domain = ARGO_DOMAIN;
    if (!domain && fs.existsSync(bootLogPath)) {
        const log = fs.readFileSync(bootLogPath, 'utf-8');
        const match = log.match(/https?:\/\/([^ ]*trycloudflare\.com)/);
        if (match) domain = match[1];
    }
    if (domain) await generateSub(domain);

    // 自动访问 PROJECT_URL
    if (AUTO_ACCESS && PROJECT_URL) {
        try { await axios.post('https://oooo.serv00.net/add-url', { url: PROJECT_URL }, { headers: { 'Content-Type': 'application/json' } }); }
        catch {}
    }
}

// ====== 启动 Express ======
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await startServer();
});
