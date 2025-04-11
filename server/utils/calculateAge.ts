function calculateAge(personalNumber: string) {
  if (!personalNumber || !/^\d{12}$/.test(personalNumber)) return null;

  const birthYear = parseInt(personalNumber.slice(0, 4), 10);
  const birthMonth = parseInt(personalNumber.slice(4, 6), 10) - 1;
  const birthDay = parseInt(personalNumber.slice(6, 8), 10);

  const birthDate = new Date(birthYear, birthMonth, birthDay);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

  return age;
}

export const shouldHaveDiscount = ({ personalNumber }: { personalNumber: string }) => {
  const DISCOUNT_AGE = 20 as const;
  const age = calculateAge(personalNumber);
  if (!age) return false;
  if (age > DISCOUNT_AGE) return false;
  return true;
};
