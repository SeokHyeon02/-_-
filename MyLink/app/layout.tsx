import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MyLink | 나를 소개하는 하나의 링크", template: "%s | MyLink" },
  description: "프로필과 소셜 링크를 한 페이지에 모아 공유하세요. MyLink 포트폴리오 실습 프로젝트.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
