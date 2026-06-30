/** Emails autorizados a acessar o admin (env ADMIN_EMAILS, separados por vírgula). */
export function getAllowedAdminEmails(): string[] {
  return (process.env['ADMIN_EMAILS'] ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdminEmail(email: string): boolean {
  return getAllowedAdminEmails().includes(email.trim().toLowerCase())
}
