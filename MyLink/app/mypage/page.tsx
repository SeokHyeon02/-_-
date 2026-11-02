"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { ArrowRight, Copy, Edit3, ExternalLink, Globe2, Link2, LoaderCircle, LogIn, LogOut, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProfileCard from "@/components/ProfileCard";
import { firebaseConfigured, getFirebase } from "@/lib/firebase";
import { getDemo, saveDemo } from "@/lib/demo";
import { addLink, editLink, loadLinks, loadProfile, removeLink, savePublicProfile } from "@/lib/firestore";
import type { LinkItem, MyLinkData, PublicProfile } from "@/lib/types";
import { suggestedUsername, validateLink, usernameError } from "@/lib/validation";

const emptyProfile: PublicProfile = { username: "", displayName: "", bio: "" };
const initialData: MyLinkData = { profile: emptyProfile, links: [] };

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<MyLinkData>(initialData);
  const [draft, setDraft] = useState<PublicProfile>(emptyProfile);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);

  const demoMode = !firebaseConfigured;
  const [origin, setOrigin] = useState("");
  const shareUrl = origin ? `${origin}/${demoMode ? "demo" : data.profile.username}` : "";
  const canShare = demoMode || Boolean(data.profile.username);

  useEffect(() => {
    setOrigin(window.location.origin);
    if (!firebaseConfigured) {
      const demoData = getDemo();
      setData(demoData);
      setDraft(demoData.profile);
      setReady(true);
      return;
    }
    const services = getFirebase();
    if (!services) { setReady(true); return; }
    const unsubscribe = onAuthStateChanged(services.auth, async (nextUser) => {
      setUser(nextUser);
      setNotice(null);
      setEditing(null);
      if (!nextUser) {
        setData(initialData);
        setDraft(emptyProfile);
        setReady(true);
        return;
      }
      try {
        const [savedProfile, savedLinks] = await Promise.all([
          loadProfile(services.db, nextUser.uid), loadLinks(services.db, nextUser.uid),
        ]);
        setData({ profile: savedProfile || emptyProfile, links: savedLinks });
        setDraft(savedProfile || {
          username: suggestedUsername(nextUser.email),
          displayName: nextUser.displayName || "",
          bio: "",
        });
      } catch (err) { setNotice({ text: errorText(err), error: true }); }
      finally { setReady(true); }
    });
    return () => unsubscribe();
  }, []);

  function updateData(next: MyLinkData) {
    setData(next);
    if (demoMode) saveDemo(next);
  }

  async function signIn() {
    const services = getFirebase();
    if (!services) return;
    setBusy(true); setNotice(null);
    try { await signInWithPopup(services.auth, new GoogleAuthProvider()); }
    catch (err) {
      if (!(typeof err === "object" && err !== null && "code" in err && err.code === "auth/popup-closed-by-user")) {
        setNotice({ text: errorText(err), error: true });
      }
    }
    finally { setBusy(false); }
  }

  async function signOutUser() {
    const services = getFirebase();
    if (!services) return;
    setBusy(true);
    try { await signOut(services.auth); }
    catch (err) { setNotice({ text: errorText(err), error: true }); }
    finally { setBusy(false); }
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.displayName.trim()) { setNotice({ text: "표시 이름을 입력해주세요.", error: true }); return; }
    if (draft.displayName.length > 50 || draft.bio.length > 300) {
      setNotice({ text: "이름은 50자, 소개는 300자 이하로 입력해주세요.", error: true }); return;
    }
    if (!demoMode) {
      const error = usernameError(draft.username);
      if (error) { setNotice({ text: error, error: true }); return; }
    }
    setBusy(true); setNotice(null);
    try {
      if (demoMode) {
        const profile = { ...draft, username: "demo" };
        updateData({ ...data, profile });
        setDraft(profile);
      } else {
        const services = getFirebase();
        if (!user || !services) throw new Error("먼저 로그인해주세요.");
        const profile = await savePublicProfile(services.db, user.uid, draft);
        updateData({ ...data, profile }); setDraft(profile);
      }
      setNotice({ text: "프로필이 저장되었습니다." });
    } catch (err) { setNotice({ text: errorText(err), error: true }); }
    finally { setBusy(false); }
  }

  async function submitLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateLink(linkTitle, linkUrl);
    if (error) { setNotice({ text: error, error: true }); return; }
    setBusy(true); setNotice(null);
    try {
      if (demoMode) {
        updateData({ ...data, links: [{ id: `demo-${Date.now()}`, title: linkTitle.trim(), url: linkUrl.trim() }, ...data.links] });
      } else {
        const services = getFirebase();
        if (!user || !services) throw new Error("먼저 로그인해주세요.");
        await addLink(services.db, user.uid, linkTitle, linkUrl);
        updateData({ ...data, links: await loadLinks(services.db, user.uid) });
      }
      setLinkTitle(""); setLinkUrl("");
      setNotice({ text: "링크가 추가되었습니다." });
    } catch (err) { setNotice({ text: errorText(err), error: true }); }
    finally { setBusy(false); }
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const error = validateLink(editTitle, editUrl);
    if (error) { setNotice({ text: error, error: true }); return; }
    setBusy(true); setNotice(null);
    try {
      if (demoMode) {
        updateData({ ...data, links: data.links.map(x => x.id === editing ? { ...x, title: editTitle.trim(), url: editUrl.trim() } : x) });
      } else {
        const services = getFirebase();
        if (!user || !services) throw new Error("먼저 로그인해주세요.");
        await editLink(services.db, user.uid, editing, editTitle, editUrl);
        updateData({ ...data, links: await loadLinks(services.db, user.uid) });
      }
      cancelEdit();
      setNotice({ text: "링크가 수정되었습니다." });
    } catch (err) { setNotice({ text: errorText(err), error: true }); }
    finally { setBusy(false); }
  }

  function beginEdit(link: LinkItem) {
    setEditing(link.id); setEditTitle(link.title); setEditUrl(link.url);
    setNotice(null);
  }
  function cancelEdit() { setEditing(null); setEditTitle(""); setEditUrl(""); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true); setNotice(null);
    try {
      if (demoMode) updateData({ ...data, links: data.links.filter(x => x.id !== deleteTarget.id) });
      else {
        const services = getFirebase();
        if (!user || !services) throw new Error("먼저 로그인해주세요.");
        await removeLink(services.db, user.uid, deleteTarget.id);
        updateData({ ...data, links: await loadLinks(services.db, user.uid) });
      }
      if (editing === deleteTarget.id) cancelEdit();
      setDeleteTarget(null); setNotice({ text: "링크가 삭제되었습니다." });
    } catch (err) { setNotice({ text: errorText(err), error: true }); }
    finally { setBusy(false); }
  }

  async function copyShareUrl() {
    if (!canShare || !shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setNotice({ text: "링크를 클립보드에 복사했습니다." });
    } catch { setNotice({ text: "복사에 실패했습니다. 주소를 직접 선택해 복사해주세요.", error: true }); }
  }

  return (
    <>
      <SiteHeader />
      <main className="dashboard-page container">
        <div className="dash-intro">
          <div><span className="eyebrow">MY CREATIVE SPACE</span><h1>내 공간 관리하기<span className="heading-star">✳</span></h1><p>프로필을 꾸미고, 소중한 링크들을 모아보세요.</p></div>
          {user && <button className="button button-outline button-small" onClick={signOutUser} disabled={busy}><LogOut size={16}/> 로그아웃</button>}
        </div>

        {demoMode && (
          <div className="banner banner-info"><ShieldCheck size={20}/><div><strong>데모 모드입니다.</strong> 입력한 정보는 이 브라우저에만 저장됩니다. 실제 개인별 공유 기능은 Firebase 연결 후 사용할 수 있습니다.</div></div>
        )}
        {notice && <div role="status" className={`banner ${notice.error ? "banner-error" : "banner-success"}`}><span>{notice.error ? "!" : "✓"}</span>{notice.text}<button onClick={() => setNotice(null)} aria-label="알림 닫기"><X size={16}/></button></div>}

        {!ready ? (
          <div className="loading-block"><LoaderCircle size={34} className="spin"/><p>마이링크를 불러오는 중입니다...</p></div>
        ) : (!demoMode && !user) ? (
          <section className="login-card neo-box"><div className="login-illustration"><Globe2 size={50}/></div><span className="eyebrow">WELCOME BACK</span><h2>나만의 링크를 시작해요.</h2><p>Google 계정으로 로그인하면 내 링크가 Firebase에 저장되고, 개인 페이지를 공유할 수 있어요.</p><button className="button button-primary button-large" onClick={signIn} disabled={busy}><LogIn size={20}/>{busy ? "로그인 중..." : "Google로 로그인"}<ArrowRight size={19}/></button></section>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-main">
              <section className="editor-panel neo-box">
                <div className="editor-heading"><div className="editor-num">01</div><div><h2>프로필 편집</h2><p>나를 소개할 기본 정보를 입력해주세요.</p></div></div>
                <form className="form-stack" onSubmit={submitProfile}>
                  <label className="field"><span>나의 URL 아이디 <span className="required">*</span></span><div className="input-prefix"><span>사이트주소/</span><input value={draft.username} disabled={demoMode || busy} onChange={e => setDraft({ ...draft, username: e.target.value })} placeholder="myname" maxLength={24} autoComplete="off"/></div><small>{demoMode ? "데모 주소는 /demo로 고정됩니다." : "영문 소문자, 숫자, _ 및 - / 3~24자 · 중복 불가"}</small></label>
                  <label className="field"><span>표시 이름 <span className="required">*</span></span><input value={draft.displayName} onChange={e => setDraft({ ...draft, displayName: e.target.value })} placeholder="홍길동" maxLength={50} disabled={busy}/></label>
                  <label className="field"><span>소개글</span><textarea value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} rows={4} placeholder="당신을 소개하는 문장을 적어보세요." maxLength={300} disabled={busy}/><small>{draft.bio.length} / 300</small></label>
                  <button className="button button-primary" type="submit" disabled={busy}><Save size={17}/> 프로필 저장</button>
                </form>
              </section>
              <section className="editor-panel neo-box">
                <div className="editor-heading"><div className="editor-num">02</div><div><h2>내 링크 관리 <span className="pill-count">{data.links.length}</span></h2><p>하나의 페이지에 모아 보여줄 링크를 추가해요.</p></div></div>
                <form id="link-form" className="link-add-form" onSubmit={submitLink}>
                  <label className="field"><span>링크 제목 <span className="required">*</span></span><input value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="예: 나의 포트폴리오" maxLength={80} disabled={busy}/></label>
                  <label className="field"><span>링크 주소 <span className="required">*</span></span><input type="text" inputMode="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com" disabled={busy}/></label>
                  <div className="form-actions"><button type="submit" className="button button-dark" disabled={busy}><Plus size={18}/> 링크 추가하기</button></div>
                </form>
                <div className="managed-list-header"><h3>추가한 링크</h3><span>{data.links.length}개의 링크</span></div>
                {data.links.length === 0 ? <div className="managed-empty"><Link2 size={26}/><p>등록된 링크가 없어요. 첫 링크를 추가해보세요!</p></div> :
                  <ul className="managed-list">{data.links.map(item => <li className={`managed-item ${editing === item.id ? "managed-item-edit" : ""}`} key={item.id}>{editing === item.id ? (
                    <form className="managed-edit" onSubmit={submitEdit}>
                      <label className="field"><span>제목 수정</span><input value={editTitle} onChange={e=>setEditTitle(e.target.value)} maxLength={80} disabled={busy}/></label>
                      <label className="field"><span>주소 수정</span><input type="text" inputMode="url" value={editUrl} onChange={e=>setEditUrl(e.target.value)} disabled={busy}/></label>
                      <div className="inline-edit-actions"><button type="submit" className="button button-primary button-small" disabled={busy}><Save size={15}/> 저장</button><button type="button" className="button button-outline button-small" disabled={busy} onClick={cancelEdit}>취소</button></div>
                    </form>
                  ) : <><div className="managed-icon"><Link2 size={19}/></div><div className="managed-meta"><strong>{item.title}</strong><small>{item.url}</small></div><div className="managed-actions"><button type="button" title="링크 수정" aria-label={`${item.title} 수정`} onClick={() => beginEdit(item)} disabled={busy}><Edit3 size={17}/></button><button type="button" className="danger-icon" title="링크 삭제" aria-label={`${item.title} 삭제`} onClick={() => setDeleteTarget(item)} disabled={busy}><Trash2 size={17}/></button></div></>}</li>)}</ul>}
              </section>
            </div>
            <aside className="dashboard-aside">
              <div className="aside-heading"><div><span className="eyebrow">LIVE PREVIEW</span><h2>이렇게 보여요 <span>↘</span></h2></div><span className="preview-dot"/></div>
              <div className="preview-frame"><ProfileCard data={{ profile: { ...draft, username: data.profile.username || (demoMode ? "demo" : draft.username) }, links: data.links }} compact /></div>
              <div className="share-panel neo-box"><div className="share-title"><Globe2 size={20}/><strong>공유 링크</strong></div><p>{canShare ? "아래 주소로 내 페이지를 확인해보세요." : "먼저 프로필을 저장해 URL을 생성해주세요."}</p><div className="share-url"><span>{canShare ? shareUrl : "프로필 저장 후 생성됩니다"}</span><button type="button" aria-label="공유 주소 복사" onClick={copyShareUrl} disabled={!canShare}><Copy size={18}/></button></div>{canShare && <Link className="share-open" href={demoMode ? "/demo" : `/${data.profile.username}`} target="_blank">페이지 열어보기 <ExternalLink size={16}/></Link>}{demoMode && <small>데모 URL은 누구나 열 수 있지만 수정 내용은 이 브라우저에만 보입니다.</small>}</div>
            </aside>
          </div>
        )}
      </main>
      <footer className="footer container"><span>© 2026 MyLink · Class Project</span><span>Build your space, your way.</span></footer>
      {deleteTarget && (
        <div className="modal-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !busy) setDeleteTarget(null); }}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc" className="modal-card neo-box"><div className="modal-symbol"><Trash2 size={26}/></div><h2 id="delete-title">정말 삭제하시겠습니까?</h2><p id="delete-desc"><strong>“{deleteTarget.title}”</strong> 링크가 삭제됩니다.<br/>이 작업은 되돌릴 수 없습니다.</p><div className="modal-actions"><button className="button button-outline" onClick={() => setDeleteTarget(null)} disabled={busy}>취소</button><button className="button button-danger" onClick={confirmDelete} disabled={busy}><Trash2 size={17}/>{busy ? "삭제 중..." : "삭제하기"}</button></div></div>
        </div>
      )}
    </>
  );
}

function errorText(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("auth/unauthorized-domain")) return "Firebase 인증의 승인된 도메인에 현재 Vercel 주소를 추가해주세요.";
    if (err.message.includes("auth/popup-blocked")) return "팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 시도해주세요.";
    if (err.message.includes("permission-denied") || err.message.includes("Missing or insufficient permissions")) return "Firebase Firestore 보안 규칙 및 로그인 상태를 확인해주세요.";
    return err.message;
  }
  return "처리 중 문제가 발생했습니다. 잠시 뒤 다시 시도해주세요.";
}
