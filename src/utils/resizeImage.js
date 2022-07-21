export const resizeImage = (data) => {
  let image = new Image();
  image.src = data;
  image.onload = function () {
    let height = this.height;
    let width = this.width;
    let maxWidth = 200;
    let maxHeight = 150;
    let aspectW = width / maxWidth;
    let aspectH = height / maxHeight;

    if (aspectW > 1 || aspectH > 1) {
      if (aspectW > aspectH) {
        return {
          width: maxWidth,
          height: height / aspectW,
        };
      } else {
        return {
          width: width / aspectH,
          height: maxHeight,
        };
      }
    }
  };
};
