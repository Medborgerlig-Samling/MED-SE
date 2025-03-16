import type { MemberRequest, ParsedMember } from '~/types/api/member';

export function transformMemberData(data: { [member: string]: MemberRequest }, baseURL: string): ParsedMember | null {
  if (!data) return null;
  const { member } = data;

  return {
    firstName: member.first_name,
    familyName: member.family_name,
    profilePic: `${baseURL}${member.profile_picture?.url}`,
    heroPic: `${baseURL}${member.hero?.url}`,
    slug: member.slug,
    title: member.title,
    district: member.district,
    slogan: member.slogan,
    about: member.about,
    goals: member.goals,
    email: member.email,
    ...(member.facebook && { facebook: member.facebook }),
    ...(member.twitter && { twitter: member.twitter }),
  };
}
