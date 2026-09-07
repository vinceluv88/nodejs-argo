<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="theme-color" content="#03050a">
<meta name="description" content="香港电台 Radio Hub">
<title>香港电台 · Radio Hub</title>

<style>
*{
  box-sizing:border-box;
  margin:0;
  padding:0
}

:root{
  --bg:#03050a;
  --panel:rgba(10,15,27,.78);
  --line:rgba(255,255,255,.08);
  --text:#f4f7ff;
  --muted:#8d99ae;
  --cyan:#52d9ff;
  --blue:#638cff;
  --pink:#ff4fd8;
  --green:#45f0a0;
  --yellow:#ffd76a;
}

html,body{
  width:100%;
  min-height:100%;
  background:var(--bg);
  color:var(--text);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "PingFang SC",
    "Microsoft YaHei",
    sans-serif;
}

body{
  overflow-x:hidden;
}

/* =========================================================
   星空背景
========================================================= */

.space{
  position:fixed;
  inset:0;
  overflow:hidden;
  z-index:0;
  pointer-events:none;

  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(64,103,255,.16),
      transparent 42%
    ),
    radial-gradient(
      circle at 90% 70%,
      rgba(255,0,204,.07),
      transparent 35%
    ),
    radial-gradient(
      circle at 10% 80%,
      rgba(0,205,255,.07),
      transparent 35%
    ),
    #03050a;
}

.space svg{
  width:100%;
  height:100%;
}

.star{
  fill:#fff;
  animation:twinkle 3s infinite alternate;
}

@keyframes twinkle{
  from{
    opacity:.12
  }

  to{
    opacity:.75
  }
}

.shooting{
  stroke:var(--cyan);
  stroke-width:1.2;
  stroke-linecap:round;
  opacity:0;

  animation:
    shoot 10s linear infinite;
}

@keyframes shoot{

  0%,70%{
    opacity:0;
    transform:translate(0,0)
  }

  73%{
    opacity:.8
  }

  84%{
    opacity:0;
    transform:translate(-220px,150px)
  }

  100%{
    opacity:0
  }

}

/* =========================================================
   主体
========================================================= */

.container{
  position:relative;
  z-index:2;

  width:min(1420px,94%);

  margin:auto;

  padding:
    30px
    0
    50px;
}

/* =========================================================
   HEADER
========================================================= */

header{
  display:flex;

  justify-content:space-between;
  align-items:center;

  gap:20px;

  margin-bottom:25px;
}

.brand{
  display:flex;
  align-items:center;

  gap:14px;
}

.brand-icon{
  width:48px;
  height:48px;

  flex:none;

  border-radius:15px;

  background:
    linear-gradient(
      135deg,
      #182b5f,
      #111728
    );

  border:
    1px solid
    rgba(104,220,255,.23);

  box-shadow:
    0 0 35px
    rgba(68,187,255,.12);

  display:grid;
  place-items:center;
}

.brand-icon svg{
  width:30px;
}

.brand h1{
  font-size:22px;

  letter-spacing:.5px;
}

.brand p{
  font-size:12px;

  color:var(--muted);

  margin-top:3px;
}

.clock{
  text-align:right;
}

.clock strong{
  font-size:20px;

  letter-spacing:1px;
}

.clock span{
  display:block;

  color:var(--muted);

  font-size:10px;

  margin-top:4px;
}

/* =========================================================
   通用卡片
========================================================= */

.card{
  background:
    linear-gradient(
      145deg,
      rgba(16,23,40,.84),
      rgba(5,9,18,.72)
    );

  border:
    1px solid
    var(--line);

  border-radius:24px;

  box-shadow:
    0 20px 70px
    rgba(0,0,0,.25),

    inset 0 1px
    rgba(255,255,255,.03);

  backdrop-filter:blur(16px);

  -webkit-backdrop-filter:blur(16px);
}

/* =========================================================
   LIVE RADIO
========================================================= */

.radio-section{
  margin-bottom:25px;
}

.section-title{
  margin:
    0
    2px
    13px;

  display:flex;

  justify-content:space-between;

  align-items:end;
}

.section-title strong{
  font-size:17px;
}

.section-title span{
  color:var(--muted);

  font-size:11px;
}

.radios{
  display:grid;

  grid-template-columns:
    repeat(3,minmax(0,1fr));

  gap:16px;

  align-items:stretch;
}

.radio{
  padding:20px;

  min-height:175px;

  height:100%;

  cursor:pointer;

  position:relative;

  overflow:hidden;

  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;

  display:flex;

  flex-direction:column;
}

.radio:hover{
  transform:translateY(-5px);

  border-color:
    rgba(96,210,255,.28);

  box-shadow:
    0 20px 50px
    rgba(0,0,0,.35);
}

.radio:after{
  content:"";

  position:absolute;

  width:130px;
  height:130px;

  right:-50px;
  bottom:-60px;

  border-radius:50%;

  background:
    rgba(73,200,255,.07);

  pointer-events:none;
}

.radio-logo{
  width:60px;
  height:60px;

  flex:none;

  border-radius:18px;

  display:grid;

  place-items:center;

  background:
    rgba(255,255,255,.035);

  border:
    1px solid
    rgba(255,255,255,.075);

  margin-bottom:17px;
}

.radio-logo svg{
  width:38px;
  height:38px;
}

.radio h3{
  font-size:16px;
}

.radio p{
  color:var(--muted);

  font-size:11px;

  margin-top:5px;

  line-height:1.55;
}

.radio-bottom{
  margin-top:auto;

  padding-top:15px;

  display:flex;

  align-items:center;

  justify-content:space-between;
}

.live{
  display:flex;

  align-items:center;

  gap:6px;

  font-size:10px;

  color:var(--green);
}

.live b{
  width:6px;
  height:6px;

  flex:none;

  border-radius:50%;

  background:var(--green);

  animation:
    blink 1.2s infinite;
}

