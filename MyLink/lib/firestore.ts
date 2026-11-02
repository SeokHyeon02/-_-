import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy,
  query, runTransaction, serverTimestamp, updateDoc,
  type Firestore,
} from "firebase/firestore";
import type { LinkItem, PublicProfile } from "@/lib/types";
import { normalizeUsername, usernameError, validateLink } from "@/lib/validation";

const profileRef = (db: Firestore, uid: string) => doc(db, "users", uid, "profile", "public");
const linksRef = (db: Firestore, uid: string) => collection(db, "users", uid, "links");
const usernameRef = (db: Firestore, username: string) => doc(db, "usernames", username);

export async function loadProfile(db: Firestore, uid: string): Promise<PublicProfile | null> {
  const result = await getDoc(profileRef(db, uid));
  if (!result.exists()) return null;
  const data = result.data();
  return {
    username: String(data.username || ""),
    displayName: String(data.displayName || ""),
    bio: String(data.bio || ""),
  };
}

export async function loadLinks(db: Firestore, uid: string): Promise<LinkItem[]> {
  const results = await getDocs(query(linksRef(db, uid), orderBy("createdAt", "desc")));
  return results.docs.map((d) => ({
    id: d.id,
    title: String(d.data().title ?? ""),
    url: String(d.data().url ?? ""),
  }));
}

export async function savePublicProfile(
  db: Firestore, uid: string, profile: PublicProfile
): Promise<PublicProfile> {
  const username = normalizeUsername(profile.username);
  const error = usernameError(username);
  if (error) throw new Error(error);
  if (!profile.displayName.trim()) throw new Error("표시 이름을 입력해주세요.");
  if (profile.displayName.trim().length > 50) throw new Error("표시 이름은 50자 이하로 입력해주세요.");
  if (profile.bio.length > 300) throw new Error("소개글은 300자 이하로 입력해주세요.");

  const data = { username, displayName: profile.displayName.trim(), bio: profile.bio.trim() };
  await runTransaction(db, async (tx) => {
    const ref = profileRef(db, uid);
    const currentProfile = await tx.get(ref);
    const old = currentProfile.exists() ? String(currentProfile.data().username ?? "") : "";
    const claimRef = usernameRef(db, username);
    const existingClaim = await tx.get(claimRef);
    const oldClaimRef = old && old !== username ? usernameRef(db, old) : null;
    const oldClaim = oldClaimRef ? await tx.get(oldClaimRef) : null;

    if (existingClaim.exists() && existingClaim.data().userId !== uid) {
      throw new Error("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
    }
    if (!existingClaim.exists()) tx.set(claimRef, { userId: uid });
    if (oldClaimRef && oldClaim?.exists() && oldClaim.data().userId === uid) {
      tx.delete(oldClaimRef);
    }
    tx.set(ref, {
      ...data,
      createdAt: currentProfile.exists() ? (currentProfile.data().createdAt ?? serverTimestamp()) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  return data;
}

export async function addLink(db: Firestore, uid: string, title: string, url: string) {
  const error = validateLink(title, url);
  if (error) throw new Error(error);
  return addDoc(linksRef(db, uid), {
    title: title.trim(), url: url.trim(), createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
}

export async function editLink(db: Firestore, uid: string, id: string, title: string, url: string) {
  const error = validateLink(title, url);
  if (error) throw new Error(error);
  await updateDoc(doc(db, "users", uid, "links", id), {
    title: title.trim(), url: url.trim(), updatedAt: serverTimestamp(),
  });
}

export async function removeLink(db: Firestore, uid: string, id: string) {
  await deleteDoc(doc(db, "users", uid, "links", id));
}

export async function resolvePublicPage(db: Firestore, username: string) {
  if (usernameError(username)) return null;
  const ownership = await getDoc(usernameRef(db, username));
  if (!ownership.exists()) return null;
  const uid = String(ownership.data().userId || "");
  if (!uid) return null;
  const profile = await loadProfile(db, uid);
  if (!profile || profile.username !== username) return null;
  const links = await loadLinks(db, uid);
  return { profile, links };
}
