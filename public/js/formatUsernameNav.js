function formatUsernameNav(username) {
  if (!username) return "Account";
  return username.charAt(0).toUpperCase() + username.slice(1);
}