@keyframes blink{

  50%{
    opacity:.25;
  }

}

.enter{
  color:var(--cyan);

  font-size:11px;
}

/* =========================================================
   HERO
========================================================= */

.hero{
  min-height:455px;

  display:grid;

  grid-template-columns:
    minmax(0,1fr)
    minmax(390px,1.35fr)
    minmax(0,1fr);

  align-items:stretch;

  gap:14px;

  padding:20px;

  overflow:hidden;

  position:relative;
}

.hero:before{
  content:"";

  position:absolute;

  width:550px;
  height:550px;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(57,169,255,.10),
      transparent 68%
    );

  pointer-events:none;
}

/* =========================================================
   WEATHER
========================================================= */

.weather-list{
  display:grid;

  grid-template-rows:
    repeat(2,minmax(0,1fr));

  gap:14px;

  min-width:0;
}

.weather{
  min-height:0;

  height:100%;

  padding:17px;

  border:
    1px solid
    rgba(255,255,255,.055);

  background:
    rgba(255,255,255,.022);

  border-radius:18px;

  display:flex;

  flex-direction:column;

  justify-content:center;
}

.weather-top{
  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:10px;
}

.city{
  font-size:14px;

  font-weight:600;
}

.weather-icon{
  width:48px;
  height:48px;

  flex:none;
}

.weather-main{
  display:flex;

  align-items:end;

  gap:10px;

  margin-top:7px;
}

.temp{
  font-size:32px;

  font-weight:700;
}

.weather-desc{
  font-size:11px;

  color:var(--muted);

  padding-bottom:5px;
}

.weather-info{
  display:flex;

  gap:14px;

  margin-top:9px;

  color:var(--muted);

  font-size:10px;
}

/* =========================================================
   3D 地球
========================================================= */

.globe-wrap{
  display:grid;

  place-items:center;

  position:relative;

  min-width:0;
}

.globe{
  width:min(430px,100%);

  aspect-ratio:1;

  position:relative;
}

.globe svg{
  width:100%;
  height:100%;

  overflow:visible;
}

.globe-core{
  fill:url(#earthGradient);

  stroke:
    rgba(105,215,255,.58);

  stroke-width:1;
}

.grid{
  fill:none;

  stroke:
    rgba(107,211,255,.18);

  stroke-width:.65;
}

.orbit{
  fill:none;

  stroke:
    rgba(94,217,255,.16);

  stroke-width:1;

  stroke-dasharray:5 8;

  animation:
    orbit 18s linear infinite;

  transform-origin:50% 50%;
}

@keyframes orbit{

  to{
    transform:rotate(360deg);
  }

}

.continent{
  fill:
    rgba(78,191,255,.17);

  stroke:
    rgba(93,216,255,.27);

  stroke-width:.7;
}

/* =========================================================
   香港 / 广州
========================================================= */

.pulse{
  fill:var(--pink);

  animation:
    pulse 1.8s infinite;
}

@keyframes pulse{

  0%{
    r:3;
    opacity:.9;
  }

  70%{
    r:13;
    opacity:0;
  }

  100%{
    r:13;
    opacity:0;
  }

}

.location{
  fill:var(--pink);

  stroke:white;

  stroke-width:1;
}

.gz-location{
  fill:var(--yellow);

  stroke:white;

  stroke-width:1;
}

/* =========================================================
   访客位置
========================================================= */

.visitor-pulse{
  fill:var(--cyan);

  animation:
    visitorPulse 1.8s infinite;
}

@keyframes visitorPulse{

  0%{
    r:3;
    opacity:1;
  }

  75%{
    r:17;
    opacity:0;
  }

  100%{
    r:17;
    opacity:0;
  }

}

.visitor-dot{
  fill:var(--cyan);

  stroke:white;

  stroke-width:1.2;
}

.visitor-line{
  stroke:var(--cyan);

  stroke-width:.8;

  stroke-dasharray:3 4;

  opacity:.75;
}

.globe-label{
  fill:#fff;

  font-size:8px;

  letter-spacing:.5px;
}

.visitor-label{
  fill:var(--cyan);

  font-size:8px;

  font-weight:600;
}

.globe-caption{
  position:absolute;

  bottom:6%;

  left:50%;

  transform:
    translateX(-50%);

  text-align:center;

  white-space:nowrap;
}

.globe-caption strong{
  font-size:13px;
}

.globe-caption span{
  display:block;

  color:var(--muted);

  font-size:10px;

  margin-top:3px;
}

/* =========================================================
   右侧信息
========================================================= */

.ip-panel{
  min-width:0;

  height:100%;

  display:grid;

  grid-template-rows:
    repeat(3,minmax(0,1fr));

  gap:14px;
}

.ip-card{
  min-height:0;

  height:100%;

  padding:17px;

  border:
    1px solid
    rgba(255,255,255,.055);

  background:
    rgba(255,255,255,.022);

  border-radius:18px;

  display:flex;

  flex-direction:column;

  justify-content:center;
}

.ip-head{
  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:10px;
}

.ip-title{
  font-size:12px;

  color:var(--muted);
}

.online{
  display:flex;

  align-items:center;

  gap:6px;

  font-size:10px;

  color:var(--green);
}

.online i{
  width:6px;
  height:6px;

  flex:none;

  border-radius:50%;

  background:var(--green);

  box-shadow:
    0 0 10px
    var(--green);
}

.ip-number{
  margin-top:9px;

  font-size:20px;

  font-weight:700;

  word-break:break-all;
}

.ip-location{
  margin-top:5px;

  color:var(--muted);

  font-size:11px;

  line-height:1.6;
}

.ip-coordinates{
  margin-top:8px;

  color:#5f718e;

  font-size:9px;
}

/* =========================================================
   NETWORK REGION
========================================================= */

.region-content{
  margin-top:10px;

  font-size:11px;

  line-height:1.75;

  color:var(--muted);
}

.region-content div{
  display:flex;

  justify-content:space-between;

  gap:10px;

  border-bottom:
    1px solid
    rgba(255,255,255,.035);

  padding:2px 0;
}

.region-content div:last-child{
  border-bottom:0;
}

.region-content b{
  color:#dbe6fa;

  font-weight:500;

  text-align:right;

  max-width:62%;

  overflow:hidden;

  text-overflow:ellipsis;

  white-space:nowrap;
}

/* =========================================================
   DEVICE
========================================================= */

.device-list{
  display:grid;

  gap:8px;

  margin-top:10px;
}

.device-row{
  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:12px;

  font-size:10px;
}

.device-row span:first-child{
  color:var(--muted);

  flex:none;
}

.device-row span:last-child{
  text-align:right;

  max-width:68%;

  overflow:hidden;

  text-overflow:ellipsis;

  white-space:nowrap;

  color:#dbe6fa;
}

/* =========================================================
   FOOTER
========================================================= */

footer{
  text-align:center;

  color:#566176;

  font-size:10px;

  margin-top:28px;
}

/* =========================================================
   平板
========================================================= */

@media(max-width:1100px){

  .hero{
    grid-template-columns:
      minmax(0,1fr)
      minmax(300px,1.1fr)
      minmax(0,1fr);

    gap:12px;
  }

  .globe{
    width:min(360px,100%);
  }

  .weather{
    padding:14px;
  }

  .ip-card{
    padding:14px;
  }

  .ip-number{
    font-size:17px;
  }

}

/* =========================================================
   900px 以下
========================================================= */

@media(max-width:900px){

  .hero{
    grid-template-columns:1fr;

    min-height:auto;

    padding:18px;
  }

  .globe-wrap{
    order:-1;
  }

  .globe{
    width:350px;

    max-width:100%;
  }

  .weather-list{
    grid-template-columns:
      repeat(2,minmax(0,1fr));

    grid-template-rows:none;
  }

  .ip-panel{
    grid-template-columns:
      repeat(3,minmax(0,1fr));

    grid-template-rows:none;

    height:auto;
  }

  .ip-card{
    min-height:175px;
  }

}

/* =========================================================
   手机
========================================================= */

@media(max-width:700px){

  .container{
    width:92%;

    padding-top:20px;
  }

  header{
    align-items:flex-start;
  }

  .clock{
    display:none;
  }

  .brand h1{
    font-size:19px;
  }

  .brand p{
    font-size:10px;
  }

  .section-title{
    align-items:center;
  }

  .section-title span{
    display:none;
  }

  .radios{
    grid-template-columns:1fr;
  }

  .radio{
    min-height:175px;
  }

  .weather-list{
    grid-template-columns:1fr;
  }

  .weather{
    min-height:150px;
  }

  .ip-panel{
    grid-template-columns:1fr;
  }

  .ip-card{
    min-height:150px;
  }

  .globe{
    width:330px;
  }

}

/* =========================================================
   页面密码保护
========================================================= */

#loginScreen{
  position:fixed;
  inset:0;

  z-index:99999;

  display:flex;

  align-items:center;
  justify-content:center;

  background:
    radial-gradient(
      circle at 50% 40%,
      rgba(82,217,255,.10),
      transparent 38%
    ),
    #03050a;
}

