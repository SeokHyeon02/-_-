import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Database, Link2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProfileCard from "@/components/ProfileCard";
import { starterData } from "@/lib/demo";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> ALL YOUR LINKS, ONE PLACE</span>
            <h1>나를 표현하는<br/><span className="underlined-heading">하나의 링크.</span></h1>
            <p className="hero-lead">인스타그램, 유튜브, 블로그, 포트폴리오까지.<br className="desktop-break" /> 흩어진 나의 공간을 예쁘게 모아 공유하세요.</p>
            <div className="hero-actions">
              <Link href="/mypage" className="button button-primary button-large">지금 시작하기 <ArrowRight size={20}/></Link>
              <Link href="/demo" className="button button-outline button-large">완성 페이지 보기 <ArrowUpRight size={19}/></Link>
            </div>
            <div className="hero-footnote"><span className="mini-check"><Check size={13}/></span> 무료 체험 <span className="dot-separator">·</span> 코딩 없이 링크 관리 <span className="dot-separator">·</span> 모바일 최적화</div>
          </div>
          <div className="hero-visual">
            <div className="hero-deco-circle" />
            <div className="floating-note note-top"><Sparkles size={18}/> 나만의 온라인 명함</div>
            <div className="phone-shell"><div className="phone-topline"><span>●●●</span><span>mylink.page</span><span>↗</span></div><ProfileCard data={starterData} compact /></div>
            <div className="floating-note note-bottom"><span className="note-check"><Check size={16}/></span> 한 번에 링크 공유!</div>
            <div className="hero-cross hero-cross-a">✳</div><div className="hero-cross hero-cross-b">✳</div>
          </div>
        </section>

        <section className="how-section">
          <div className="container">
            <div className="section-heading"><span className="eyebrow">WHAT YOU CAN DO</span><h2>간단하지만, 충분히 멋지게.</h2><p>프로필 설정부터 공유까지. 필요한 기능만 쏙 담았어요.</p></div>
            <div className="feature-grid">
              <div className="feature-card feature-yellow"><div className="feature-number">01 / PROFILE</div><div className="feature-icon"><Sparkles size={30}/></div><h3>나답게 소개하기</h3><p>이름과 소개글을 적고, 나만의 개성 있는 페이지를 완성해요.</p><div className="feature-doodle">ME!</div></div>
              <div className="feature-card feature-lavender"><div className="feature-number">02 / LINKS</div><div className="feature-icon"><Link2 size={30}/></div><h3>모든 링크를 한곳에</h3><p>링크를 추가하고, 수정하고, 삭제하는 일까지 손쉽게 관리해요.</p><div className="feature-doodle">↗↗</div></div>
              <div className="feature-card feature-mint"><div className="feature-number">03 / SHARE</div><div className="feature-icon"><ShieldCheck size={30}/></div><h3>안전하게 공유하기</h3><p>누구나 내 페이지를 볼 수 있지만, 수정할 수 있는 사람은 나뿐이에요.</p><div className="feature-doodle">✓</div></div>
            </div>
          </div>
        </section>
        <section className="cta-section container"><div className="cta-panel"><div><span className="eyebrow">READY TO MAKE YOUR SPACE?</span><h2>이제, 당신의 링크를 모아볼까요?</h2><p>MyLink를 만들고 한 번의 공유로 나를 소개하세요.</p></div><Link href="/mypage" className="button button-dark button-large">내 페이지 만들기 <ArrowRight size={20}/></Link><div className="cta-illustration"><Zap size={94} strokeWidth={1.2}/><Database size={44} strokeWidth={1.3}/></div></div></section>
      </main>
      <footer className="footer container"><span>© 2026 MyLink · Class Project</span><span>Made for sharing, made for you.</span></footer>
    </>
  );
}
