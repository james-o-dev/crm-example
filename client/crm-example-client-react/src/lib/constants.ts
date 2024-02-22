// Require at least one lowercase letter, one uppercase letter, one number, and one special character, with a minimum length of 8 characters.
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-])[A-Za-z\d!@#$%^&*()_+-]{8,}$/

// Standard email format. Also includes '+' symbol.
export const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/