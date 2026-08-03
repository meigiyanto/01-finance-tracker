import React from 'react';

export const metadata = {
  title: 'Finance Tracker',
  description: 'Kelola pengeluaran dan pemasukan Anda dengan lebih mudah.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f8fafc', color: '#0f172a' }}>
        {children}
      </body>
    </html>
  );
}
