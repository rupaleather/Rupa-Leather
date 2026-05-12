const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.from('outlets').select('*').limit(1);
  if (error) {
    console.error('Error fetching outlets:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Sample record keys:', Object.keys(data[0]));
    console.log('Sample address_note:', data[0].address_note);
  } else {
    console.log('No outlets found.');
  }
}

checkSchema();
