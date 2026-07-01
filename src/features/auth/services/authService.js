// Placeholder auth service.
// Later these functions will call Express routes and store JWTs safely.
export async function loginUser(credentials) {
  return {
    id: crypto.randomUUID(),
    email: credentials.email,
    displayName: credentials.email.split("@")[0],
    isOnboarded: true,
  };
}

export async function signupUser(credentials) {
  return {
    id: crypto.randomUUID(),
    email: credentials.email,
    isOnboarded: false,
  };
}
