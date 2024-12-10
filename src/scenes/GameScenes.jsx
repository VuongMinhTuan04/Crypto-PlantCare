import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Tải background và cây
    if (this.isMobileDevice()) {
      this.load.image("background", "/assets/images/background.png");
    } else {
      this.load.image("background", "/assets/images/background.png");
    }

    this.load.image("tree", "/assets/images/tree.png");
    this.load.image("treelevel", "/assets/images/treelevel.png");
    this.load.image("whitecircle", "/assets/images/white-circle.png");
  }

  create() {
    const { width, height } = this.scale; // Lấy kích thước màn hình

    // Thêm background và làm đầy toàn màn hình
    this.background = this.add
      .image(width / 2, height / 2, "background") // Đặt background giữa màn hình
      .setOrigin(0.5) // Đặt tâm ảnh
      .setDisplaySize(width, height); // Căng ảnh ra toàn màn hình

    // Thêm cây
    this.tree = this.add
      .sprite(width / 2, height - 150, "tree")
      .setOrigin(0.5, 1)
      .setScale(0.6);

    this.tree.setInteractive();
    this.tree.on("pointerdown", () => {
      console.log("Cây được click");
    });

    // this.whitecircle = this.add
    // .image(width / 8, height / 7 ,"whitecircle")
    // .setOrigin(0.5, 1)
    // .setScale(0.08)

    // Đặt hình treelevel lên trên nền
    this.treelevel = this.add
      .image(width / 8, height / 8, "treelevel")
      .setOrigin(0.5, 1)
      .setScale(0.2)
      .setDepth(1); // Đảm bảo hình treelevel nằm trên nền
    // Tạo hình nền tròn
    const graphics = this.add.graphics();
    graphics.fillStyle(0xf0f0f0, 1); // Màu nền nhạt với độ trong suốt
    graphics.fillCircle(
      this.treelevel.x,
      this.treelevel.y - this.treelevel.height / 9,
      this.treelevel.width / 9 // Bán kính hình tròn
    );

    // Layer the image on top of the background
    this.treelevel.setDepth(1);

    // Tạo ô trắng
    this.whiteBox = this.add.graphics();
    this.whiteBox.fillStyle(0xffffff, 1); // Màu trắng với độ trong suốt
    this.whiteBox.fillRoundedRect(
      width / 8 - 50, // Điều chỉnh vị trí x
      height / 8 - 50, // Điều chỉnh vị trí y
      80, // Chiều rộng
      30, // Chiều cao
      10 // Bán kính góc bo tròn
    );

    // Đặt nó ở độ sâu dưới treelevel
    this.whiteBox.setDepth(0);
    // Căn chỉnh khi thay đổi kích thước màn hình
    this.scale.on("resize", this.resizeBackground, this);
    this.resizeBackground(this.scale.gameSize);
  }

  resizeBackground(gameSize) {
    const { width, height } = gameSize;

    // Điều chỉnh lại background khi màn hình thay đổi
    this.background
      .setPosition(width / 2, height / 2)
      .setDisplaySize(width, height);

    // Điều chỉnh lại vị trí của cây nếu cần
    this.tree.setPosition(width / 2, height - 150);
  }

  // update() {
  //   // Logic cập nhật (nếu có)
  // }

  isMobileDevice() {
    // Kiểm tra xem thiết bị có phải là di động hay không
    return /Mobi|Android/i.test(navigator.userAgent);
  }
}
