<template>
  <div class="Editor">
   <input type="file" ref="imgUpload" id="avatar" name="avatar" accept="image/png, image/jpeg" @change="insertImage">
   <div class="EditorMenu">
     <button @click.prevent="changeStyle('Bold')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M10.187 17H5.773c-.637 0-1.092-.138-1.364-.415-.273-.277-.409-.718-.409-1.323V4.738c0-.617.14-1.062.419-1.332.279-.27.73-.406 1.354-.406h4.68c.69 0 1.288.041 1.793.124.506.083.96.242 1.36.478.341.197.644.447.906.75a3.262 3.262 0 0 1 .808 2.162c0 1.401-.722 2.426-2.167 3.075C15.05 10.175 16 11.315 16 13.01a3.756 3.756 0 0 1-2.296 3.504 6.1 6.1 0 0 1-1.517.377c-.571.073-1.238.11-2 .11zm-.217-6.217H7v4.087h3.069c1.977 0 2.965-.69 2.965-2.072 0-.707-.256-1.22-.768-1.537-.512-.319-1.277-.478-2.296-.478zM7 5.13v3.619h2.606c.729 0 1.292-.067 1.69-.2a1.6 1.6 0 0 0 .91-.765c.165-.267.247-.566.247-.897 0-.707-.26-1.176-.778-1.409-.519-.232-1.31-.348-2.375-.348H7z"></path></svg></button>
     <button @click.prevent="changeStyle('Italic')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M9.586 14.633l.021.004c-.036.335.095.655.393.962.082.083.173.15.274.201h1.474a.6.6 0 1 1 0 1.2H5.304a.6.6 0 0 1 0-1.2h1.15c.474-.07.809-.182 1.005-.334.157-.122.291-.32.404-.597l2.416-9.55a1.053 1.053 0 0 0-.281-.823 1.12 1.12 0 0 0-.442-.296H8.15a.6.6 0 0 1 0-1.2h6.443a.6.6 0 1 1 0 1.2h-1.195c-.376.056-.65.155-.823.296-.215.175-.423.439-.623.79l-2.366 9.347z"></path></svg></button>
     <button @click.prevent="changeStyle('Underline')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M3 18v-1.5h14V18zm2.2-8V3.6c0-.4.4-.6.8-.6.3 0 .7.2.7.6v6.2c0 2 1.3 2.8 3.2 2.8 1.9 0 3.4-.9 3.4-2.9V3.6c0-.3.4-.5.8-.5.3 0 .7.2.7.5V10c0 2.7-2.2 4-4.9 4-2.6 0-4.7-1.2-4.7-4z"></path></svg></button>
     <button @mousedown.prevent><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M9.816 11.5L7.038 4.785 4.261 11.5h5.555zm.62 1.5H3.641l-1.666 4.028H.312l5.789-14h1.875l5.789 14h-1.663L10.436 13zm7.55 2.279l.779-.779.707.707-2.265 2.265-2.193-2.265.707-.707.765.765V4.825c0-.042 0-.083.002-.123l-.77.77-.707-.707L17.207 2.5l2.265 2.265-.707.707-.782-.782c.002.043.003.089.003.135v10.454z"></path></svg>
       <div class="hiddenMenu">
         <button class="hiddenMenuItem" @mousedown.prevent v-for="(item,index) in FontSizeList" :key="index" @click.prevent="changeFontSize(item)">{{item}}px</button>
       </div>
     </button>
     <button @mousedown.prevent><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M12.4 10.3L10 4.5l-2.4 5.8h4.8zm.5 1.2H7.1L5.7 15H4.2l5-12h1.6l5 12h-1.5L13 11.5zm3.1 7H4a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z"></path></svg>
       <div class="hiddenMenu">
         <button class="hiddenMenuItem" @mousedown.prevent v-for="(item,index) in ForeColorList" :key="index" :style="{'background-color':item}" @click.prevent="changeForeColor(item)">{{item}}</button>
       </div>
     </button>
     <button @mousedown.prevent><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M4 2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8.38 9.262H7.62L10 5.506l2.38 5.756zm.532 1.285L14.34 16h1.426L10.804 4H9.196L4.234 16H5.66l1.428-3.453h5.824z"></path></svg>
       <div class="hiddenMenu">
         <button class="hiddenMenuItem" @mousedown.prevent v-for="(item,index) in ForeColorList" :key="index" :style="{'background-color':item}" @click.prevent="changeHiliteColor(item)">{{item}}</button>
       </div>
     </button>
     <button @click.prevent="changeStyle('insertOrderedList')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M7 5.75c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zM3.5 3v5H2V3.7H1v-1h2.5V3zM.343 17.857l2.59-3.257H2.92a.6.6 0 1 0-1.04 0H.302a2 2 0 1 1 3.995 0h-.001c-.048.405-.16.734-.333.988-.175.254-.59.692-1.244 1.312H4.3v1h-4l.043-.043zM7 14.75a.75.75 0 0 1 .75-.75h9.5a.75.75 0 1 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75z"></path></svg></button>
     <button @click.prevent="changeStyle('JustifyLeft')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 4c0 .414.336.75.75.75h9.929a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75z"></path></svg></button>
     <button @click.prevent="changeStyle('JustifyCenter')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm2.286 4c0 .414.336.75.75.75h9.928a.75.75 0 1 0 0-1.5H5.036a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h9.928a.75.75 0 1 0 0-1.5H5.036a.75.75 0 0 0-.75.75z"></path></svg></button>
     <button @click.prevent="changeStyle('JustifyRight')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M18 3.75a.75.75 0 0 1-.75.75H2.75a.75.75 0 1 1 0-1.5h14.5a.75.75 0 0 1 .75.75zm0 8a.75.75 0 0 1-.75.75H2.75a.75.75 0 1 1 0-1.5h14.5a.75.75 0 0 1 .75.75zm0 4a.75.75 0 0 1-.75.75H7.321a.75.75 0 1 1 0-1.5h9.929a.75.75 0 0 1 .75.75zm0-8a.75.75 0 0 1-.75.75H7.321a.75.75 0 1 1 0-1.5h9.929a.75.75 0 0 1 .75.75z"></path></svg></button>
     <button @mousedown.prevent @click.prevent="$refs.imgUpload.click()"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"></path></svg></button>
     <button @click.prevent="changeStyle('removeFormat')"><svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M11.591 10.177l4.243 4.242a1 1 0 0 1-1.415 1.415l-4.242-4.243-4.243 4.243a1 1 0 0 1-1.414-1.415l4.243-4.242L4.52 5.934A1 1 0 0 1 5.934 4.52l4.243 4.243 4.242-4.243a1 1 0 1 1 1.415 1.414l-4.243 4.243z"></path></svg></button>
   </div>
   <div class="EditorContent" ref="inputDiv" @input="show" v-html="value" contenteditable></div>
  </div>
