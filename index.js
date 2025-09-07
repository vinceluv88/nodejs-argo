const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');

const FILE_PATH = process.env.FILE_PATH || '/home/container/tmp';
const SUB_PATH = process.env.SUB_PATH || 'sub';
const PORT = process.env.SERVER_PORT || 3000;
const UUID = process.env.UUID || '15436478-8eea-47a3-93d4-3a92b6a6601f';
const NAME = process.env.NAME || 'Vls';
const CFIP = process.env.CFIP || 'www.visa.com.sg';
const CFPORT = process.env.CFPORT || 443;
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || ''; // 可填固定域名

// 确保运行目录存在
if (!fs.existsSync(FILE_PATH)) fs.mkdirSync(FILE_PATH, { recursive: true });

// 根路由
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// 生成节点
function generateSub() {
    const ISP = "Leapcell"; // 简化，直接写ISP
    const VMESS = {
        v: '2',
        ps: `${NAME}-${ISP}`,
        add: CFIP,
        port: CFPORT,
        id: UUID,
        aid: '0',
        scy: 'none',
        net: 'ws',
        type: 'none',
        host: ARGO_DOMAIN || CFIP,
        path: '/vmess-argo?ed=2560',
        tls: 'tls',
        sni: ARGO_DOMAIN || CFIP,
        alpn: ''
    };

    const subTxt = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${ARGO_DOMAIN || CFIP}&type=ws&host=${ARGO_DOMAIN || CFIP}&path=%2Fvless-argo%3Fed%3D2560#${NAME}-${ISP}

vmess://${Buffer.from(JSON.stringify(VMESS)).toString('base64')}

trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${ARGO_DOMAIN || CFIP}&type=ws&host=${ARGO_DOMAIN || CFIP}&path=%2Ftrojan-argo%3Fed%3D2560#${NAME}-${ISP}
`;

    const subFilePath = path.join(FILE_PATH, 'sub.txt');
    fs.writeFileSync(subFilePath, Buffer.from(subTxt).toString('base64'));
    console.log(`${subFilePath} saved successfully`);
    return subTxt;
}

// /sub 路由返回 base64
app.get(`/${SUB_PATH}`, (req, res) => {
    const subTxt = generateSub();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(Buffer.from(subTxt).toString('base64'));
});

// 启动服务
app.listen(PORT, () => {
    console.log(`HTTP server is running on port ${PORT}!`);
});
