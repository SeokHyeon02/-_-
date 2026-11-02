export const RESERVED = ["demo", "mypage", "api", "admin", "login", "_next"];

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

export function usernameError(input: string): string | null {
  const name = normalizeUsername(input);
  if (!/^[a-z0-9][a-z0-9_-]{2,23}$/.test(name)) {
    return "아이디는 영문 소문자·숫자로 시작하는 3~24자의 영문/숫자/_/-만 가능합니다.";
  }
  if (RESERVED.includes(name)) return "이 아이디는 사용할 수 없습니다.";
  return null;
}

export function validateLink(title: string, url: string): string | null {
  if (!title.trim()) return "제목을 입력해주세요";
  if (!url.trim()) return "주소를 입력해주세요";
  if (title.trim().length > 80) return "제목은 80자 이하로 입력해주세요";
  if (url.length > 2048) return "주소는 2048자 이하로 입력해주세요";
  try {
    const parsed = new URL(url.trim());
    if (!["https:", "http:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
      return "올바른 주소를 입력해주세요";
    }
    if (parsed.username || parsed.password) return "올바른 주소를 입력해주세요";
    return null;
  } catch {
    return "올바른 주소를 입력해주세요";
  }
}

export function suggestedUsername(email: string | null): string {
  const name = (email?.split("@")[0] || "mylink")
    .toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  if (name.length >= 3 && !RESERVED.includes(name)) return name;
  return "mylink-user";
}
