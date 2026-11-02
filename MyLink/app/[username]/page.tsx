"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle, LoaderCircle } from "lucide-react";
import { Brand } from "@/components/SiteHeader";
import ProfileCard from "@/components/ProfileCard";
import { getDemo } from "@/lib/demo";
import { firebaseConfigured, getFirebase } from "@/lib/firebase";
import { resolvePublicPage } from "@/lib/firestore";
import type { MyLinkData } from "@/lib/types";

export default function PublicPage() {
  const params = useParams<{ username: string }>();
  const username = typeof params.username === "string" ? params.username.toLowerCase() : "";
  const [data, setData] = useState<MyLinkData | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "notfound" | "error">("loading");

  useEffect(() => {
    let alive = true;
    async function load() {
      setStatus("loading");
      if (username === "demo") {
        const demo = getDemo();
        if (alive) { setData(demo); setStatus("found"); }
        return;
      }
      if (!firebaseConfigured) { if (alive) setStatus("notfound"); return; }
      const services = getFirebase();
      if (!services) { if (alive) setStatus("error"); return; }
      try {
        const result = await resolvePublicPage(services.db, username);
        if (alive) { setData(result); setStatus(result ? "found" : "notfound"); }
      } catch { if (alive) setStatus("error"); }
    }
    void load();
    return () => { alive = false; };
  }, [username]);

  return (
    <main className="public-page">
      <div className="public-top"><Brand /><Link href="/" className="public-back"><ArrowLeft size={17}/> 홈으로</Link></div>
      <div className="public-deco public-deco-left">✳</div><div className="public-deco public-deco-right">✦</div>
      {status === "loading" ? <div className="public-message"><LoaderCircle size={32} className="spin"/><p>프로필을 불러오는 중...</p></div> : null}
      {status === "found" && data ? <div className="public-content"><ProfileCard data={data}/></div> : null}
      {(status === "notfound" || status === "error") && <div className="public-message error-public"><AlertCircle size={35}/><h1>{status === "notfound" ? "페이지를 찾을 수 없어요" : "페이지를 불러올 수 없어요"}</h1><p>{status === "notfound" ? "아이디를 확인하거나 새로운 링크 페이지를 만들어보세요." : "Firebase 설정 또는 네트워크 연결을 확인해주세요."}</p><Link href="/" className="button button-primary">메인으로 돌아가기 <ArrowLeft size={18}/></Link></div>}
      <div className="public-footer">MYLINK · LINKS THAT CONNECT US</div>
    </main>
  );
}
