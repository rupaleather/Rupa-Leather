import { supabase } from '../lib/supabase';

async function initAuth() {
  const email = 'rupa-leather@gmail.com';
  const password = '*Manjadawajada!';

  console.log(`🚀 Memulai inisialisasi akun untuk: ${email}`);

  try {
    // 1. Cek apakah user sudah ada di auth.users
    const { data: userData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let targetUser = userData.users.find(u => u.email === email);

    if (!targetUser) {
      console.log('📝 User belum ada di Auth. Membuat user baru...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (createError) throw createError;
      targetUser = newUser.user;
      console.log('✅ User baru berhasil dibuat di Supabase Auth.');
    } else {
      console.log('ℹ️ User sudah ada di Auth. Memperbarui password...');
      const { error: updateError } = await supabase.auth.admin.updateUserById(targetUser.id, {
        password
      });
      if (updateError) throw updateError;
      console.log('✅ Password user berhasil diperbarui.');
    }

    // 2. Hubungkan ke tabel profiles
    console.log('🔗 Menghubungkan Auth User ke tabel Profiles...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ auth_user_id: targetUser.id })
      .eq('id', '517e47d8-1f73-4e1c-879e-63cb759967c4');

    if (profileError) throw profileError;

    console.log('🎉 Inisialisasi Selesai! Login Anda sekarang 100% fungsional.');
    console.log(`
      Email: ${email}
      Password: ${password}
    `);

  } catch (error: any) {
    console.error('❌ Terjadi kesalahan:', error.message);
  }
}

initAuth();