</template>

<script>
export default {
  //Bold,Italic,Underline,JustifyLeft,JustifyCenter,JustifyRight
  props:["value"],
  data() {
    return {
      FontSizeList:[16,20,22,24,28,32,36,40],
      ForeColorList:["#fff","#000","#f00","#0f0","#00f"],
      allStyle:{
        Bold:false,
        Italic:false,
        Underline:false,
      }
    }
  },
  methods: {
    setCaretPosition(ctrl, pos) {
      // Modern browsers
      if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
      
      // IE8 and below
      } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    },
    async show(x) {
      await this.$emit('input',x.target.innerHTML)
      this.setCaretPosition(this.$refs.inputDiv,2)
    },
    changeStyle(x) {
      this.allStyle[x]=!this.allStyle[x]
      document.execCommand(x)
    },
    changeFontSize(x) {
      document.execCommand("fontSize",false,"7")
      var fontElements = document.getElementsByTagName("font");
      for (var i = 0, len = fontElements.length; i < len; ++i) {
        if (fontElements[i].size == "7") {
            fontElements[i].removeAttribute("size");
            fontElements[i].style.fontSize =x+"px";
        }
      }
    },
    changeForeColor(x) {
      document.execCommand("ForeColor",false,x)
    },
    changeHiliteColor(x) {
      document.execCommand("hiliteColor",false,x)
    },
    insertImage(e) {
      let file=e.target.files
      const reader = new FileReader();
      reader.addEventListener("load",()=> {
        console.log(reader.result)
        document.execCommand("insertImage",false,reader.result)
      }, false);
      if (file) {
        reader.readAsDataURL(file[0]);
      }
    },
  }
}
</script>

<style scoped>
#avatar {
  display:none;
}
.Editor {
  border-radius: 5px;
  border-width: 1px;
  border-color: #888;
  border-style: solid;
}
.EditorMenu {
  padding: 5px 20px;
  display: flex;
  align-items: center;
  border-width: 0 0 1px 0;
  border-color: #888;
  border-style: solid;
}
.EditorContent {
  min-height: 300px;
  box-sizing: border-box;
  padding: 20px;
}
.EditorContent:focus {
  outline: -webkit-focus-ring-color auto 0px;
}
.onChange {
  background-color: #444;
}
button {
  background-color: transparent;
  border-width: 0px;
  cursor: pointer;
  position: relative;
}
.hiddenMenu {
  position: absolute;
  width: 100px;
  background-color: #fff;
  top:20px;
  right:-40px;
  display: none;
  z-index: 2;
  box-shadow: 0 0 5px #888;
  border-radius: 5px;
  overflow: hidden;
}
.hiddenMenuItem {
  width: 100%;
  height: 30px;
}
.hiddenMenuItem:hover {
  background-color: #888;
  color:#fff;
}
button:hover .hiddenMenu {
  display: block;
}
</style>