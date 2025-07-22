export function ObscureEmail(email: any) {
  // Split the email address into local and domain parts
  const [localPart, domain] = email.split('@');

  // Replace characters in the local part with asterisks
  const obscuredLocalPart =
    localPart.substring(0, 1) +
    '******' +
    // '*'.repeat(localPart.length - 2) +
    localPart.slice(-2);

  // Recreate the obscured email address
  const obscuredEmail = `${obscuredLocalPart}@${domain}`;

  return obscuredEmail;
}
