/** Avatar par défaut selon le genre (silhouette + couleur distinctes). */
export function defaultAvatar(gender?: string | null): string {
  if (gender === "female") return "/images/users/avatar-female.svg";
  if (gender === "male") return "/images/users/avatar-male.svg";
  return "/images/users/avatar.svg";
}
