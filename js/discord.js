// Replace with your server's public invite code (the part after discord.gg/)
const INVITE_CODE = 'PASTE-YOUR-INVITE-CODE';

(async function () {
  const el = document.getElementById('memberCount');
  if (!el) return;

  const cacheKey = 'haven-members-v1';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) { el.textContent = cached; return; }

  try {
    const res = await fetch(`https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`);
    if (!res.ok) return;
    const data = await res.json();
    const count = data.approximate_member_count;
    if (typeof count === 'number') {
      const formatted = count.toLocaleString();
      el.textContent = formatted + '+';
      sessionStorage.setItem(cacheKey, formatted + '+');
    }
  } catch { /* silent — keep static fallback */ }
})();
