const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = '/tmp/nodejs-argo'; // 可写目录
const SUB_PATH = 'sub';
const UUID = '9afd1229-b893-40c1-84dd-51e7ce204913';
const CFIP = 'www.visa.com.sg';
const CFPORT = 443;
const NAME = 'Vls';

// 创建运行目录
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH, { recursive: true });

// 生成订阅内容
function generateSub(argoDomain) {
    const VMESS = { v: '2', ps: `${NAME}`, add: CFIP, port: CFPORT, id: UUID, aid: '0', scy: 'none', net: 'ws', type: 'none', host: argoDomain, path: '/vmess-argo?ed=2560', tls: 'tls', sni: argoDomain };
    const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless-argo%3Fed%3D2560#${NAME}

vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}

trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}
    `.trim();
    fs.writeFileSync(path.join(FILE_PATH, 'sub.txt'), Buffer.from(subTxt).toString('base64'));
    return subTxt;
}

// 申请临时 Argo 隧道
async function getArgoDomain() {
    try {
        const { data } = await axios.get('https://fscarmen.now.sh'); // 临时域名获取服务
        return data.domain || 'example.trycloudflare.com';
    } catch (e) {
        console.error('临时 Argo 隧道申请失败:', e.message);
        return 'example.trycloudflare.com';
    }
}

// /sub 路由
app.get(`/${SUB_PATH}`, async (req, res) => {
    const argoDomain = await getArgoDomain();
    const encoded = Buffer.from(generateSub(argoDomain)).toString('base64');
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(encoded);
});

// 根路由
app.get('/', (req, res) => res.send('Hello World!'));

// 启动 HTTP Server
app.listen(PORT, () => console.log(`HTTP server running on port:${PORT}!`));
