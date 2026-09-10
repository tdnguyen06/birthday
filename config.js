// =================================================================
// 🎞️ TOÀN BỘ TEXT VÀ CẤU HÌNH DỰ ÁN (TẬP TRUNG TẠI FILE NÀY ĐỂ DỄ SỬA)
// =================================================================

const CONFIG = {
    // -------------------------------------------------------------
    // 1. THÔNG TIN CHUNG & TRANG WEB
    // -------------------------------------------------------------
    titleWeb: "Mixtape 2006 • Happy Birthday Bìm 🎞️",
    loverName: "bìm", // Tên để mở khóa nếu gõ chữ
    birthdayDate: "10.09.2006",

    // Các mật khẩu hợp lệ để mở khóa cuộn băng (hỗ trợ cả ngày sinh, chữ thường...)
    passwords: ["100906", "10092006", "1009", "bìm", "bim"],

    // -------------------------------------------------------------
    // 2. WIDGET CASSETTE GÓC MÀN HÌNH & MÀN 1 (MÁY BĂNG & MÃ MỞ KHÓA)
    // -------------------------------------------------------------
    floatingCassette: {
        title: "MIXTAPE 2006",
        statusReady: "Side A • Sẵn sàng",
        statusPlaying: "Side A • Đang phát",
        statusPaused: "Side A • Tạm dừng"
    },

    screenLock: {
        deckBrand: "ANALOG STEREO DECK • MODEL 2006",
        counterLabel: "TAPE COUNTER",
        badge: "PREMIUM CASSETTE 60 MIN",
        side: "SIDE A",
        tapeTitle: "Mixtape For Bìm",
        tapeSub: "Special Edition • Memories Collection",
        pinHint: "Nhập <strong>mã số bí mật</strong> để mở khóa cuộn băng:",
        pinPlaceholder: "Nhập mã số...",
        unlockBtnText: "PHÁT CUỘN BĂNG KỶ NIỆM",
        wrongPassMsg: "Mã số chưa chính xác rồi, bạn thử lại nhé!"
    },

    // -------------------------------------------------------------
    // 3. MÀN 2: CUỘN PHIM 35MM (SLIDESHOW KỶ NIỆM)
    // -------------------------------------------------------------
    screenSlideshow: {
        recBadge: "REC 10:09:06",
        batteryBadge: "SP 0:00:24 ▮▮▮▯",
        heading: "Cuộn Phim Kỷ Niệm 35mm",
        sub: "Lưu giữ những khoảnh khắc bình dị và đáng nhớ nhất",
        btnToGamesText: "MỞ CHUỖI 3 THỬ THÁCH"
    },

    // Danh sách 7 thước phim 35mm (Slideshow)
    gallery: [
        {
            src: "images/anh1.png",
            code: "KODAK-400 • EXP 01",
            date: "10 '09 '24"
        },
        {
            src: "images/anh2.png",
            code: "FUJIFILM • EXP 02",
            date: "12 '11 '24"
        },
        {
            src: "images/anh3.png",
            code: "PORTRA-160 • EXP 03",
            date: "04 '02 '25"
        },
        {
            src: "images/anh4.png",
            code: "CINELIGHT • EXP 04",
            date: "28 '04 '25"
        },
        {
            src: "images/anh5.png",
            code: "ILFORD-HP5 • EXP 05",
            date: "19 '07 '25"
        },
        {
            src: "images/anh6.png",
            code: "GOLD-200 • EXP 06",
            date: "10 '09 '26"
        },
        {
            src: "images/anh7.png",
            code: "VINTAGE • EXP 07",
            date: "10 '09 '26"
        }
    ],

    // -------------------------------------------------------------
    // 4. MÀN 3 - THỬ THÁCH 1: PIANO TILES (BẤM NỐT RƠI)
    // -------------------------------------------------------------
    pianoGame: {
        badge: "THỬ THÁCH 1 / 3",
        title: "Piano Tiles Hoài Niệm 🎹",
        subtitle: "Bấm vào các nốt nhạc piano rơi xuống theo nhịp điệu. Bấm trượt hoặc để rơi quá 5 lần sẽ thua nhé!",
        targetScore: 20,
        maxMisses: 5
    },

    // -------------------------------------------------------------
    // 5. MÀN 3 - THỬ THÁCH 2: GHI NHỚ NỐT NHẠC (SIMON MEMORY PIANO)
    // -------------------------------------------------------------
    memoryGame: {
        badge: "THỬ THÁCH 2 / 3",
        title: "Thử Thách Nhớ Nốt Nhạc 🎵",
        subtitle: "Lắng nghe giai điệu và lặp lại chính xác từng nốt. Vòng 1 (6 nốt) • Vòng 2 (8 nốt) • Vòng 3 (10 nốt). Nhớ sai 3 lần sẽ bị loại!",
        rounds: [6, 8, 10],
        maxErrors: 3
    },

    // -------------------------------------------------------------
    // 6. MÀN 3 - THỬ THÁCH 3: FLAPPY MELODY (CHƠI NHƯ FLAPPY BIRDS)
    // -------------------------------------------------------------
    flappyGame: {
        badge: "THỬ THÁCH 3 / 3",
        title: "Flappy Melody 🕊️",
        subtitle: "Chạm màn hình, click chuột hoặc ấn phím Space để bay qua 10 cột chướng ngại vật mở khóa bức thư!",
        targetScore: 10
    },

    // -------------------------------------------------------------
    // 7. TRÒ CHƠI BÍ MẬT (KHI ẤN NGÔI SAO DƯỚI GÓC TRÁI): HOA ĐẸP NHẤT
    // -------------------------------------------------------------
    flowerGame: {
        badge: "TRÒ CHƠI BÍ MẬT ⭐",
        title: "Đoán Bông Hoa Đẹp Nhất 🌸",
        subTitle: "Trong các loài hoa dưới đây, theo bạn bông hoa nào là đẹp nhất?",
        attemptsLabel: "LƯỢT CHỌN:",
        selectTag: "CHỌN BÔNG NÀY",

        // Danh sách 12 loài hoa
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

        // 3 câu phản hồi khi người dùng bấm chọn 3 lần đầu
        failMessages: [
            "Hoa này rất đẹp, nhưng vẫn chưa phải đáp án chính xác đâu nha. Thử chọn lại xem sao!",
            "Vẫn chưa chính xác nè. Bông hoa đẹp nhất không nằm trong số này đâu. Bạn chọn tiếp thử đi!",
            "Vẫn chưa đúng rồi. Thật ra không có loài hoa tự nhiên nào ở đây là đẹp nhất cả..."
        ],

        // Màn Bật Mí Sau 3 Lần Chọn Kèm Album 8 Ảnh (anh11 -> anh18)
        conclusion: {
            badge: "BẬT MÍ BÍ MẬT 💖",
            title: "THẬT RA TRẦN THỊ THANH BÌNH LÀ BÔNG HOA ĐẸP NHẤT",
            subtitle: "Mỗi loài hoa có một vẻ đẹp riêng, nhưng với mình, bạn luôn là điều tuyệt vời nhất.",
            message: "Hoa đẹp đến đâu rồi cũng có lúc tàn, nhưng nét duyên dáng, sự chân thành và nụ cười rạng rỡ của bạn luôn để lại ấn tượng đẹp nhất. Chúc bạn luôn tự tin, tỏa sáng và hạnh phúc theo cách của riêng mình nhé.",
            photoCounterLabel: "BỨC ẢNH",
            images: [
                "images/anh11.png",
                "images/anh12.png",
                "images/anh13.png",
                "images/anh14.png",
                "images/anh15.png",
                "images/anh16.png",
                "images/anh17.png",
                "images/anh18.png"
            ],
            btnText: "ĐÓNG LỜI NHẮN BÍ MẬT"
        }
    },

    // -------------------------------------------------------------
    // 8. MÀN BÁNH KEM & THỔI NẾN ƯỚC NGUYỆN (SAU KHI THẮNG GAME 3)
    // -------------------------------------------------------------
    cakeGame: {
        badge: "ƯỚC NGUYỆN TUỔI MỚI 🎂",
        title: "Thổi Nến Sinh Nhật",
        hint: "Nhắm mắt ước một điều ước cho tuổi mới, sau đó chạm vào ngọn nến để thổi tắt nhé.",
        blowHint: "Chạm vào ngọn nến để thổi tắt và mở khóa Bức Thư",
        blownSuccessHint: "Điều ước đã được gửi đi. Đang mở bức thư..."
    },

    // -------------------------------------------------------------
    // 6. MÀN 4: BỨC THƯ MÁY ĐÁNH CHỮ & CON DẤU SÁP
    // -------------------------------------------------------------
    secretLetter: {
        archiveCode: "ARCHIVE NO. 1009-2006",
        title: "BẢN GHI KỶ NIỆM",
        date: "Hà Nội, Ngày 10 Tháng 09 Năm 2026",
        greeting: "Gửi Bìm,",
        paragraphs: [
            "Hôm nay là sinh nhật của bạn rồi.",
            "Thật sự là không thể ngờ rằng, người ngồi cạnh mình ngày hôm ấy lại trở thành người yêu mình, và cùng mình đi tới tận gần 3 năm rồi.",
            "Trong thời gian đó, mình biết bạn đã bao lần khổ tâm vì sự vô ý của mình, nhưng bạn vẫn còn ở lại bên mình.",
            "Chúc tuổi mới siêu cấp xinh đẹp, mạnh khỏe, hạnh phúc, pass mọi chứng chỉ và công ty bạn apply, và nhớ không giận người yêu nhiều như tuổi 1x nhé!",
            "Và đừng quên chúng ta có hẹn đi chơi vào tối thứ 7 nhaaaaaaa!",
            "Chúc mừng sinh nhật người đẹp nhất trần gian"
        ],
        signature: "Thế Đại",
        stampMonogram: "BIM",
        stampSub: "2006",
        stampCounterLabel: "LƯỢT ĐÓNG DẤU:"
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
