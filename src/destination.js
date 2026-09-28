function validateDestination(value) {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) throw new Error('Enter an absolute HTTP or HTTPS destination URL.');
  let url;
  try { url = new URL(trimmed); } catch { throw new Error('Enter a valid destination URL.'); }
  if (!url.hostname) throw new Error('Enter a destination URL with a hostname.');
  return url.href;
}
module.exports = { validateDestination };
