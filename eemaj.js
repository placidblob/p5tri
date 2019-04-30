class Eemaj {

  static preload() {
    // image source: https://search.creativecommons.org/photos/666919db-7936-4ad8-b50c-41969646864e
    const imgURL = "beagle.jpg";

    img = loadImage(imgURL);
  }

  static setup() {
  }

  static draw() {
    createCanvas(MAX_X,MAX_Y);

    image(img, 0, 0, img.width, img.height);
    // pixelDensity(1);
    let d = pixelDensity();

    console.log('pixelDensity()', d);

    loadPixels();

    for(let x = 1; x < MAX_X - 1; x++ )
      for(let y = 1; y < MAX_Y - 1; y++ ) {

      }

    updatePixels();
  }

  static getColor(x, y, arr, maxX) {
    const rtrn = new p5.Color();

    let idx = 4 * (maxX * y * d) + (4 * x * d);

    rtrn.setRed(arr[idx++]);
    rtrn.setGreen(arr[idx++]);
    rtrn.setBlue(arr[idx++]);
    rtrn.setAlpha(arr[idx]);

    return rtrn;
  }

}