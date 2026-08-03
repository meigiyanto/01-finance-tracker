'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setFeedback({ type: 'error', message: 'Nama, email, dan password wajib diisi.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFeedback({ type: 'error', message: 'Format email tidak valid.' });
      return;
    }

    if (form.password.length < 8) {
      setFeedback({ type: 'error', message: 'Password minimal 8 karakter.' });
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('finance-tracker-users') || '[]');
    if (savedUsers.some((item) => item.email === form.email.toLowerCase())) {
      setFeedback({ type: 'error', message: 'Email sudah terdaftar. Silakan masuk.' });
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email.toLowerCase(),
      password: form.password,
    };
    savedUsers.push(newUser);
    localStorage.setItem('finance-tracker-users', JSON.stringify(savedUsers));
    localStorage.setItem('finance-tracker-current-user', JSON.stringify({ email: newUser.email, name: newUser.name }));

    setFeedback({ type: 'success', message: 'Registrasi berhasil. Mengarahkan ke dashboard...' });
    setTimeout(() => router.push('/dashboard'), 700);
  };

  return (
    <main style={{ width: '100%', maxWidth: '460px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', padding: '32px' }}>
      <p style={{ margin: 0, color: '#4338ca', fontWeight: 700 }}>Buat akun</p>
      <h1 style={{ margin: '10px 0 8px', fontSize: '1.8rem' }}>Mulai kelola keuangan Anda</h1>
      <p style={{ margin: '0 0 24px', color: '#64748b' }}>Buat akun baru untuk memulai melacak pemasukan dan pengeluaran.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="name" style={{ fontWeight: 600 }}>Nama Lengkap</label>
          <input id="name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nama Anda" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>Email</label>
          <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="password" style={{ fontWeight: 600 }}>Password</label>
          <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Minimal 8 karakter" style={inputStyle} />
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
