"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MyLink 홈">
      <span className="brand-symbol" aria-hidden="true"><span /><span /></span>
      <span>my<span className="brand-accent">link</span><span className="brand-period">.</span></span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Brand />
        <nav aria-label="주 메뉴" className="nav-menu">
          <Link href="/demo" className={pathname === "/demo" ? "nav-link active" : "nav-link"}>미리보기 <ArrowUpRight size={15} /></Link>
          <Link href="/mypage" className="button button-small button-dark"><LayoutDashboard size={17}/> 내 페이지</Link>
        </nav>
      </div>
    </header>
  );
}
