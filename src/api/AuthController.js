import svgCaptcha from "svg-captcha"

class AuthController {
  constructor() {}
  async getCaptcha(ctx) {
    const captcha = svgCaptcha.create({
      size: 4, //4位验证码
      ignoreChars: "0o1il", //不出现容易混肴的字母数字
      color: true, //彩色验证码
      noise: Math.floor(Math.random() * 5), //随机干扰线条
      width: 150,
      height: 50,
    })
    console.log(captcha)
    ctx.body = {
      code: 200,
      data: captcha.data, //capcha对象包含了text:验证码 和 data：svg>
    }
  }
}

export default new AuthController()
