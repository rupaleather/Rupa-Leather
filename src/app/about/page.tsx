import styles from '@/styles/components/Products.module.css';

export default function AboutPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Tentang Kulit Nusantara</h1>
          <p className={styles.pageDesc}>Cerita di balik setiap helai kulit yang kami ubah menjadi karya</p>
        </div>
      </header>

      <div className="container section" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <section>
            <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>Filosofi</span>
            <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-3xl)' }}>
              Lebih dari Sekadar <span className="text-gradient">Produk Kulit</span>
            </h2>
            <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
              Kulit Nusantara lahir dari kecintaan mendalam terhadap kerajinan tangan Indonesia. 
              Sejak 2010, kami telah berkomitmen untuk menghadirkan produk kulit asli dengan kualitas 
              tertinggi yang tidak hanya fungsional, tetapi juga menjadi cerminan karakter dan gaya hidup pemiliknya.
            </p>
            <p style={{ lineHeight: 1.8 }}>
              Setiap produk yang kami buat melewati proses kurasi ketat — dari pemilihan kulit mentah, 
              proses tanning yang ramah lingkungan, hingga setiap jahitan yang dikerjakan secara manual 
              oleh pengrajin ahli di workshop kami di Yogyakarta.
            </p>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {[
              { icon: '🏭', title: 'Workshop', desc: 'Produksi langsung di Yogyakarta' },
              { icon: '👨‍🎨', title: '50+ Pengrajin', desc: 'Tim ahli berpengalaman' },
              { icon: '🌿', title: 'Eco-Friendly', desc: 'Proses ramah lingkungan' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>{item.icon}</span>
                <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{item.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <section>
            <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>Proses</span>
            <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-2xl)' }}>Dari Kulit Mentah ke Karya Seni</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { step: '01', title: 'Seleksi Kulit', desc: 'Kami hanya memilih kulit sapi dan domba grade A dari penyamakan terpercaya.' },
                { step: '02', title: 'Desain & Pola', desc: 'Setiap desain dikembangkan untuk memaksimalkan estetika dan fungsi.' },
                { step: '03', title: 'Pemotongan Presisi', desc: 'Kulit dipotong dengan presisi tinggi menggunakan teknik tradisional.' },
                { step: '04', title: 'Jahit Tangan', desc: 'Jahitan saddle stitch yang lebih kuat dari jahitan mesin.' },
                { step: '05', title: 'Finishing & QC', desc: 'Setiap produk melewati 3 tahap quality control sebelum dikirim.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-primary)', fontWeight: 700, minWidth: 50 }}>{item.step}</span>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: 'var(--text-base)' }}>{item.title}</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
