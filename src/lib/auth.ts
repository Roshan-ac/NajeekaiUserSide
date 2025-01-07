// Dummy user for testing
export const DEMO_USER = {
  email: "demo@example.com",
  password: "demo1234",
  name: "Demo User",
  role: "client",
};

export function login(email: string, password: string) {
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    localStorage.setItem("user", JSON.stringify(DEMO_USER));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("user");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!getUser();
}
