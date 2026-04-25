import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.svg"
              alt="Huyên Korean"
              width={186}
              height={50}
              className="h-11 w-auto"
            />
            <span className="sr-only">Huyên Korean</span>
            <p className="mt-2 text-sm text-on-surface-variant max-w-xs">
              Nền tảng học tiếng Hàn toàn diện — theo cấp độ TOPIK, có phân
              tích ngữ pháp và luyện tập tương tác.
            </p>

            {/* Made with love badge */}
            <p className="mt-4 text-xs text-on-surface-variant/70 flex items-center gap-1">
              <span>Made with</span>
              <span className="text-primary" aria-hidden="true">♥</span>
              <span>in Vietnam</span>
            </p>

            <p className="mt-2 text-xs text-on-surface-variant/70">
              © 2025 Huyên Korean. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
                Nền tảng
              </p>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>
                  <Link href="/vocabulary" className="hover:text-primary transition-colors duration-150 cursor-pointer">
                    Từ vựng
                  </Link>
                </li>
                <li>
                  <Link href="/grammar" className="hover:text-primary transition-colors duration-150 cursor-pointer">
                    Ngữ pháp
                  </Link>
                </li>
                <li>
                  <Link href="/games" className="hover:text-primary transition-colors duration-150 cursor-pointer">
                    Luyện tập
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
                Thông tin
              </p>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors duration-150 cursor-pointer">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors duration-150 cursor-pointer">
                    Chính sách
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors duration-150 cursor-pointer">
                    Văn hoá Hàn Quốc
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
