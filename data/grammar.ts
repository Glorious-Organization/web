export interface PatternRow {
  subject: string;
  rule: string;
  exampleKorean: string;
  exampleVietnamese: string;
}

export interface ComparisonRow {
  pattern: string;
  register: string;
  canImperative: boolean | null;
  canPast: boolean | null;
  canFuture: boolean | null;
}

export interface GrammarItem {
  id: string;
  pattern: string;
  fullPattern?: string;
  name: string;
  meaning: string;
  structure: string;
  level: number;
  examples: { korean: string; vietnamese: string; highlightWord?: string; explanation?: string }[];
  notes?: string;
  usagePoints?: string[];
  patternRows?: PatternRow[];
  note?: string;
  comparison?: ComparisonRow[];
  relatedIds?: string[];
}

export const grammar: GrammarItem[] = [
  {
    id: "g1",
    pattern: "-아/어/여요",
    name: "Đuôi lịch sự thân mật",
    meaning: "Được dùng trong hội thoại hàng ngày với người quen, lịch sự nhưng không quá trang trọng.",
    structure: "Động từ/Tính từ + 아요/어요/여요",
    level: 1,
    usagePoints: [
      "Dùng trong giao tiếp hàng ngày với người quen, không quá trang trọng nhưng vẫn lịch sự.",
      "Dùng 아요 khi âm tiết cuối có nguyên âm ㅏ hoặc ㅗ.",
      "Dùng 어요 trong tất cả các trường hợp còn lại, dùng 여요 cho 하다.",
    ],
    examples: [
      { korean: "저는 밥을 먹어요.", vietnamese: "Tôi ăn cơm.", highlightWord: "먹어요" },
      { korean: "날씨가 좋아요.", vietnamese: "Thời tiết đẹp.", highlightWord: "좋아요" },
    ],
    notes: "Dùng 아요 khi âm tiết cuối của từ gốc có nguyên âm ㅏ hoặc ㅗ, dùng 어요 trong các trường hợp còn lại.",
    relatedIds: ["g9", "g3"],
  },
  {
    id: "g2",
    pattern: "-(으)면서",
    name: "Hành động đồng thời",
    meaning: "Diễn tả hai hành động xảy ra cùng lúc bởi cùng một chủ thể.",
    structure: "Động từ + (으)면서",
    level: 2,
    usagePoints: [
      "Diễn tả hai hành động xảy ra cùng lúc bởi cùng một chủ thể.",
      "Không thể dùng khi hai mệnh đề có chủ thể khác nhau.",
      "Thêm 으면서 sau âm tiết kết thúc bằng phụ âm, thêm 면서 nếu kết thúc bằng nguyên âm.",
    ],
    examples: [
      { korean: "음악을 들으면서 공부해요.", vietnamese: "Tôi vừa nghe nhạc vừa học bài.", highlightWord: "들으면서" },
      { korean: "걸으면서 전화해요.", vietnamese: "Tôi vừa đi bộ vừa nói chuyện điện thoại.", highlightWord: "걸으면서" },
    ],
    notes: "Chủ thể của hai mệnh đề phải giống nhau.",
    relatedIds: ["g4", "g8"],
  },
  {
    id: "g3",
    pattern: "-기 때문에",
    fullPattern: "V + 기 때문에",
    name: "Lý do / Nguyên nhân",
    meaning: "Diễn tả lý do hoặc nguyên nhân. Thường dùng trong văn viết hoặc các tình huống trang trọng.",
    structure: "Động từ/Tính từ + 기 때문에",
    level: 3,
    usagePoints: [
      "Diễn tả lý do hoặc nguyên nhân của một kết quả nào đó. Thường được dùng trong văn viết hoặc các tình huống trang trọng.",
      "Có mức độ nhấn mạnh nguyên nhân hơn so với cấu trúc -아/어서.",
      "Có thể kết hợp với thì quá khứ -었/았- và thì tương lai -겠-.",
    ],
    patternRows: [
      { subject: "Động/Tính từ (V/A)", rule: "기 때문에", exampleKorean: "가다 → 가기 때문에", exampleVietnamese: "đi → vì đi" },
      { subject: "Động/Tính từ (V/A)", rule: "Có Batchim + 기 때문에", exampleKorean: "먹다 → 먹기 때문에", exampleVietnamese: "ăn → vì ăn" },
      { subject: "Danh từ (N)", rule: "Không Batchim + 이기 때문에", exampleKorean: "의사 → 의사이기 때문에", exampleVietnamese: "bác sĩ → vì là bác sĩ" },
    ],
    note: "Không dùng với câu mệnh lệnh hoặc câu đề nghị (thay bằng -니까).",
    examples: [
      {
        korean: "저는 매운 것을 먹기 때문에 김치를 안 좋아해요.",
        vietnamese: "Tôi không thích Kimchi vì tôi không ăn được đồ cay.",
        highlightWord: "먹기 때문에",
        explanation: "먹다 (ăn) → 먹 + 기 때문에. Động từ kết thúc bằng phụ âm ㄱ, gắn trực tiếp 기 때문에. Đây là lý do được đưa ra một cách rõ ràng, phù hợp văn nói trang trọng.",
      },
      {
        korean: "일이 많기 때문에 이번 주말에 못 쉬어요.",
        vietnamese: "Vì có nhiều việc nên tôi không thể nghỉ ngơi tuần này.",
        highlightWord: "많기 때문에",
        explanation: "많다 (nhiều) → 많 + 기 때문에. Tính từ cũng dùng cùng cách. 이번 주말 = tuần này/cuối tuần này.",
      },
      {
        korean: "공사를 하기 때문에 길이 막힙니다.",
        vietnamese: "Vì đang thi công nên đường bị tắc.",
        highlightWord: "하기 때문에",
        explanation: "하다 (làm/thi công) → 하 + 기 때문에. Kết hợp với 막히다 (bị tắc). Câu này dùng -ㅂ니다 thể hiện văn phong trang trọng.",
      },
      {
        korean: "학생이기 때문에 공부를 열심히 해야 해요.",
        vietnamese: "Vì là học sinh nên phải học tập chăm chỉ.",
        highlightWord: "학생이기 때문에",
        explanation: "학생 (học sinh) là danh từ không có Batchim → 학생 + 이기 때문에. Danh từ luôn dùng 이기 때문에.",
      },
      {
        korean: "의사이기 때문에 병원에서 일해요.",
        vietnamese: "Vì là bác sĩ nên làm việc ở bệnh viện.",
        highlightWord: "의사이기 때문에",
        explanation: "의사 (bác sĩ) + 이기 때문에. 병원에서 = tại bệnh viện (에서 chỉ nơi diễn ra hành động).",
      },
    ],
    comparison: [
      { pattern: "기 때문에", register: "Trang trọng / Viết", canImperative: false, canPast: true, canFuture: false },
      { pattern: "이어서", register: "Nói / Phổ biến", canImperative: false, canPast: true, canFuture: false },
      { pattern: "-(으)니까", register: "Nói / Chủ quan", canImperative: true, canPast: true, canFuture: true },
    ],
    relatedIds: ["g1", "g2", "g9"],
  },
  {
    id: "g4",
    pattern: "-(으)ㄴ/는데",
    name: "Bối cảnh / Tương phản",
    meaning: "Nối hai mệnh đề, cung cấp bối cảnh hoặc thể hiện sự tương phản nhẹ.",
    structure: "Động từ/Tính từ + (으)ㄴ/는데",
    level: 2,
    examples: [
      { korean: "날씨가 좋은데 같이 나갈까요?", vietnamese: "Thời tiết đẹp, mình ra ngoài không?" },
      { korean: "피곤한데 잘 수가 없어요.", vietnamese: "Tôi mệt nhưng không ngủ được." },
    ],
  },
  {
    id: "g5",
    pattern: "-다 하더라도",
    name: "Dù cho / Giả sử",
    meaning: "Diễn tả giả thiết 'dù cho... thì cũng...', nhượng bộ giả thuyết.",
    structure: "Động từ/Tính từ + 다 하더라도",
    level: 4,
    examples: [
      { korean: "어렵다 하더라도 포기하지 않겠습니다.", vietnamese: "Dù có khó thì tôi cũng sẽ không từ bỏ." },
      { korean: "비가 온다 하더라도 갈 거예요.", vietnamese: "Dù trời mưa tôi cũng sẽ đi." },
    ],
  },
  {
    id: "g6",
    pattern: "-(으)ㄹ 수 있다/없다",
    name: "Có thể / Không thể",
    meaning: "Diễn tả khả năng hoặc không thể làm gì đó.",
    structure: "Động từ + (으)ㄹ 수 있다/없다",
    level: 1,
    examples: [
      { korean: "저는 한국어를 할 수 있어요.", vietnamese: "Tôi có thể nói tiếng Hàn." },
      { korean: "지금 만날 수 없어요.", vietnamese: "Bây giờ không thể gặp." },
    ],
  },
  {
    id: "g7",
    pattern: "-아/어 보다",
    name: "Thử làm",
    meaning: "Diễn tả việc thử làm điều gì đó hoặc kinh nghiệm đã trải qua.",
    structure: "Động từ + 아/어 보다",
    level: 2,
    examples: [
      { korean: "김치를 먹어 봤어요?", vietnamese: "Bạn đã thử ăn kimchi chưa?" },
      { korean: "한번 해 보세요.", vietnamese: "Hãy thử một lần xem." },
    ],
  },
  {
    id: "g8",
    pattern: "-(으)려고",
    name: "Ý định / Mục đích",
    meaning: "Diễn tả ý định hoặc mục đích của người nói.",
    structure: "Động từ + (으)려고",
    level: 2,
    examples: [
      { korean: "한국어를 배우려고 학원에 다녀요.", vietnamese: "Tôi đi học thêm để học tiếng Hàn." },
      { korean: "물을 마시려고 일어났어요.", vietnamese: "Tôi đứng dậy để uống nước." },
    ],
  },
  {
    id: "g9",
    pattern: "-아/어야 하다",
    name: "Phải / Cần thiết",
    meaning: "Diễn tả sự bắt buộc, cần thiết phải làm gì đó.",
    structure: "Động từ/Tính từ + 아/어야 하다",
    level: 2,
    examples: [
      { korean: "지금 가야 해요.", vietnamese: "Bây giờ tôi phải đi." },
      { korean: "약을 먹어야 해요.", vietnamese: "Phải uống thuốc." },
    ],
  },
  {
    id: "g10",
    pattern: "-에 따르면",
    name: "Theo / Căn cứ theo",
    meaning: "Diễn tả nguồn thông tin hoặc căn cứ theo điều gì đó.",
    structure: "Danh từ + 에 따르면",
    level: 5,
    examples: [
      { korean: "뉴스에 따르면 내일 비가 온대요.", vietnamese: "Theo tin tức, ngày mai trời sẽ mưa." },
      { korean: "연구에 따르면 운동이 중요합니다.", vietnamese: "Theo nghiên cứu, tập thể dục rất quan trọng." },
    ],
  },
];
