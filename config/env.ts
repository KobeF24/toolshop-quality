function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}: copy .env.example to .env.local and fill it in`);
  }
  return value;
}

export const env = {
  get customer() {
    return { email: required('CUSTOMER_EMAIL'), password: required('CUSTOMER_PASSWORD') };
  },
};
