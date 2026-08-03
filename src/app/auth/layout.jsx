export const metadata = {
  title: 'Autentikasi | Finance Tracker',
  description: 'Halaman login dan registrasi finance tracker.',
};

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
      }}
    >
      {children}
    </div>
  );
}
