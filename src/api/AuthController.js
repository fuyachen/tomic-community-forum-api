import svgCaptcha from "svg-captcha"
import { setValue, getValue } from "../config/RedisConfig"

class AuthController {
  constructor() {}
  async getCaptcha(ctx) {
    // 获取sid
    const body = ctx.request.query

    //capcha对象包含了text:验证码 和 data：svg>
    const captcha = svgCaptcha.create({
      size: 4, //4位验证码
      ignoreChars: "0o1il", //不出现容易混肴的字母数字
      color: true, //彩色验证码
      noise: Math.floor(Math.random() * 5), //随机干扰线条
      width: 150,
      height: 50,
    })

    // 绑定key-value（sid-text）,设置过期时间（秒）
    setValue(body.sid, captcha.text, 60)
    getValue(body.sid).then((res) => {
      console.log(res)
    })

    ctx.body = {
      code: 200,
      data: captcha.data,
    }
  }
}

export default new AuthController()
