<template>
  <div class="s-canvas">
    <canvas
      id="s-canvas"
      :width="contentWidth"
      :height="contentHeight"
    ></canvas>
  </div>
</template>
<script>
export default {
  name: "SIdentify",
  props: {
    identifyCode: {
      type: String,
      default: "1234",
    },
    fontSizeMin: {
      type: Number,
      default: 32,
    },
    fontSizeMax: {
      type: Number,
      default: 40,
    },
    backgroundColorMin: {
      type: Number,
      default: 180,
    },
    backgroundColorMax: {
      type: Number,
      default: 240,
    },
    colorMin: {
      type: Number,
      default: 50,
    },
    colorMax: {
      type: Number,
      default: 160,
    },
    lineColorMin: {
      type: Number,
      default: 40,
    },
    lineColorMax: {
      type: Number,
      default: 180,
    },
    dotColorMin: {
      type: Number,
      default: 0,
    },
    dotColorMax: {
      type: Number,
      default: 255,
    },
    contentWidth: {
      type: Number,
      default: 112,
    },
    contentHeight: {
      type: Number,
      default: 38,
    },
  },
  methods: {
    // 生成一個隨機數
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 生成一個隨機的顏色
    randomColor(min, max) {
      let r = this.randomNum(min, max);
      let g = this.randomNum(min, max);
      let b = this.randomNum(min, max);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
    drawPic() {
      let canvas = document.getElementById("s-canvas");
      let ctx = canvas.getContext("2d");
      ctx.textBaseline = "bottom";
      // 繪製背景
      ctx.fillStyle = this.randomColor(
        this.backgroundColorMin,
        this.backgroundColorMax
      );
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight);
      // 繪製文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i);
      }
      this.drawLine(ctx);
      this.drawDot(ctx);
    },
    drawText(ctx, txt, i) {
      ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax);
      ctx.font =
        this.randomNum(this.fontSizeMin, this.fontSizeMax) + "px SimHei";
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1));
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5);
      let deg = this.randomNum(-25, 25);
      // 修改座標原點和旋轉角度
      ctx.translate(x, y);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillText(txt, 0, 0);
      // 恢復座標原點和旋轉角度
      ctx.rotate((-deg * Math.PI) / 180);
      ctx.translate(-x, -y);
    },
    drawLine(ctx) {
      // 繪製干擾線
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = this.randomColor(
          this.lineColorMin,
          this.lineColorMax
        );
        ctx.beginPath();
        ctx.moveTo(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight)
        );
        ctx.lineTo(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight)
        );
        ctx.stroke();
      }
    },
    drawDot(ctx) {
      // 繪製干擾點
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = this.randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight),
          1,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    },
  },
  watch: {
    identifyCode() {
      this.drawPic();
    },
  },
  mounted() {
    this.drawPic();
  },
};
</script>

<style scoped>
</style>