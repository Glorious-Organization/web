import Link from "next/link";
import Image from "next/image";
import HeroStats from "@/components/ui/HeroStats";
import ScrollReveal from "@/components/ui/ScrollReveal";

const featuredLessons = [
  {
    title: "Chào hỏi cơ bản",
    level: "TOPIK 1",
    levelColor: "bg-primary-container text-on-primary-container",
    duration: "15 phút",
    desc: "Học cách chào hỏi, giới thiệu bản thân trong tiếng Hàn.",
    photo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=75",
    photoAlt: "Korean traditional gate/architecture",
  },
  {
    title: "Thì quá khứ & hiện tại",
    level: "TOPIK 2",
    levelColor: "bg-secondary-container text-on-secondary-container",
    duration: "25 phút",
    desc: "Nắm vững cách chia động từ theo thì trong tiếng Hàn.",
    photo: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&q=75",
    photoAlt: "Seoul cityscape at dusk",
  },
  {
    title: "Biểu đạt cảm xúc",
    level: "TOPIK 3",
    levelColor: "bg-tertiary-container text-on-tertiary-container",
    duration: "20 phút",
    desc: "Diễn tả cảm xúc phong phú bằng từ vựng và cấu trúc nâng cao.",
    photo: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&q=75",
    photoAlt: "Traditional Korean architecture",
  },
];


const floatingChars = [
  { char: "한", size: "text-9xl", top: "8%", right: "4%", opacity: 0.18, delay: "0s" },
  { char: "국", size: "text-7xl", top: "25%", right: "14%", opacity: 0.14, delay: "1.5s" },
  { char: "어", size: "text-8xl", top: "52%", right: "6%", opacity: 0.20, delay: "3s" },
  { char: "학", size: "text-6xl", top: "68%", right: "18%", opacity: 0.12, delay: "4.5s" },
  { char: "습", size: "text-7xl", top: "15%", right: "26%", opacity: 0.10, delay: "2.2s" },
  { char: "문", size: "text-6xl", top: "38%", right: "28%", opacity: 0.08, delay: "0.8s" },
  { char: "법", size: "text-8xl", top: "75%", right: "32%", opacity: 0.10, delay: "3.8s" },
  { char: "단", size: "text-6xl", top: "55%", right: "22%", opacity: 0.13, delay: "1.2s" },
  { char: "어", size: "text-7xl", top: "42%", right: "42%", opacity: 0.07, delay: "2.7s" },
];


export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[600px] flex items-end pb-16 px-6 overflow-hidden">
        {/* Real photo background */}
        <Image
          src="https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1400&q=80"
          alt=""
          fill
          priority
          className="object-cover"
          aria-hidden="true"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(30,45,70,0.85) 0%, rgba(78,96,127,0.75) 50%, rgba(102,88,130,0.6) 100%)",
          }}
        />

        {/* Floating Korean characters */}
        {floatingChars.map(({ char, size, top, right, opacity, delay }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute font-headline font-bold pointer-events-none select-none ${size} animate-[han-drift_8s_ease-in-out_infinite]`}
            style={{ top, right, opacity, animationDelay: delay, color: "#fff" }}
          >
            {char}
          </span>
        ))}

        <div className="relative max-w-7xl mx-auto w-full">
          <span className="font-label inline-block text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">
            Huyên Korean
          </span>
          <h1
            className="font-headline font-extrabold text-5xl md:text-7xl text-white leading-tight tracking-tight max-w-2xl animate-[fade-in-up_0.8s_ease-out_0.2s_both]"
          >
            Học tiếng Hàn<br />thật đơn giản.
          </h1>
          <p
            className="mt-4 text-white/75 text-lg max-w-md font-body animate-[fade-in-up_0.8s_ease-out_0.4s_both]"
          >
            Từ vựng, ngữ pháp, phân tích câu — mọi thứ bạn cần để chinh phục TOPIK.
          </p>
          <div
            className="mt-8 flex flex-wrap gap-3 animate-[fade-in-up_0.8s_ease-out_0.6s_both]"
          >
            <Link
              href="/vocabulary"
              className="btn-pulse-glow bg-surface-container-lowest text-primary font-bold px-6 py-3 rounded-full shadow-xl hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Bắt đầu học
            </Link>
            <Link
              href="/grammar"
              className="border border-white/30 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Khám phá ngữ pháp
            </Link>
          </div>

          {/* Stats bar — animated count-up */}
          <HeroStats />
        </div>
      </section>

      {/* ── Featured Lessons ── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="font-label text-xs font-semibold uppercase tracking-widest text-primary">
                Gợi ý cho bạn
              </span>
              <h2 className="font-headline font-bold text-3xl text-on-surface mt-1 tracking-tight">
                Bài học nổi bật
              </h2>
            </div>
          </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLessons.map((lesson, idx) => (
              <ScrollReveal key={lesson.title} delay={idx * 100}>
              <div
                className="card-shimmer bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all duration-200 cursor-pointer group"
              >
                {/* Photo thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={lesson.photo}
                    alt={lesson.photoAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${lesson.levelColor}`}>
                      {lesson.level}
                    </span>
                    <span className="font-label text-xs text-on-surface-variant">{lesson.duration}</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">{lesson.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant mt-1">{lesson.desc}</p>
                  <Link
                    href="/vocabulary"
                    className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:underline transition-colors duration-150 cursor-pointer"
                  >
                    Bắt đầu
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <ScrollReveal variant="scale">
        <div className="card-shimmer bg-primary-container rounded-3xl px-8 py-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          {/* Subtle background shimmer */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 90% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="font-headline font-bold text-3xl text-on-primary-container tracking-tight">
              Học mọi lúc, mọi nơi
            </h2>
            <p className="font-body text-on-primary-container/70 mt-2 max-w-sm">
              Lưu từ vựng, ngữ pháp yêu thích vào sổ tay cá nhân. Học theo cách của bạn.
            </p>
            <ul className="mt-4 space-y-2">
              {["Phân loại theo TOPIK 1–6", "Phân tích câu tức thì", "Flashcard luyện tập"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-on-primary-container/80 font-body">
                    <span className="material-symbols-outlined text-sm text-on-primary-container">
                      check_circle
                    </span>
                    {f}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/vocabulary"
              className="inline-block mt-6 bg-primary text-on-primary font-bold px-6 py-3 rounded-full shadow hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Khám phá ngay
            </Link>
          </div>

          {/* Korean study visual */}
          <div className="relative shrink-0 w-64 h-48 hidden md:block">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=70"
                alt=""
                fill
                className="object-cover opacity-80"
              />
            </div>
            {/* Floating Korean chars decoration */}
            <div className="absolute -top-4 -right-4 font-headline font-bold text-5xl text-primary/20 select-none">론</div>
            <div className="absolute -bottom-2 -left-3 font-headline font-bold text-4xl text-primary/15 select-none">추무</div>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </>
  );
}
