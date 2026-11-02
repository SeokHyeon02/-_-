import type { MyLinkData } from "@/lib/types";

const KEY = "mylink-demo-v1";

export const starterData: MyLinkData = {
  profile: {
    username: "mylink",
    displayName: "나의 마이링크",
    bio: "",
  },
  links: [
    { id: "sample-1", title: "Instagram", url: "https://www.instagram.com/" },
    { id: "sample-2", title: "YouTube", url: "https://www.youtube.com/" },
    { id: "sample-3", title: "GitHub", url: "https://github.com/" },
    { id: "sample-4", title: "My Blog", url: "https://blog.naver.com/" },
  ],
};

export function getDemo(): MyLinkData {
  if (typeof window === "undefined") return starterData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return starterData;
    const parsed = JSON.parse(raw) as Partial<MyLinkData>;
    if (!parsed.profile || !Array.isArray(parsed.links)) return starterData;
    return {
      profile: {
        ...starterData.profile,
        displayName: String(parsed.profile.displayName ?? starterData.profile.displayName),
        bio: String(parsed.profile.bio ?? starterData.profile.bio),
        username: "mylink",
      },
      links: parsed.links.filter((v): v is LinkItemLike =>
        !!v && typeof v.id === "string" && typeof v.title === "string" &&
        typeof v.url === "string" && /^https?:\/\//.test(v.url)
      ),
    };
  } catch {
    return starterData;
  }
}

type LinkItemLike = MyLinkData["links"][number];

export function saveDemo(data: MyLinkData) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(data));
}
