export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', padding: '24px', background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)' }}>
      <section style={{ maxWidth: '1100px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '48px 32px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'center' }}>
          <div>
            <p style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '999px', background: '#e0e7ff', color: '#4338ca', fontWeight: 700, marginBottom: '16px' }}>
              Finance Tracker
            </p>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 16px', lineHeight: 1.2 }}>
              Pantau keuangan Anda dengan lebih sederhana dan terarah.
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', marginBottom: '24px', lineHeight: 1.7 }}>
              Lacak pemasukan, pengeluaran, dan target tabungan Anda dari satu tempat. Cocok untuk pribadi maupun tim yang ingin mengelola finansial lebih cerdas.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/dashboard" style={{ textDecoration: 'none', background: '#2563eb', color: 'white', padding: '12px 18px', borderRadius: '10px', fontWeight: 700 }}>
                Lihat Dashboard
              </a>
              <a href="/auth" style={{ textDecoration: 'none', background: '#f1f5f9', color: '#0f172a', padding: '12px 18px', borderRadius: '10px', fontWeight: 700 }}>
                Masuk Sekarang
              </a>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <strong>Ringkasan Bulan Ini</strong>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>+12.4%</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Pemasukan</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Rp 18.500.000</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Pengeluaran</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Rp 12.200.000</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: '#dcfce7', color: '#166534' }}>
              Sisa saldo: Rp 6.300.000
            </div>
          </div>
        </div>

        <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          {[
            { title: 'Catat Transaksi', desc: 'Simpan pemasukan dan pengeluaran dengan cepat.' },
            { title: 'Lihat Dashboard', desc: 'Pantau performa keuangan dalam satu tampilan.' },
            { title: 'Capai Target', desc: 'Tetapkan target tabungan dan lihat progresnya.' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
