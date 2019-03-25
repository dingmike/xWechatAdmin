/* eslint-disable */

function photoCompress(file, w, objDiv) {
  var _this = this
  var ready=new FileReader()
  ready.readAsDataURL(file)
  ready.onload=function(){
    var re=this.result
    canvasDataURL(re, w, objDiv)
  }
}
function canvasDataURL(path, obj, callback){
  var img = new Image()
  img.src = path
  img.onload = function() {
    var that = this
    // 默认按比例压缩
    var w = that.width,
      h = that.height,
      scale = w / h
    w = obj.width || w
    h = obj.height || (w / scale)
    var quality = 0.7  // 默认图片质量为0.7
    //生成canvas
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    // 创建属性节点
    var anw = document.createAttribute("width")
    anw.nodeValue = w;
    var anh = document.createAttribute("height")
    anh.nodeValue = h;
    canvas.setAttributeNode(anw)
    canvas.setAttributeNode(anh)
    ctx.drawImage(that, 0, 0, w, h)
    // 图像质量
    if(obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality
    }
    // quality值越小，所绘制出的图像越模糊
    var base64 = canvas.toDataURL('image/jpeg', quality);
    // 回调函数返回base64的值
    var form = new FormData()
    var bl = convertBase64UrlToBlob(base64)
    console.log(base64.length/1024)
    form.append("file", bl, "file_"+Date.parse(new Date())+".jpg")
    callback(form)
  }
}
function convertBase64UrlToBlob(urlData){
  var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

// 选择大中小三种图片，x1:120 ,x2: 300 ,x3: 650
function countSmallUrl (url, sizeName) {
  return url.replace(/(.jpg|.png|.jpeg|.gif)$/, sizeName + '$&')
}

export default{
  photoCompress,
  countSmallUrl
}
