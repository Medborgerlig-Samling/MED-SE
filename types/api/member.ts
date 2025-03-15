export interface ParsedMember {
  slug: string;
  firstName: string;
  familyName: string;
  title: string;
  profilePic: string;
  heroPic: string;
  district: string;
  slogan: string;
  about: string;
  goals: string;
  email: string;
  twitter?: string;
  facebook?: string;
}

export interface MemberRequest {
  first_name: string;
  family_name: string;
  profile_picture?: { url: string };
  hero?: { url: string };
  slug: string;
  title: string;
  district: string;
  slogan: string;
  about: string;
  goals: string;
  email: string;
  twitter?: string;
  facebook?: string;
}
