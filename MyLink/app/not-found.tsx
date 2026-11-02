import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
export default function NotFound() {
  return <><SiteHeader/><main className="notfound container"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>찾으시는 페이지가 없어요.</h1><p>주소를 다시 확인하거나 홈으로 돌아가주세요.</p><Link className="button button-primary" href="/"><ArrowLeft size={18}/> 홈으로 돌아가기</Link></main></>;
}
