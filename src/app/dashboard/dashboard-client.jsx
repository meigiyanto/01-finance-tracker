'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const defaultCategories = ['Makan', 'Transport', 'Hiburan', 'Tagihan', 'Belanja', 'Lainnya'];

const initialForm = {
  type: 'pemasukan',
  description: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [form, setForm] = useState(initialForm);
  const [newCategory, setNewCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [savingsTarget, setSavingsTarget] = useState(null);
  const [targetForm, setTargetForm] = useState({ targetAmount: '', currentAmount: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUser = localStorage.getItem('finance-tracker-current-user');
    if (!currentUser) {
      router.replace('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(currentUser);
    setUser(parsedUser);

    const savedTransactions = JSON.parse(
      localStorage.getItem(`finance-tracker-transactions-${parsedUser.email}`) || '[]'
    );
    setTransactions(savedTransactions);

    const savedCategories = JSON.parse(
      localStorage.getItem(`finance-tracker-categories-${parsedUser.email}`) || 'null'
    );
    if (Array.isArray(savedCategories) && savedCategories.length > 0) {
      setCategories(savedCategories);
      setForm((previous) => ({ ...previous, category: previous.category || savedCategories[0] }));
    } else {
      setCategories(defaultCategories);
      setForm((previous) => ({ ...previous, category: previous.category || defaultCategories[0] }));
    }

    const savedTarget = JSON.parse(
      localStorage.getItem(`finance-tracker-target-${parsedUser.email}`) || 'null'
    );
    if (savedTarget) {
      setSavingsTarget(savedTarget);
      setTargetForm({
        targetAmount: savedTarget.targetAmount || '',
        currentAmount: savedTarget.currentAmount || '',
      });
    }
  }, [router]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, item) => {
        const amount = Number(item.amount) || 0;
        if (item.type === 'pemasukan') acc.income += amount;
        else acc.expense += amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      };
    });

    return months.map((month) => {
      const monthTransactions = transactions.filter((item) => item.date?.slice(0, 7) === month.key);
      const income = monthTransactions.reduce(
        (acc, item) => acc + (item.type === 'pemasukan' ? Number(item.amount) || 0 : 0),
        0
      );
      const expense = monthTransactions.reduce(
        (acc, item) => acc + (item.type === 'pengeluaran' ? Number(item.amount) || 0 : 0),
        0
      );

      return { ...month, income, expense };
    });
  }, [transactions]);

  const maxMonthlyValue = useMemo(() => {
    const values = monthlyData.flatMap((item) => [item.income, item.expense]);
    return Math.max(...values, 1);
  }, [monthlyData]);

  const currentBalance = summary.income - summary.expense;
  const targetProgress = useMemo(() => {
    if (!savingsTarget?.targetAmount) return 0;
    const targetAmount = Number(savingsTarget.targetAmount) || 0;
    if (targetAmount <= 0) return 0;
    const currentAmount = Number(savingsTarget.currentAmount ?? currentBalance) || 0;
    return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  }, [currentBalance, savingsTarget]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.description || !form.amount || !form.date) {
      setFeedback('Lengkapi semua detail transaksi.');
      return;
    }

    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setFeedback('Jumlah harus angka positif.');
      return;
    }

    const categoryToUse = form.category?.trim() || (categories[0] || 'Lainnya');
    const nextCategories = categories.includes(categoryToUse)
      ? categories
      : [...categories, categoryToUse];

    const newTransaction = {
      id: Date.now(),
      type: form.type,
      description: form.description,
      amount: amount.toFixed(2),
      date: form.date,
      category: categoryToUse,
    };

    const nextTransactions = [newTransaction, ...transactions];
    setTransactions(nextTransactions);
    localStorage.setItem(`finance-tracker-transactions-${user.email}`, JSON.stringify(nextTransactions));

    if (nextCategories.length !== categories.length) {
      setCategories(nextCategories);
      localStorage.setItem(`finance-tracker-categories-${user.email}`, JSON.stringify(nextCategories));
    }

    setForm({ ...initialForm, date: form.date, category: categoryToUse });
    setNewCategory('');
    setFeedback('Transaksi berhasil ditambahkan.');
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    const nextCategories = categories.includes(trimmed) ? categories : [...categories, trimmed];
    setCategories(nextCategories);
    setForm((previous) => ({ ...previous, category: trimmed }));
    localStorage.setItem(`finance-tracker-categories-${user.email}`, JSON.stringify(nextCategories));
    setNewCategory('');
    setFeedback(`Kategori "${trimmed}" siap digunakan.`);
  };

  const handleSaveTarget = (event) => {
    event.preventDefault();
    if (!targetForm.targetAmount) {
      setFeedback('Tetapkan target tabungan terlebih dahulu.');
      return;
    }

    const parsedTarget = Number(targetForm.targetAmount);
    if (Number.isNaN(parsedTarget) || parsedTarget <= 0) {
      setFeedback('Target harus angka positif.');
      return;
    }

    const parsedCurrent = Number(targetForm.currentAmount || currentBalance);
    const nextTarget = {
      targetAmount: parsedTarget.toFixed(2),
      currentAmount: parsedCurrent.toFixed(2),
    };

    setSavingsTarget(nextTarget);
    localStorage.setItem(`finance-tracker-target-${user.email}`, JSON.stringify(nextTarget));
    setFeedback('Target tabungan berhasil disimpan.');
  };

  const handleExportCsv = () => {
    const rows = [
      ['tanggal', 'jenis', 'deskripsi', 'kategori', 'jumlah'],
      ...transactions.map((item) => [item.date, item.type, item.description, item.category || '-', item.amount]),
    ];
    const csvContent = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'transaksi.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const rows = transactions
      .map(
        (item) => `<tr><td>${item.date}</td><td>${item.type}</td><td>${item.description}</td><td>${item.category || '-'}</td><td>${formatCurrency(Number(item.amount))}</td></tr>`
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head><title>Export PDF Finance Tracker</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px; color: #0f172a;">
          <h1>Finance Tracker</h1>
          <p>Ringkasan transaksi</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border-bottom: 1px solid #cbd5e1; text-align: left; padding: 8px;">Tanggal</th>
                <th style="border-bottom: 1px solid #cbd5e1; text-align: left; padding: 8px;">Jenis</th>
                <th style="border-bottom: 1px solid #cbd5e1; text-align: left; padding: 8px;">Deskripsi</th>
                <th style="border-bottom: 1px solid #cbd5e1; text-align: left; padding: 8px;">Kategori</th>
                <th style="border-bottom: 1px solid #cbd5e1; text-align: left; padding: 8px;">Jumlah</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleLogout = () => {
    localStorage.removeItem('finance-tracker-current-user');
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', padding: '24px', background: '#eef2ff' }}>
        <p style={{ maxWidth: '980px', margin: '0 auto', color: '#475569' }}>Memuat dashboard...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', padding: '24px', background: '#eef2ff' }}>
      <section style={{ maxWidth: '1200px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', padding: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, color: '#4338ca', fontWeight: 700 }}>Dashboard</p>
            <h1 style={{ margin: '10px 0 16px', fontSize: '2.2rem' }}>Halo, {user.name}</h1>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.8 }}>
              Catat pemasukan, pengeluaran, kategori, target tabungan, dan ekspor data dengan lebih praktis.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCsv}
              style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
            >
              Export PDF
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={{ padding: '12px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}
            >
              Logout
            </button>
            <Link href="/" style={{ textDecoration: 'none', padding: '12px 18px', borderRadius: '12px', background: '#2563eb', color: '#fff', fontWeight: 700 }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
          <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Total Pemasukan</p>
            <p style={{ margin: '12px 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#16a34a' }}>{formatCurrency(summary.income)}</p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Total Pengeluaran</p>
            <p style={{ margin: '12px 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#dc2626' }}>{formatCurrency(summary.expense)}</p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Saldo Saat Ini</p>
            <p style={{ margin: '12px 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#1f2937' }}>{formatCurrency(currentBalance)}</p>
          </div>
        </div>

        <section style={{ marginTop: '32px', display: 'grid', gap: '28px' }}>
          <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>Tambah Transaksi</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="type" style={{ fontWeight: 600 }}>Jenis</label>
                <select id="type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} style={inputStyle}>
                  <option value="pemasukan">Pemasukan</option>
                  <option value="pengeluaran">Pengeluaran</option>
                </select>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="description" style={{ fontWeight: 600 }}>Deskripsi</label>
                <input
                  id="description"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Contoh: Gaji, Belanja groceries"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="amount" style={{ fontWeight: 600 }}>Jumlah</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="date" style={{ fontWeight: 600 }}>Tanggal</label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="category" style={{ fontWeight: 600 }}>Kategori</label>
                <select
                  id="category"
                  value={form.category || categories[0] || 'Lainnya'}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  style={inputStyle}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="newCategory" style={{ fontWeight: 600 }}>Tambah kategori baru</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    id="newCategory"
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    placeholder="Contoh: Investasi"
                    style={{ ...inputStyle, flex: 1, minWidth: '220px' }}
                  />
                  <button type="button" onClick={handleAddCategory} style={{ padding: '12px 16px', border: 0, borderRadius: '12px', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                    Tambah
                  </button>
                </div>
              </div>

              {feedback ? (
                <div style={{ color: '#0f172a', fontWeight: 600 }}>{feedback}</div>
              ) : null}

              <button type="submit" style={{ padding: '14px 18px', border: 0, borderRadius: '12px', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                Simpan Transaksi
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>Grafik Bulanan</h2>
                <span style={{ color: '#64748b' }}>6 bulan terakhir</span>
              </div>
              <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: '#64748b' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#16a34a' }} /> Pemasukan</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', borderRadius: '999px', background: '#dc2626' }} /> Pengeluaran</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px', alignItems: 'end', height: '220px' }}>
                  {monthlyData.map((item) => (
                    <div key={item.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '150px' }}>
                        <div style={{ width: '12px', height: `${Math.max(10, (item.income / maxMonthlyValue) * 120)}px`, background: '#16a34a', borderRadius: '999px 999px 0 0' }} />
                        <div style={{ width: '12px', height: `${Math.max(10, (item.expense / maxMonthlyValue) * 120)}px`, background: '#dc2626', borderRadius: '999px 999px 0 0' }} />
                      </div>
                      <span style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>Target Tabungan</h2>
                <span style={{ color: '#64748b' }}>{targetProgress}% tercapai</span>
              </div>
              <form onSubmit={handleSaveTarget} style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <label htmlFor="targetAmount" style={{ fontWeight: 600 }}>Target</label>
                  <input
                    id="targetAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={targetForm.targetAmount}
                    onChange={(event) => setTargetForm({ ...targetForm, targetAmount: event.target.value })}
                    placeholder="Contoh: 10000000"
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <label htmlFor="currentAmount" style={{ fontWeight: 600 }}>Jumlah saat ini</label>
                  <input
                    id="currentAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={targetForm.currentAmount}
                    onChange={(event) => setTargetForm({ ...targetForm, currentAmount: event.target.value })}
                    placeholder={String(currentBalance)}
                    style={inputStyle}
                  />
                </div>
                <button type="submit" style={{ padding: '12px 16px', border: 0, borderRadius: '12px', background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Simpan Target
                </button>
              </form>
              <div style={{ marginTop: '16px', background: '#dbeafe', borderRadius: '14px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#1d4ed8', fontWeight: 700 }}>
                  <span>Progress</span>
                  <span>{formatCurrency(Number(savingsTarget?.currentAmount || currentBalance))}</span>
                </div>
                <div style={{ background: '#bfdbfe', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${targetProgress}%`, height: '100%', background: '#2563eb', borderRadius: '999px' }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>Daftar Transaksi</h2>
                <span style={{ color: '#64748b' }}>{transactions.length} transaksi</span>
              </div>

              {transactions.length === 0 ? (
                <p style={{ marginTop: '16px', color: '#475569' }}>Belum ada transaksi. Tambahkan pemasukan atau pengeluaran lebih dulu.</p>
              ) : (
                <div style={{ marginTop: '20px', display: 'grid', gap: '14px' }}>
                  {transactions.map((item) => (
                    <div key={item.id} style={{ display: 'grid', gap: '10px', padding: '18px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{item.description}</p>
                          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.95rem' }}>{item.date}</p>
                        </div>
                        <span style={{ color: item.type === 'pemasukan' ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                          {item.type === 'pemasukan' ? '+' : '-'}{formatCurrency(Number(item.amount))}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', background: item.type === 'pemasukan' ? '#dcfce7' : '#fee2e2', color: item.type === 'pemasukan' ? '#166534' : '#b91c1c', fontWeight: 700, fontSize: '0.9rem', width: 'fit-content' }}>
                          {item.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                        </div>
                        <div style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', background: '#e2e8f0', color: '#334155', fontWeight: 700, fontSize: '0.9rem', width: 'fit-content' }}>
                          {item.category || 'Lainnya'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
};
