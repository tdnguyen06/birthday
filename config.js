// =================================================================
// 💖 CẤU HÌNH THÔNG TIN TRANG WEB MỪNG SINH NHẬT
// =================================================================
const CONFIG = {
    // Tiêu đề hiển thị trên thanh tab trình duyệt
    titleWeb: "Happy Birthday 🎂✨",

    // Tên của bạn nữ
    loverName: "bìm",

    // Mật khẩu mở khóa (6 chữ số)
    passwords: ["100906"],

    // Ngày sinh nhật hiển thị
    birthdayDate: "10/09/2006",

    // Danh sách ảnh kỷ niệm cho phần Slideshow
    gallery: [
        {
            src: "images/max1.jpg",
            caption: "Một khoảnh khắc thật tự nhiên và đáng nhớ ✨"
        },
        {
            src: "images/max2.jpg",
            caption: "Những phút giây bình yên và nhiều niềm vui 🌸"
        },
        {
            src: "images/max3.jpg",
            caption: "Mỗi ngày trôi qua đều có thêm những kỷ niệm đẹp 🌿"
        },
        {
            src: "images/max4.jpg",
            caption: "Nụ cười của em luôn mang lại năng lượng rất tích cực 😊"
        },
        {
            src: "images/max5.jpg",
            caption: "Cảm ơn em vì những khoảnh khắc ý nghĩa đã cùng chia sẻ ✨"
        },
        {
            src: "images/max6.jpg",
            caption: "Chúc mừng sinh nhật! Chúc em tuổi mới luôn vui tươi, an nhiên và may mắn 🎂"
        }
    ],

    // Cấu hình Minigame 1: Game Hứng Quà Sinh Nhật
    game1: {
        title: "Thử Thách 1: Hứng Quà Sinh Nhật 🎁",
        targetScore: 10,
        description: "Di chuyển chiếc giỏ để hứng đủ 10 món quà sinh nhật rơi từ trên xuống nhé!"
    },

    // Cấu hình Minigame 2: Trò chơi Chọn Bông Hoa Đẹp Nhất
    flowerGame: {
        title: "Thử Thách 2: Tìm Bông Hoa Đẹp Nhất 🌸",
        subTitle: "Trong các loài hoa dưới đây, theo em bông hoa nào là đẹp nhất?",
        flowers: [
            { id: "rose_red", name: "Hoa Hồng Đỏ", icon: "🌹", desc: "Nổi bật và quyến rũ" },
            { id: "sunflower", name: "Hoa Hướng Dương", icon: "🌻", desc: "Luôn hướng về ánh nắng" },
            { id: "tulip", name: "Hoa Tulip", icon: "🌷", desc: "Thanh lịch và trang nhã" },
            { id: "sakura", name: "Hoa Anh Đào", icon: "🌸", desc: "Dịu dàng và thanh thoát" },
            { id: "peony", name: "Hoa Mẫu Đơn", icon: "🌺", desc: "Kiêu kỳ và quý phái" },
            { id: "daisy", name: "Cúc Họa Mi", icon: "🌼", desc: "Mộc mạc và trong trẻo" },
            { id: "hydrangea", name: "Cẩm Tú Cầu", icon: "💐", desc: "Tinh tế và duyên dáng" },
            { id: "baby", name: "Hoa Baby", icon: "💮", desc: "Nhỏ nhắn và nhẹ nhàng" },
            { id: "dandelion", name: "Bồ Công Anh", icon: "🌾", desc: "Bình yên theo làn gió" },
            { id: "lavender", name: "Hoa Oải Hương", icon: "💐", desc: "Nhẹ nhàng và thơm ngát" },
            { id: "lotus", name: "Hoa Sen", icon: "🌸", desc: "Thanh khiết và an yên" },
            { id: "orchid", name: "Lan Hồ Điệp", icon: "🌺", desc: "Sang trọng và tao nhã" }
        ],
        // 3 câu phản hồi khi chọn 3 lần đầu
        failMessages: [
            "❌ Hoa này rất đẹp, nhưng vẫn chưa phải đáp án đúng đâu nha! Thử lại xem 🌹",
            "❌ Vẫn chưa chính xác nè! Bông hoa đẹp nhất không nằm trong số này đâu. Chọn tiếp thử đi 🌷",
            "❌ Vẫn chưa đúng rồi! Thật ra không có loài hoa tự nhiên nào là đẹp nhất cả..."
        ],
        // Màn kết luận nhẹ nhàng, chân thành
        conclusion: {
            title: "🌸 VỚI ANH, EM MỚI LÀ BÔNG HOA ĐẸP NHẤT 🌸",
            subtitle: "Mỗi người một vẻ, nhưng em luôn là điều đặc biệt nhất ✨",
            message: "Hoa đẹp đến đâu rồi cũng có lúc tàn, nhưng nét duyên dáng, sự chân thành và nụ cười rạng rỡ của em luôn để lại ấn tượng đẹp nhất. Chúc em luôn tự tin, tỏa sáng và hạnh phúc theo cách của riêng mình nhé! 🌿✨",
            image: "images/max1.jpg",
            btnText: "Tiếp Tục & Thổi Nến 🎂"
        }
    },

    // Cấu hình Minigame 3: Thổi nến sinh nhật & Ước nguyện
    gameCake: {
        title: "Thử Thách Cuối: Thổi Nến & Ước Nguyện 🎂🕯️",
        description: "Nhắm mắt ước một điều ước cho tuổi mới, sau đó chạm vào ngọn nến để thổi tắt nhé!"
    },

    // Nội dung bức thư chúc mừng sinh nhật
    secretLetter: {
        title: "Lời Chúc Sinh Nhật Gửi Tới Em 💌",
        greeting: "Gửi em,",
        paragraphs: [
            "Hôm nay là một ngày thật đặc biệt — ngày sinh nhật của em.",
            "Anh cảm thấy rất vui và may mắn khi có cơ hội được quen biết, trò chuyện và đồng hành cùng em trong suốt khoảng thời gian qua.",
            "Bước sang tuổi mới, anh chúc em luôn giữ được nụ cười rạng rỡ, nhiều sức khỏe, luôn bình an và gặt hái được những mục tiêu mà em ấp ủ.",
            "Mong rằng những điều tốt đẹp, may mắn và vui vẻ nhất sẽ luôn đến với em trên mỗi chặng đường phía trước.",
            "À mà,vì anh nghĩ thứ 5 sẽ là ngày để gia đình và bạn bè chúc mừng sinh nhật em, vậy nên Anh muốn hẹn em đi chơi vào tối thứ 7 lúc 18h30 và cùng nhau có một buổi tối thật vui nhé! ☕✨",
            "Chúc mừng sinh nhật em! Chúc em có một tuổi mới thật trọn vẹn và ý nghĩa. 🎂"
        ],
        signature: "Gửi tặng em 🌿"
    },

    // Nhạc nền (Link nhạc MP3 trực tiếp chất lượng cao)
    musicSrc: "https://assets.mixkit.co/music/preview/mixkit-happy-birthday-to-you-443.mp3"
};
