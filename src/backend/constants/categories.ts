/** Course catalog categories shown as tabs on /courses */
export const COURSE_CATEGORIES = [
  "Business",
  "Projects",
  "Strategy",
  "Innovation",
  "Finance",
  "Skills",
  "Governance",
  "Sustain.",
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

export function isCourseCategory(value: string): value is CourseCategory {
  return (COURSE_CATEGORIES as readonly string[]).includes(value);
}
