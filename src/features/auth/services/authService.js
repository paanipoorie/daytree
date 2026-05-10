// Placeholder auth service.
// Later these functions will call Express routes and store JWTs safely.
export async function loginUser(credentials) {
  return {
    id: crypto.randomUUID(),
    email: credentials.email,
  };
}

export async function signupUser(credentials) {
  return {
    id: crypto.randomUUID(),
    email: credentials.email,
  };
}
