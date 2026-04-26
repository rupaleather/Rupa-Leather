# SOP PENGEMBANGAN EKOSISTEM WEBSITE RUPA
## Status: PERMANEN & WAJIB (KITAB SUCI)

Dokumen ini adalah panduan utama bagi seluruh pengembang (AI maupun Manusia) yang bekerja pada proyek Rupa. Pelanggaran terhadap poin-poin di bawah ini dianggap sebagai kegagalan teknis.

### 1. DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid)
*   **Prinsip**: Kode harus bersih, mudah dibaca, dan tidak bertele-tele. Jangan gunakan solusi kompleks untuk masalah sederhana.

### 2. SEPARATION OF CONCERNS (SoC)
*   **Hasil**: Perubahan sumber data (misal: ganti database) tidak boleh merusak tampilan UI.

### 3. SINGLE RESPONSIBILITY PRINCIPLE (SRP)
*   Setiap fungsi atau class hanya boleh memiliki **satu tanggung jawab**.
*   Jika sebuah fungsi melakukan ambil data, memproses data, DAN mengupdate UI, fungsi tersebut WAJIB dipecah.

### 4. ZERO FEATURE ALTERATION TANPA PERSETUJUAN
*   **Dilarang Keras** mengubah, memindahkan, atau menghapus fitur/aset/dan lain lain yang sudah ada tanpa diskusi dan persetujuan explisit dari Pak Boss.
*   Fokus utama adalah Optimasi, Bug Fixing, dan Penambahan Fitur baru yang sinkron.

### 5. STANDAR "RESPONSIF, STABIL, AMAN, & SCALEABLE"

### 6. SURGICAL EDITING & ZERO SILENT CHANGES (ANTI-IMPROV SEPIHAK)
*   **Aksi**: Setiap perubahan kode wajib fokus 100% pada area yang diperintahkan. Dilarang keras melakukan refactoring "diam-diam", menggeser posisi elemen lain, atau merubah logika tambahan tanpa izin.
*   **Inisiatif**: Jika AI melihat potensi peningkatan desain atau logika di luar perintah, **WAJIB bertanya & meminta konfirmasi** terlebih dahulu di kolom chat sebelum mengeksekusi.
*   **Prinsip**: "Ikuti Navigasi Pak Boss!" - Kecepatan eksekusi tidak boleh mengorbankan integritas tata letak dan fitur yang sudah disepakati.

**Status: PERMANEN & WAJIB DIPATUHI**
---

**Tanda Tangan Digital:**

*Senior Manager Fullstack Developer (Antigravity AI)*
*Tanggal: 24 April 2026*