.login-box{
  width:min(380px,90%);

  padding:35px 30px;

  text-align:center;

  background:
    linear-gradient(
      145deg,
      rgba(16,23,40,.94),
      rgba(5,9,18,.94)
    );

  border:
    1px solid
    rgba(255,255,255,.10);

  border-radius:24px;

  box-shadow:
    0 25px 80px
    rgba(0,0,0,.65),

    inset 0 1px
    rgba(255,255,255,.04);

  backdrop-filter:blur(20px);

  -webkit-backdrop-filter:blur(20px);
}

.login-icon{
  width:64px;
  height:64px;

  margin:0 auto 18px;

  border-radius:20px;

  display:grid;

  place-items:center;

  background:
    linear-gradient(
      135deg,
      #182b5f,
      #111728
    );

  border:
    1px solid
    rgba(104,220,255,.23);

  box-shadow:
    0 0 35px
    rgba(68,187,255,.12);
}

.login-icon svg{
  width:38px;
  height:38px;
}

.login-box h2{
  font-size:21px;

  letter-spacing:1px;
}

.login-box p{
  margin-top:7px;

  color:var(--muted);

  font-size:11px;
}

.login-input{
  width:100%;

  margin-top:24px;

  padding:13px 15px;

  border-radius:11px;

  border:
    1px solid
    rgba(255,255,255,.10);

  outline:none;

  background:
    rgba(255,255,255,.04);

  color:#fff;

  font-size:13px;

  text-align:center;

  transition:
    border-color .2s ease,
    box-shadow .2s ease;
}

.login-input:focus{
  border-color:
    rgba(82,217,255,.5);

  box-shadow:
    0 0 20px
    rgba(82,217,255,.08);
}

.login-input::placeholder{
  color:#657188;
}

