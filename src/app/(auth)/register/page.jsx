import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main style={{ width: '100%', maxWidth: '460px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', padding: '32px' }}>
      <p style={{ margin: 0, color: '#4338ca', fontWeight: 700 }}>Buat akun</p>
      <h1 style={{ margin: '10px 0 8px', fontSize: '1.8rem' }}>Mulai kelola keuangan Anda</h1>
      <p style={{ margin: '0 0 24px', color: '#64748b' }}>Buat akun baru untuk memulai melacak pemasukan dan pengeluaran.</p>

      <form style={{ display: 'grid', gap: '14px' }}>
        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="name" style={{ fontWeight: 600 }}>Nama Lengkap</label>
          <input id="name" type="text" placeholder="Nama Anda" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>Email</label>
          <input id="email" type="email" placeholder="you@example.com" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="password" style={{ fontWeight: 600 }}>Password</label>
          <input id="password" type="password" placeholder="Minimal 8 karakter" style={inputStyle} />
        </div>

        <button type="submit" style={{ padding: '12px 16px', border: 0, borderRadius: '12px', background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Daftar
        </button>
      </form>

      <p style={{ marginTop: '16px', textAlign: 'center', color: '#64748b' }}>
        Sudah punya akun?{' '}
        <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
          Masuk di sini
        </Link>
      </p>
    </main>
  );
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
};
