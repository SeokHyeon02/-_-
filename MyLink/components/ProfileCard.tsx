"use client";

import { ArrowUpRight, Github, Globe2, Instagram, Youtube, Link2 } from "lucide-react";
import type { MyLinkData } from "@/lib/types";

function iconFor(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("instagram.com")) return <Instagram size={20} />;
    if (host.includes("youtube.com") || host.includes("youtu.be")) return <Youtube size={20} />;
    if (host.includes("github.com")) return <Github size={20} />;
  } catch { /* URL is validated before saving. */ }
  return <Globe2 size={20} />;
}

export default function ProfileCard({ data, compact = false }: { data: MyLinkData; compact?: boolean }) {
  const { profile, links } = data;
  const initials = (profile.displayName?.trim()?.slice(0, 2) || "MY").toUpperCase();
  return (
    <section className={`profile-card ${compact ? "profile-compact" : ""}`} aria-label="공개 프로필">
      <div className="profile-sprinkle sprinkle-a" /><div className="profile-sprinkle sprinkle-b" />
      <div className="avatar" aria-hidden="true">{initials}</div>
      <div className="profile-name">{profile.displayName || "이름을 입력하세요"}<span className="verified-dot" aria-label="프로필" /></div>
      <p className="profile-username">@{profile.username || "username"}</p>
      <p className="profile-bio">{profile.bio || "여기에 나를 소개하는 한 줄을 적어보세요."}</p>
      <div className="public-link-list">
        {links.length === 0 ? (
          <div className="empty-links"><Link2 size={23}/><span>아직 등록된 링크가 없어요.</span></div>
        ) : links.map((link) => (
          <a className="public-link" href={link.url} target="_blank" rel="noopener noreferrer" key={link.id}>
            <span className="link-logo">{iconFor(link.url)}</span>
            <span className="public-link-title">{link.title}</span>
            <ArrowUpRight size={18} className="link-arrow" />
          </a>
        ))}
      </div>
      <div className="profile-made">made with <span>mylink<span className="brand-period">.</span></span></div>
    </section>
  );
}
