const fs = require('fs');
const path = require('path');
const { getAccessToken, getUnlimitedQRCode } = require('./api');

const APP_ID = process.argv[process.argv.indexOf('--APP_ID') + 1]; // 在 --APP_ID 后面
const APP_SECRET = process.argv[process.argv.indexOf('--APP_SECRET') + 1]; // --APP_SECRET 后面

const pagesFolder = path.join(__dirname, '../../example/pages');
const pages = fs.readdirSync(pagesFolder);

const timestamp = new Date().getTime();

/**
 * 清空目标文件夹下内容
 * @param dirPath
 */
const getEmptyFolder = (dirPath) => {
  const dirList = fs.readdirSync(dirPath);
  dirList.forEach((fileName) => {
    fs.unlinkSync(`${dirPath}/${fileName}`);
  });
};

const getUnlimitedQRCodeImage = (appid, appSecret) => {
  const targetFolder = path.resolve(__dirname, `../../site/public/assets/qrcode`);
  getEmptyFolder(targetFolder);

  getAccessToken(appid, appSecret).then((e) => {
    if (e.access_token) {
      const token = e.access_token;
      // eslint-disable-next-line no-console
      console.log('==access_token 2h内有效=', token);
      const baseParameter = {
        width: 280, // 小程序码大小
        // check_path: false,
      };
      const baseConfig = {
        responseType: 'arraybuffer',
      };

      // 循环 pages, 获取相应小程序码
      pages.forEach((item) => {
        const specialParameter = {
          page: `pages/${item}/${item}`, // 扫码进入的小程序页面路径
          scene: `name=${item}`, // 标识
        };
        getUnlimitedQRCode(token, JSON.stringify({ ...specialParameter, ...baseParameter }), { ...baseConfig }).then(
          (res) => {
            // 因为微信接口 getwxacodeunlimit 成功时返回的是 Buffer ，失败时返回 JSON 结构。这里把返回数据全部当成 Buffer 处理，所以 res.length < 200， 则表示获取失败。
            if (res.length < 200) {
              const { errcode, errmsg } = JSON.parse(res.toString());
              // eslint-disable-next-line no-console
              console.log('===小程序码获取失败===', { errcode, errmsg });
              return;
            }
            const buffer = Buffer.from(res, 'base64');
            const destPath = path.resolve(__dirname, `../../site/public/assets/qrcode/${item}-${timestamp}.png`);
            fs.writeFile(
              destPath,
              buffer,
              {
                encoding: 'binary',
                flag: 'w+',
              },
              (err) => {
                if (err) {
                  // eslint-disable-next-line no-console
                  console.log('===小程序码图片存储错误===', err);
                }
              },
            );
          },
        );
      });
    }
  });
};

/**
 * @description 命令行生成小程序码 npm run qrcode -- --APP_ID xxx --APP_SECRET xxx
 */
getUnlimitedQRCodeImage(APP_ID, APP_SECRET);
