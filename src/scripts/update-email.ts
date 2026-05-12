import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateEmail() {
  const oldEmail = 'rupa-leather@gmail.com';
  const newEmail = 'rupaleather@gmail.com';
  const userId = '137cf541-3ab2-4683-93e1-42828795d2af';
  const profileId = '517e47d8-1f73-4e1c-879e-63cb759967c4';

  console.log(`🚀 Mengubah email login dari ${oldEmail} menjadi ${newEmail}...`);

  try {
    // 1. Update di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      email: newEmail,
      email_confirm: true
    });

    if (authError) throw authError;
    console.log('✅ Email di Supabase Auth berhasil diperbarui.');

    // 2. Update di tabel profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ email: newEmail })
      .eq('id', profileId);

    if (profileError) throw profileError;
    console.log('✅ Email di tabel Profiles berhasil diperbarui.');

    console.log(`
      🎉 Selesai! Login Anda sekarang menggunakan:
      Email baru: ${newEmail}
      Password tetap: *Manjadawajada!
    `);

  } catch (error: any) {
    console.error('❌ Terjadi kesalahan:', error.message);
  }
}

updateEmail();
