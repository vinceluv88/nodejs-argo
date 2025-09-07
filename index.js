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
const FILE_PATH = process.env.FILE_PATH || './tmp';
const SUB_PATH = process.env.SUB_PATH || 'sub';
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const UUID = process.env.UUID || '15436478-8eea-47a3-93d4-3a92b6a6601f';
const NEZHA_SERVER = process.env.NEZHA_SERVER || '';
const NEZHA_PORT = process.env.NEZHA_PORT || '';
const NEZHA_KEY = process.env.NEZHA_KEY || '';

// ---- 临时隧道配置 ----
const ARGO_DOMAIN = 'temp'; // 临时域名占位
const ARGO_AUTH = '';       // 空字符串启用临时隧道
const ARGO_PORT = process.env.ARGO_PORT || 8001;
const CFIP = process.env.CFIP || 'www.visa.com.sg';
const CFPORT = process.env.CFPORT || 443;
const NAME = process.env.NAME || 'Vls';

// 创建运行文件夹
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH);

// 省略中间其他文件/依赖下载逻辑，保持不变
// ... (保留 deleteNodes, cleanupOldFiles, getSystemArchitecture, downloadFilesAndRun 等)

// ---- 修改 argoType() ----
function argoType() {
    console.log("Using temporary Argo tunnel (quick tunnel)");
    // 临时隧道不生成 tunnel.yml，不需要 ARGO_AUTH
}

// 提取临时隧道域名
async function extractDomains() {
    let argoDomain;
    try {
        const fileContent = fs.readFileSync(path.join(FILE_PATH, 'boot.log'), 'utf-8');
        const lines = fileContent.split('\n');
        const argoDomains = [];
        lines.forEach((line) => {
            const domainMatch = line.match(/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
            if (domainMatch) argoDomains.push(domainMatch[1]);
        });
        if (argoDomains.length > 0) {
            argoDomain = argoDomains[0];
            console.log('Temporary ArgoDomain:', argoDomain);
            await generateLinks(argoDomain);
        } else {
            console.log('ArgoDomain not found, re-running bot to obtain temporary domain');
            fs.unlinkSync(path.join(FILE_PATH, 'boot.log'));
            async function killBotProcess() {
                try { await exec('pkill -f "[b]ot" > /dev/null 2>&1'); } catch {}
            }
            await killBotProcess();
            await new Promise(resolve => setTimeout(resolve, 3000));
            const args = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${FILE_PATH}/boot.log --loglevel info --url http://localhost:${ARGO_PORT}`;
            try {
                await exec(`nohup ${path.join(FILE_PATH, 'bot')} ${args} >/dev/null 2>&1 &`);
                console.log('bot is running.');
                await new Promise(resolve => setTimeout(resolve, 3000));
                await extractDomains(); // 递归提取临时域名
            } catch (error) {
                console.error(`Error executing bot command: ${error}`);
            }
        }
    } catch (error) {
        console.error('Error reading boot.log:', error);
    }

    async function generateLinks(argoDomain) {
        const metaInfo = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { encoding: 'utf-8' });
        const ISP = metaInfo.trim();
        return new Promise(resolve => {
            setTimeout(() => {
                const VMESS = { v: '2', ps: `${NAME}-${ISP}`, add: CFIP, port: CFPORT, id: UUID, aid: '0', scy: 'none', net: 'ws', type: 'none', host: argoDomain, path: '/vmess-argo?ed=2560', tls: 'tls', sni: argoDomain, alpn: '' };
                const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless-argo%3Fed%3D2560#${NAME}-${ISP}

vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}

trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}-${ISP}
                `;
                console.log(Buffer.from(subTxt).toString('base64'));
                fs.writeFileSync(path.join(FILE_PATH, 'sub.txt'), Buffer.from(subTxt).toString('base64'));
                app.get(`/${SUB_PATH}`, (req, res) => {
                    const encodedContent = Buffer.from(subTxt).toString('base64');
                    res.set('Content-Type', 'text/plain; charset=utf-8');
                    res.send(encodedContent);
                });
                resolve(subTxt);
            }, 2000);
        });
    }
}

// ---- 启动服务 ----
async function startserver() {
    // 保留原有逻辑
    // deleteNodes();
    // cleanupOldFiles();
    await downloadFilesAndRun();
    argoType();       // 调用修改后的临时隧道函数
    await extractDomains();
    // AddVisitTask();
}
startserver();

app.get("/", (req, res) => res.send("Hello world!"));
app.listen(PORT, () => console.log(`HTTP server running on port:${PORT}!`));
