'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('finance-tracker-current-user')) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setFeedback({ type: 'error', message: 'Email dan password wajib diisi.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFeedback({ type: 'error', message: 'Format email tidak valid.' });
      return;
    }

    const savedUsers = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('finance-tracker-users') || '[]') : [];
    const user = savedUsers.find((item) => item.email === form.email.toLowerCase());

    if (!user) {
      setFeedback({ type: 'error', message: 'Akun tidak ditemukan. Anda akan diarahkan ke registrasi.' });
      setTimeout(() => router.push('/auth/register'), 700);
      return;
    }

    if (user.password !== form.password) {
      setFeedback({ type: 'error', message: 'Password salah. Silakan coba lagi.' });
      return;
    }

    localStorage.setItem(
      'finance-tracker-current-user',
      JSON.stringify({ email: user.email, name: user.name })
    );
    setFeedback({ type: 'success', message: 'Login berhasil. Mengarahkan ke dashboard...' });
    setTimeout(() => router.push('/dashboard'), 700);
  };

  return (
    <main style={{ width: '100%', maxWidth: '460px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', padding: '32px' }}>
      <p style={{ margin: 0, color: '#4338ca', fontWeight: 700 }}>Masuk ke akun</p>
      <h1 style={{ margin: '10px 0 8px', fontSize: '1.8rem' }}>Selamat datang kembali</h1>
      <p style={{ margin: '0 0 24px', color: '#64748b' }}>Masukkan email dan password Anda untuk melanjutkan.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="password" style={{ fontWeight: 600 }}>Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="********"
            style={inputStyle}
          />
        </div>

        {feedback.message ? (
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: feedback.type === 'success' ? '#166534' : '#b91c1c',
              fontWeight: 600,
            }}
          >
            {feedback.message}
          </div>
        ) : null}

        <button type="submit" style={{ padding: '12px 16px', border: 0, borderRadius: '12px', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Masuk
        </button>
      </form>

      <p style={{ marginTop: '16px', textAlign: 'center', color: '#64748b' }}>
        Belum punya akun?{' '}
        <Link href="/auth/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
          Daftar sekarang
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
