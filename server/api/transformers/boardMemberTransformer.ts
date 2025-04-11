import type { MemberRequest, ParsedMember } from '~/types/api/member';

export function transformMemberData(data: { [member: string]: MemberRequest }, baseURL: string): ParsedMember | null {
  if (!data) return null;
  const { member, role } = data;

  console.log(member.news_items);

  return {
    firstName: member.first_name,
    familyName: member.family_name,
    profilePic: member.profile_picture?.url,
    heroPic: member.hero_image?.[0].url,
    slug: member.slug,
    district: member.district,
    title: member.title,
    role,
    slogan: member.slogan,
    about: member.about,
    goals: member.goals,
    email: member.email,
    news: member.news_items,
    ...(member.facebook && { facebook: member.facebook }),
    ...(member.twitter && { twitter: member.twitter }),
  };
}