.login-button{
  width:100%;

  margin-top:12px;

  padding:13px;

  border:0;

  border-radius:11px;

  background:
    linear-gradient(
      135deg,
      #52d9ff,
      #638cff
    );

  color:#03050a;

  font-size:13px;

  font-weight:700;

  cursor:pointer;

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.login-button:hover{
  transform:translateY(-2px);

  box-shadow:
    0 8px 25px
    rgba(82,217,255,.20);
}

.login-error{
  display:none;

  margin-top:12px;

  color:#ff4f7b;

  font-size:11px;
}

@media(max-width:700px){

  .login-box{
    padding:30px 23px;
  }

}
</style>
</head>

<body>

<!-- =======================================================
     页面密码保护
======================================================= -->

<div id="loginScreen">

  <div class="login-box">

    <div class="login-icon">

      <svg
        viewBox="0 0 40 40"
        fill="none">

        <circle
          cx="20"
          cy="20"
          r="14"
          stroke="#52d9ff"
          stroke-width="1.5"
        />

        <path
          d="
            M13 20
            C13 16 16 13 20 13
            C24 13 27 16 27 20
            V25
            C27 28 24 30 20 30
            C16 30 13 28 13 25
            Z
          "
          stroke="#52d9ff"
          stroke-width="1.5"
        />

        <circle
          cx="20"
          cy="22"
          r="2.5"
          fill="#ff4fd8"
        />

      </svg>

    </div>

    <h2>
      RADIO HUB
    </h2>

    <p>
      香港电台 · Radio Hub
    </p>

    <input
      id="pagePassword"
      class="login-input"
      type="password"
      placeholder="请输入访问密码"
      autocomplete="off"
    >

    <button
      class="login-button"
      onclick="checkPagePassword()">

      ENTER RADIO HUB

    </button>

    <div
      id="loginError"
      class="login-error">

      密码错误，请重新输入

    </div>

  </div>

</div>


<!-- =======================================================
     星空
======================================================= -->

<div class="space">

<svg
  viewBox="0 0 1600 1000"
  preserveAspectRatio="xMidYMid slice">

  <defs>

    <radialGradient id="nebula">

      <stop
        offset="0"
        stop-color="#4f80ff"
        stop-opacity=".18"/>

      <stop
        offset="1"
        stop-color="#4f80ff"
        stop-opacity="0"/>

    </radialGradient>

  </defs>

  <circle
    cx="800"
    cy="0"
    r="600"
    fill="url(#nebula)"
  />

  <g id="stars"></g>

  <line
    class="shooting"
    x1="1300"
    y1="100"
    x2="1480"
    y2="20"
  />

  <line
    class="shooting"
    x1="400"
    y1="80"
    x2="560"
    y2="20"
    style="animation-delay:4s"
  />

</svg>

</div>


<div class="container">

<!-- =======================================================
     HEADER
======================================================= -->

<header>

  <div class="brand">

    <div class="brand-icon">

      <svg
        viewBox="0 0 40 40"
        fill="none">

        <circle
          cx="20"
          cy="20"
          r="14"
          stroke="#52d9ff"
          stroke-width="1.5"
        />

        <path
          d="
            M11 20h18
            M20 11c5 5 5 13 0 18
            M20 11c-5 5-5 13 0 18
          "
          stroke="#52d9ff"
          stroke-width="1"
        />

        <circle
          cx="20"
          cy="20"
          r="3"
          fill="#ff4fd8"
        />

      </svg>

    </div>

    <div>

      <h1>
        香港电台 · RADIO HUB
      </h1>

      <p>
        Hong Kong Radio Network · Live Portal
      </p>

    </div>

  </div>


  <div class="clock">

    <strong id="clock">
      --:--:--
    </strong>

    <span>
      HONG KONG · ASIA/HONG_KONG
    </span>

  </div>

</header>


<!-- =======================================================
     LIVE RADIO
======================================================= -->

<section class="radio-section">

  <div class="section-title">

    <strong>
      LIVE RADIO
    </strong>

    <span>
      选择电台开始收听
    </span>

  </div>


  <div class="radios">

    <!-- 第一位：香港电台 RTHK -->

    <div
      class="radio card"
      onclick="
        location.href='https://rthk.fucker.de5.net/'
      ">

      <div class="radio-logo">

        <svg viewBox="0 0 50 50">

          <path
            d="M13 13h24v24H13z"
            fill="none"
            stroke="#ff4fd8"
            stroke-width="2"
          />

          <path
            d="
              M18 30V20
              M25 30V16
              M32 30V23
            "
            stroke="#ff4fd8"
            stroke-width="3"
            stroke-linecap="round"
          />

        </svg>

      </div>

      <h3>
        香港电台 RTHK
      </h3>

      <p>
        Radio Television Hong Kong · 香港公共广播
      </p>

      <div class="radio-bottom">

        <span class="live">
          <b></b>
          LIVE RADIO
        </span>

        <span class="enter">
          ENTER →
        </span>

      </div>

    </div>


    <!-- 第二位：香港商业电台 -->

    <div
      class="radio card"
      onclick="
        location.href='https://881903.fucker.de5.net/'
      ">

      <div class="radio-logo">

        <svg viewBox="0 0 50 50">

          <circle
            cx="25"
            cy="25"
            r="19"
            fill="none"
            stroke="#ffd76a"
            stroke-width="2"
          />

          <path
            d="
              M17 19
              C32 13 37 24 27 28
              L18 31
              C30 27 37 35 29 38
            "
            fill="none"
            stroke="#ffd76a"
            stroke-width="2.4"
            stroke-linecap="round"
          />

        </svg>

      </div>

      <h3>
        香港商业电台
      </h3>

      <p>
        Commercial Radio · 雷霆881 · 叱咤903 · AM864
      </p>

      <div class="radio-bottom">

        <span class="live">
          <b></b>
          LIVE RADIO
        </span>

        <span class="enter">
          ENTER →
        </span>

      </div>

    </div>


    <!-- 第三位：香港新城电台 -->

    <div
      class="radio card"
      onclick="
        location.href='https://mbo.fucker.de5.net/'
      ">

      <div class="radio-logo">

        <svg viewBox="0 0 50 50">

          <circle
            cx="25"
            cy="25"
            r="19"
            fill="none"
            stroke="#52d9ff"
            stroke-width="2"
          />

          <path
            d="
              M15 30
              C15 21 35 21 35 30
            "
            fill="none"
            stroke="#52d9ff"
            stroke-width="2"
          />

          <circle
            cx="25"
            cy="30"
            r="4"
            fill="#ff4fd8"
          />

        </svg>

      </div>

      <h3>
        香港新城电台
      </h3>

      <p>
        Metro Radio · 新城知訊台 · 財經台 · Metro Plus
      </p>

      <div class="radio-bottom">

        <span class="live">
          <b></b>
          LIVE RADIO
        </span>

        <span class="enter">
          ENTER →

        </span>

      </div>

    </div>

  </div>

</section>


<!-- =======================================================
     HERO
======================================================= -->

<section class="hero card">


<!-- =====================================================
     WEATHER
===================================================== -->

<div class="weather-list">


  <!-- 香港 -->

  <div class="weather">

    <div class="weather-top">

      <span class="city">
        香港 · Hong Kong
      </span>

      <svg
        class="weather-icon"
        viewBox="0 0 64 64">

        <circle
          cx="31"
          cy="27"
          r="12"
          fill="#ffd76a"
        />

        <g
          stroke="#ffd76a"
          stroke-width="2"
          stroke-linecap="round">

          <path d="M31 7v6"/>
          <path d="M31 41v6"/>
          <path d="M11 27h6"/>
          <path d="M45 27h6"/>
          <path d="m17 13 4 4"/>
          <path d="m41 37 4 4"/>

        </g>

        <path
          d="
            M15 42
            C15 35 23 32 29 36
            C34 28 48 31 49 40
            C55 40 57 49 48 51
            H19
            C12 51 9 44 15 42Z
          "
          fill="#7c9cff"
        />

      </svg>

    </div>

    <div class="weather-main">

      <div
        class="temp"
        id="hkTemp">

        --°

      </div>

      <div
        class="weather-desc"
        id="hkWeather">

        获取天气中

      </div>

    </div>

    <div class="weather-info">

      <span>
        湿度
        <b id="hkHumidity">--</b>%
      </span>

      <span>
        风速
        <b id="hkWind">--</b>
        km/h
      </span>

    </div>

  </div>


  <!-- 广州 -->

  <div class="weather">

    <div class="weather-top">

      <span class="city">
        广州 · Guangzhou
      </span>

      <svg
        class="weather-icon"
        viewBox="0 0 64 64">

        <circle
          cx="31"
          cy="27"
          r="13"
          fill="#ffd76a"
        />

        <path
          d="
            M16 44
            C16 36 25 33 31 37
            C36 29 50 33 50 42
            C56 42 57 51 49 52
            H19
            C12 52 10 46 16 44Z
          "
          fill="#8da6ff"
        />

      </svg>

    </div>

    <div class="weather-main">

      <div
        class="temp"
        id="gzTemp">

        --°

      </div>

      <div
        class="weather-desc"
        id="gzWeather">

        获取天气中

      </div>

    </div>

    <div class="weather-info">

      <span>
        湿度
        <b id="gzHumidity">--</b>%
      </span>

      <span>
        风速
        <b id="gzWind">--</b>
        km/h
      </span>

    </div>

  </div>

</div>


<!-- =====================================================
     3D GLOBE
===================================================== -->

<div class="globe-wrap">

<div class="globe">

<svg viewBox="0 0 500 500">

<defs>

  <radialGradient
    id="earthGradient"
    cx="35%"
    cy="30%">

    <stop
      offset="0"
      stop-color="#214d72"/>

    <stop
      offset=".55"
      stop-color="#102c4b"/>

    <stop
      offset="1"
      stop-color="#050b15"/>

  </radialGradient>


  <clipPath id="earthClip">

    <circle
      cx="250"
      cy="250"
      r="170"/>

  </clipPath>

</defs>


<!-- 大气层 -->

<circle
  cx="250"
  cy="250"
  r="181"
  fill="none"
  stroke="rgba(78,205,255,.11)"
  stroke-width="8"
/>


<!-- 外轨道 -->

<circle
  cx="250"
  cy="250"
  r="190"
  class="orbit"
/>


<!-- 地球 -->

<circle
  cx="250"
  cy="250"
  r="170"
  class="globe-core"
/>


<g clip-path="url(#earthClip)">


  <!-- 纬线 -->

  <ellipse
    cx="250"
    cy="250"
    rx="170"
    ry="55"
    class="grid"
  />

  <ellipse
    cx="250"
    cy="250"
    rx="170"
    ry="110"
    class="grid"
  />

  <ellipse
    cx="250"
    cy="250"
    rx="170"
    ry="145"
    class="grid"
  />


  <!-- 经线 -->

  <ellipse
    cx="250"
    cy="250"
    rx="60"
    ry="170"
    class="grid"
  />

  <ellipse
    cx="250"
    cy="250"
    rx="115"
    ry="170"
    class="grid"
  />

  <ellipse
    cx="250"
    cy="250"
    rx="155"
    ry="170"
    class="grid"
  />


  <!-- 世界大陆示意 -->

  <path
    class="continent"
    d="
      M90 150
      C115 118 160 104 195 115
      L218 137
      207 166
      180 174
      165 201
      130 190
      104 174Z
    "
  />

  <path
    class="continent"
    d="
      M185 225
      C205 215 232 222 242 250
      L226 278
      220 326
      192 365
      171 337
      179 296
      160 266Z
    "
  />

  <path
    class="continent"
    d="
      M258 142
      C290 110 350 108 391 131
      L418 158
      400 179
      365 171
      347 191
      315 178
      284 190
      260 168Z
    "
  />

  <path
    class="continent"
    d="
      M330 208
      C367 190 415 211 429 247
      L409 276
      381 278
      368 315
      339 340
      319 309
      330 275
      311 247Z
    "
  />

  <path
    class="continent"
    d="
      M260 330
      C290 314 324 326 335 353
      L320 383
      282 390
      257 367Z
    "
  />

</g>


<!-- =====================================================
     香港
===================================================== -->

<line
  x1="349"
  y1="207"
  x2="402"
  y2="174"
  stroke="#52d9ff"
  stroke-width=".7"
  opacity=".5"
/>

<circle
  cx="349"
  cy="207"
  r="13"
  class="pulse"
/>

<circle
  cx="349"
  cy="207"
  r="4"
  class="location"
/>

<text
  x="407"
  y="174"
  class="globe-label">

  HONG KONG

</text>


<!-- =====================================================
     广州
===================================================== -->

<circle
  cx="340"
  cy="196"
  r="4"
  class="gz-location"
/>

<text
  x="415"
  y="221"
  class="globe-label">

  GUANGZHOU

</text>


<!-- =====================================================
     访客位置
===================================================== -->

<g
  id="visitorLocation"
  opacity="0">

  <line
    id="visitorLine"
    class="visitor-line"
    x1="250"
    y1="250"
    x2="250"
    y2="250"
  />

  <circle
    id="visitorPulse"
    class="visitor-pulse"
    cx="250"
    cy="250"
    r="4"
  />

  <circle
    id="visitorDot"
    class="visitor-dot"
    cx="250"
    cy="250"
    r="4"
  />

  <text
    id="visitorLabel"
    class="visitor-label"
    x="260"
    y="250">

    YOU

  </text>

</g>

</svg>


<div class="globe-caption">

  <strong>
    GLOBAL · LIVE
  </strong>

  <span id="globeLocation">
    正在定位访客
  </span>

</div>

</div>

</div>


<!-- =====================================================
     右侧信息
===================================================== -->

<div class="ip-panel">


  <!-- VISITOR LOCATION -->

  <div class="ip-card">

    <div class="ip-head">

      <span class="ip-title">
        VISITOR LOCATION
      </span>

      <span class="online">

        <i></i>

        ONLINE

      </span>

    </div>

    <div
      class="ip-number"
      id="heroIP">

      获取中…

    </div>

    <div
      class="ip-location"
      id="heroLocation">

      正在检测访问位置…

    </div>

    <div
      class="ip-coordinates"
      id="heroCoordinates">

      LAT -- · LNG --

    </div>

  </div>


  <!-- NETWORK REGION -->

  <div class="ip-card">

    <div class="ip-head">

      <span class="ip-title">
        NETWORK REGION
      </span>

      <span
        style="
          color:var(--cyan);
          font-size:10px">

        GEO IP

      </span>

    </div>

    <div
      class="region-content"
      id="networkRegion">

      <div>
        <span>国家 / 地区</span>
        <b>等待定位…</b>
      </div>

      <div>
        <span>城市</span>
        <b>等待定位…</b>
      </div>

      <div>
        <span>区域</span>
        <b>等待定位…</b>
      </div>

    </div>

  </div>


  <!-- DEVICE -->

  <div class="ip-card">

    <div class="ip-head">

      <span class="ip-title">
        DEVICE
      </span>

      <span
        style="
          color:var(--cyan);
          font-size:10px">

        CLIENT INFO

      </span>

    </div>

    <div class="device-list">

      <div class="device-row">
        <span>系统</span>
        <span id="os">--</span>
      </div>

      <div class="device-row">
        <span>浏览器</span>
        <span id="browser">--</span>
      </div>

      <div class="device-row">
        <span>屏幕</span>
        <span id="screen">--</span>
      </div>

      <div class="device-row">
        <span>语言</span>
        <span id="lang">--</span>
      </div>

    </div>

  </div>


</div>

</section>


<!-- =======================================================
     FOOTER
======================================================= -->

<footer>

  Hong Kong Radio Hub ·
  Metro ·
  RTHK ·
  Commercial Radio ·
  此为学习测试使用，版权属于版权持有人。

</footer>

</div>


<script>

/* =========================================================
   页面密码保护
   localStorage + 7天有效期
========================================================= */

/* 在这里修改访问密码 */

const PAGE_PASSWORD = "83875673";

/* 密码验证有效期：7天 */

const AUTH_EXPIRE =
  7 * 24 * 60 * 60 * 1000;


function checkPagePassword(){

  const input =
    document.getElementById(
      "pagePassword"
    );

  const error =
    document.getElementById(
      "loginError"
    );


  if(
    input.value ===
    PAGE_PASSWORD
  ){

    /*
     * 保存当前登录时间
     * 7天内自动跳过密码页面
     */

    localStorage.setItem(
      "radio_hub_auth",
      Date.now().toString()
    );


    document.getElementById(
      "loginScreen"
    ).style.display =
      "none";


  }else{

    error.style.display =
      "block";

    input.value =
      "";

    input.focus();

  }

}


/* =========================================================
   回车登录
========================================================= */

document
  .getElementById(
    "pagePassword"
  )
  .addEventListener(
    "keydown",
    function(e){

      if(
        e.key === "Enter"
      ){

        checkPagePassword();

      }

    }
  );


/* =========================================================
   已经登录则直接进入
   localStorage 7天有效
========================================================= */

const authTime =
  localStorage.getItem(
    "radio_hub_auth"
  );


if(
  authTime &&
  Date.now() -
  Number(authTime) <
  AUTH_EXPIRE
){

  document.getElementById(
    "loginScreen"
  ).style.display =
    "none";

}else{

  /*
   * 没有记录，或者已经超过7天
   * 删除旧登录状态
   */

  localStorage.removeItem(
    "radio_hub_auth"
  );

}


/* =========================================================
   星空
========================================================= */

(function(){

  const svg =
    document.getElementById(
      "stars"
    );

  const ns =
    "http://www.w3.org/2000/svg";


  for(
    let i=0;
    i<120;
    i++
  ){

    const c =
      document.createElementNS(
        ns,
        "circle"
      );


    c.setAttribute(
      "cx",
      Math.random()*1600
    );


    c.setAttribute(
      "cy",
      Math.random()*1000
    );


    c.setAttribute(
      "r",
      Math.random()*1.2+.2
    );


    c.setAttribute(
      "class",
      "star"
    );


    c.style.animationDelay =
      Math.random()*4+"s";


    svg.appendChild(c);

  }

})();


/* =========================================================
   香港时间
========================================================= */

function updateClock(){

  const d =
    new Date();


  const f =
    new Intl.DateTimeFormat(
      "zh-HK",
      {
        timeZone:"Asia/Hong_Kong",

        hour:"2-digit",

        minute:"2-digit",

        second:"2-digit",

        hour12:false
      }
    );


  document.getElementById(
    "clock"
  ).textContent =
    f.format(d);

}


updateClock();


setInterval(
  updateClock,
  1000
);


/* =========================================================
   WEATHER
   一次请求同时获取香港 + 广州
========================================================= */

async function loadWeather(){

  try{

    const url =
      "https://api.open-meteo.com/v1/forecast"+
      "?latitude=22.3193,23.1291"+
      "&longitude=114.1694,113.2644"+
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";


    const r =
      await fetch(url);


    if(!r.ok)
      throw new Error();


    const data =
      await r.json();


    const places =
      Array.isArray(data)
      ? data
      : [data];


    const hk =
      places[0];


    const gz =
      places[1];


    if(hk){

      renderWeather(
        "hk",
        hk.current
      );

    }


    if(gz){

      renderWeather(
        "gz",
        gz.current
      );

    }

  }catch(e){

    document.getElementById(
      "hkWeather"
    ).textContent =
      "天气暂不可用";


    document.getElementById(
      "gzWeather"
    ).textContent =
      "天气暂不可用";

  }

}


function renderWeather(
  key,
  c
){

  if(!c)
    return;


  document.getElementById(
    key+"Temp"
  ).textContent =
    Math.round(
      c.temperature_2m
    )+"°";


  document.getElementById(
    key+"Humidity"
  ).textContent =
    c.relative_humidity_2m;


  document.getElementById(
    key+"Wind"
  ).textContent =
    Math.round(
      c.wind_speed_10m
    );


  document.getElementById(
    key+"Weather"
  ).textContent =
    weatherText(
      c.weather_code
    );

}


function weatherText(
  code
){

  if(code===0)
    return "晴朗";


  if(code<=3)
    return "晴间多云";


  if(code<=48)
    return "雾";


  if(code<=57)
    return "毛毛雨";


  if(code<=67)
    return "降雨";


  if(code<=77)
    return "降雪";


  if(code<=82)
    return "阵雨";


  if(code<=86)
    return "阵雪";


  if(code>=95)
    return "雷暴";


  return "多云";

}


loadWeather();


/* =========================================================
   IP GEOLOCATION
   多 API 自动备用
========================================================= */

async function loadIP(){

  /*
   * 第一优先：
   * ipapi.co
   *
   * 第二备用：
   * ipwho.is
   *
   * 如果第一接口失败或者返回资料不完整，
   * 自动尝试第二接口。
   */


  const apis = [

    /* =====================================================
       API 1：ipapi.co
    ===================================================== */

    async function(){

      const r =
        await fetch(
          "https://ipapi.co/json/",
          {
            cache:"no-store"
          }
        );


      if(!r.ok){

        throw new Error(
          "ipapi.co HTTP "+
          r.status
        );

      }


      const j =
        await r.json();


      if(
        !j ||
        !j.ip
      ){

        throw new Error(
          "ipapi.co 返回数据无效"
        );

      }


      const lat =
        Number(
          j.latitude
        );


      const lon =
        Number(
          j.longitude
        );


      /*
       * 如果关键定位信息缺失，
       * 不使用这个结果，继续备用 API。
       */

      if(
        !j.country_name ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ){

        throw new Error(
          "ipapi.co 定位资料不完整"
        );

      }


      return {

        ip:
          j.ip || "",

        city:
          j.city || "",

        region:
          j.region || "",

        country:
          j.country_name || "",

        countryCode:
          j.country_code || "",

        lat:
          lat,

        lon:
          lon

      };

    },


    /* =====================================================
       API 2：ipwho.is
    ===================================================== */

    async function(){

      const r =
        await fetch(
          "https://ipwho.is/",
          {
            cache:"no-store"
          }
        );


      if(!r.ok){

        throw new Error(
          "ipwho.is HTTP "+
          r.status
        );

      }


      const j =
        await r.json();


      if(
        !j ||
        j.success === false ||
        !j.ip
      ){

        throw new Error(
          "ipwho.is 返回数据无效"
        );

      }


      const lat =
        Number(
          j.latitude
        );


      const lon =
        Number(
          j.longitude
        );


      if(
        !j.country ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ){

        throw new Error(
          "ipwho.is 定位资料不完整"
        );

      }


      return {

        ip:
          j.ip || "",

        city:
          j.city || "",

        region:
          j.region || "",

        country:
          j.country || "",

        countryCode:
          j.country_code || "",

        lat:
          lat,

        lon:
          lon

      };

    }

  ];


  let info =
    null;


  /* =====================================================
     依次尝试 API
  ===================================================== */

  for(
    const api of apis
  ){

    try{

      const result =
        await api();


      if(
        result &&
        result.ip
      ){

        info =
          result;

        console.log(
          "IP GEO 定位成功:",
          result
        );

        break;

      }

    }catch(e){

      console.warn(
        "IP GEO API 失败，尝试备用接口:",
        e
      );

    }

  }


  /* =====================================================
     所有 API 都失败
  ===================================================== */

  if(!info){

    document.getElementById(
      "heroIP"
    ).textContent =
      "无法获取";


    document.getElementById(
      "heroLocation"
    ).textContent =
      "IP 服务暂时不可用";


    document.getElementById(
      "networkRegion"
    ).innerHTML =

      "<div>"+
      "<span>国家 / 地区</span>"+
      "<b>不可用</b>"+
      "</div>"+

      "<div>"+
      "<span>城市</span>"+
      "<b>不可用</b>"+
      "</div>"+

      "<div>"+
      "<span>区域</span>"+
      "<b>不可用</b>"+
      "</div>";


    document.getElementById(
      "globeLocation"
    ).textContent =
      "无法定位访客";


    return;

  }


  /* =====================================================
     获取数据
  ===================================================== */

  const ip =
    info.ip ||
    "未知";


  const city =
    info.city ||
    "";


  const region =
    info.region ||
    "";


  const country =
    info.country ||
    "";


  const lat =
    Number(
      info.lat
    );


  const lon =
    Number(
      info.lon
    );


  const location =
    [
      city,
      region,
      country
    ]
    .filter(Boolean)
    .join(" · ");


  /* =====================================================
     VISITOR LOCATION
  ===================================================== */

  document.getElementById(
    "heroIP"
  ).textContent =
    ip;


  document.getElementById(
    "heroLocation"
  ).textContent =
    location ||
    "未知位置";


  if(
    Number.isFinite(lat) &&
    Number.isFinite(lon)
  ){

    document.getElementById(
      "heroCoordinates"
    ).textContent =
      "LAT "+
      lat.toFixed(4)+
      " · LNG "+
      lon.toFixed(4);

  }


  /* =====================================================
     NETWORK REGION
  ===================================================== */

  document.getElementById(
    "networkRegion"
  ).innerHTML =

    "<div>"+
    "<span>国家 / 地区</span>"+
    "<b>"+
    escapeHtml(
      country ||
      "未知"
    )+
    "</b>"+
    "</div>"+

    "<div>"+
    "<span>城市</span>"+
    "<b>"+
    escapeHtml(
      city ||
      "未知"
    )+
    "</b>"+
    "</div>"+

    "<div>"+
    "<span>区域</span>"+
    "<b>"+
    escapeHtml(
      region ||
      "未知"
    )+
    "</b>"+
    "</div>";


  /* =====================================================
     3D 地球
  ===================================================== */

  if(
    Number.isFinite(lat) &&
    Number.isFinite(lon)
  ){

    placeVisitor(
      lat,
      lon,
      city,
      country
    );

  }else{

    document.getElementById(
      "globeLocation"
    ).textContent =
      location ||
      "访客位置";

  }

}


/* =========================================================
   经纬度 → SVG
========================================================= */

function projectGeo(
  lat,
  lon
){

  const cx=250;

  const cy=250;

  const r=170;


  const lonRad =
    lon*Math.PI/180;


  const latRad =
    lat*Math.PI/180;


  const x =
    cx +
    r *
    Math.cos(latRad) *
    Math.sin(lonRad);


  const y =
    cy -
    r *
    Math.sin(latRad);


  return {
    x,
    y
  };

}


/* =========================================================
   访客位置
========================================================= */

function placeVisitor(
  lat,
  lon,
  city,
  country
){

  const p =
    projectGeo(
      lat,
      lon
    );


  const group =
    document.getElementById(
      "visitorLocation"
    );


  const dot =
    document.getElementById(
      "visitorDot"
    );


  const pulse =
    document.getElementById(
      "visitorPulse"
    );


  const line =
    document.getElementById(
      "visitorLine"
    );


  const label =
    document.getElementById(
      "visitorLabel"
    );


  const hkX=349;

  const hkY=207;


  dot.setAttribute(
    "cx",
    p.x
  );


  dot.setAttribute(
    "cy",
    p.y
  );


  pulse.setAttribute(
    "cx",
    p.x
  );


  pulse.setAttribute(
    "cy",
    p.y
  );


  line.setAttribute(
    "x1",
    hkX
  );


  line.setAttribute(
    "y1",
    hkY
  );


  line.setAttribute(
    "x2",
    p.x
  );


  line.setAttribute(
    "y2",
    p.y
  );


  label.setAttribute(
    "x",
    p.x+9
  );


  label.setAttribute(
    "y",
    p.y-8
  );


  const shortCity =
    city ||
    "YOU";


  label.textContent =
    shortCity
      .toUpperCase()
      .slice(0,18);


  group.setAttribute(
    "opacity",
    "1"
  );


  document.getElementById(
    "globeLocation"
  ).textContent =
    city
      ? city+" · "+country
      : "访客位置";

}


/* =========================================================
   HTML 转义
========================================================= */

function escapeHtml(
  value
){

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


loadIP();


/* =========================================================
   DEVICE
========================================================= */

function detectOS(){

  const ua =
    navigator.userAgent;


  if(/Windows/i.test(ua))
    return "Windows";


  if(/Android/i.test(ua))
    return "Android";


  if(
    /iPhone|iPad|iPod/i.test(ua)
  )
    return "iOS";


  if(/Mac OS X/i.test(ua))
    return "macOS";


  if(/Linux/i.test(ua))
    return "Linux";


  return "Unknown";

}


function detectBrowser(){

  const ua =
    navigator.userAgent;


  if(/Edg/i.test(ua))
    return "Microsoft Edge";


  if(/Chrome/i.test(ua))
    return "Google Chrome";


  if(/Firefox/i.test(ua))
    return "Firefox";


  if(/Safari/i.test(ua))
    return "Safari";


  return "Browser";

}


document.getElementById(
  "os"
).textContent =
  detectOS();


document.getElementById(
  "browser"
).textContent =
  detectBrowser();


document.getElementById(
  "screen"
).textContent =
  screen.width+
  " × "+
  screen.height;


document.getElementById(
  "lang"
).textContent =
  navigator.language ||
  "--";

</script>

</body>
</html>

