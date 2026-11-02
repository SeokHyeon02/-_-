export type LinkItem = { id: string; title: string; url: string };
export type PublicProfile = {
  username: string;
  displayName: string;
  bio: string;
};
export type MyLinkData = { profile: PublicProfile; links: LinkItem[] };
