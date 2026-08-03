import Link from 'next/link';

export default function AuthPage() {
  return (
    <main style={{ width: '100%', maxWidth: '460px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', padding: '32px' }}>
      <p style={{ margin: 0, color: '#4338ca', fontWeight: 700 }}>Finance Tracker</p>
      <h1 style={{ margin: '12px 0 8px', fontSize: '1.8rem' }}>Selamat datang</h1>
      <p style={{ margin: '0 0 24px', color: '#64748b', lineHeight: 1.6 }}>
        Masuk untuk melihat dashboard keuangan Anda atau buat akun baru jika belum memiliki akun.
      </p>

      <div style={{ display: 'grid', gap: '12px' }}>
        <Link href="/auth/login" style={{ textDecoration: 'none', textAlign: 'center', padding: '12px 16px', borderRadius: '12px', background: '#2563eb', color: '#fff', fontWeight: 700 }}>
          Masuk
        </Link>
        <Link href="/auth/register" style={{ textDecoration: 'none', textAlign: 'center', padding: '12px 16px', borderRadius: '12px', background: '#f1f5f9', color: '#0f172a', fontWeight: 700 }}>
          Daftar
        </Link>
      </div>
    </main>
  );
}
