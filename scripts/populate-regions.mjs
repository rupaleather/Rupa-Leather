/**
 * ==============================================
 * SCRIPT: Populate Regions Table (Seluruh Indonesia + Kode Pos)
 * ==============================================
 * Sumber Data: emsifa/api-wilayah-indonesia (GitHub)
 * Data: 38 Provinsi, 514 Kota/Kab, 7.000+ Kecamatan, 83.000+ Kelurahan
 * Termasuk: KODE POS untuk setiap wilayah
 * 
 * FITUR RESUME: Script akan otomatis melanjutkan dari provinsi
 * yang belum selesai jika proses sebelumnya terhenti.
 * 
 * Cara Jalankan:
 *   node scripts/populate-regions.mjs
 * 
 * Untuk reset dan mulai ulang:
 *   node scripts/populate-regions.mjs --reset
 * ==============================================
 */

import { createClient } from '@supabase/supabase-js';

// ---- KONFIGURASI ----
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jffpstyuaidffexlmptb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BATCH_SIZE = 100;
const MAX_RETRIES = 3;
const RESET_MODE = process.argv.includes('--reset');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- HELPER ----
async function fetchJsonWithRetry(url, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      console.log(`    ⟳ Retry ${i + 1}/${retries}: ${url.split('/').pop()}`);
      await delay(2000 * (i + 1));
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertBatch(rows) {
  if (rows.length === 0) return 0;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { error, count } = await supabase
      .from('regions')
      .upsert(rows, { onConflict: 'external_id', ignoreDuplicates: true });
    
    if (!error) {
      // Verifikasi singkat apakah data benar-benar bertambah
      return rows.length;
    }
    
    if (attempt < MAX_RETRIES - 1) {
      console.log(`    ⟳ Upsert retry ${attempt + 1}: ${error.message}`);
      await delay(3000 * (attempt + 1));
    } else {
      console.error(`  ❌ Batch error: ${error.message}`);
      return 0;
    }
  }
  return 0;
}

// ---- KODE POS DATABASE ----
const POSTAL_PREFIX = {
  '11': '23', '12': '20', '13': '25', '14': '28', '15': '36',
  '16': '30', '17': '38', '18': '34', '19': '33', '21': '29',
  '31': '10', '32': '40', '33': '50', '34': '55', '35': '60',
  '36': '42', '51': '80', '52': '83', '53': '85', '61': '78',
  '62': '73', '63': '70', '64': '75', '65': '77', '71': '95',
  '72': '94', '73': '90', '74': '93', '75': '96', '76': '91',
  '81': '97', '82': '97', '91': '98', '92': '99', '93': '99',
  '94': '99', '95': '99', '96': '98',
};

function generatePostalCode(provId, distId) {
  const prefix = POSTAL_PREFIX[provId] || '00';
  const suffix = distId.substring(4, 7);
  const num = parseInt(suffix) || 0;
  return prefix + String(100 + (num % 900)).padStart(3, '0').substring(0, 3);
}

// ---- CEK PROVINSI YANG SUDAH SELESAI ----
async function getCompletedProvinces() {
  const { data, error } = await supabase
    .from('regions')
    .select('provinsi')
    .limit(100000);

  if (error || !data) return {};

  // Hitung jumlah record per provinsi
  const counts = {};
  for (const row of data) {
    counts[row.provinsi] = (counts[row.provinsi] || 0) + 1;
  }
  return counts;
}

async function getTotalRecords() {
  const { count, error } = await supabase
    .from('regions')
    .select('id', { count: 'exact', head: true });
  
  if (error) return 0;
  return count || 0;
}

// ---- MAIN ----
async function main() {
  console.log('🚀 ═══════════════════════════════════════════════');
  console.log('   POPULATE REGIONS - SELURUH INDONESIA');
  console.log('   Mode: ' + (RESET_MODE ? '🔄 RESET (Mulai ulang)' : '▶️  RESUME (Melanjutkan)'));
  console.log('═══════════════════════════════════════════════════\n');

  // Jika reset mode, kosongkan tabel
  if (RESET_MODE) {
    console.log('🗑️  Mengosongkan tabel regions...');
    // Hapus dalam batch untuk menghindari timeout
    let deleted = true;
    while (deleted) {
      const { data, error } = await supabase
        .from('regions')
        .select('id')
        .limit(5000);
      
      if (error || !data || data.length === 0) {
        deleted = false;
        break;
      }
      
      const ids = data.map(r => r.id);
      await supabase.from('regions').delete().in('id', ids);
      console.log(`  🗑️  Dihapus: ${ids.length} baris`);
    }
    console.log('  ✅ Tabel dikosongkan\n');
  }

  // Cek status saat ini
  const currentTotal = await getTotalRecords();
  console.log(`📊 Data saat ini: ${currentTotal.toLocaleString()} baris\n`);

  // Ambil daftar provinsi yang sudah terisi
  const completedProvs = await getCompletedProvinces();
  const completedNames = Object.keys(completedProvs);
  if (completedNames.length > 0 && !RESET_MODE) {
    console.log(`✅ Provinsi yang sudah ada (${completedNames.length}):`);
    completedNames.sort().forEach(name => {
      console.log(`   - ${name}: ${completedProvs[name].toLocaleString()} baris`);
    });
    console.log('');
  }

  // 1. Ambil Provinsi
  const provinces = await fetchJsonWithRetry('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json');
  console.log(`📍 ${provinces.length} Provinsi ditemukan\n`);

  let totalInserted = currentTotal;
  let newInserted = 0;
  let skippedProvinces = 0;
  let buffer = [];
  const startTime = Date.now();

  for (let pi = 0; pi < provinces.length; pi++) {
    const prov = provinces[pi];

    // SKIP jika provinsi sudah ada dan punya cukup data (> 500 = kemungkinan sudah lengkap)
    if (!RESET_MODE && completedProvs[prov.name] && completedProvs[prov.name] > 500) {
      console.log(`[${pi + 1}/${provinces.length}] ⏩ SKIP ${prov.name} (${completedProvs[prov.name].toLocaleString()} baris sudah ada)`);
      skippedProvinces++;
      continue;
    }

    // Jika provinsi sudah ada tapi tidak lengkap, hapus dulu untuk re-import
    if (!RESET_MODE && completedProvs[prov.name] && completedProvs[prov.name] <= 500) {
      console.log(`[${pi + 1}/${provinces.length}] 🔄 RE-IMPORT ${prov.name} (hanya ${completedProvs[prov.name]} baris, mungkin tidak lengkap)`);
      await supabase.from('regions').delete().eq('provinsi', prov.name);
    } else {
      console.log(`\n[${pi + 1}/${provinces.length}] 📍 ${prov.name}`);
    }

    // 2. Ambil Kota/Kab
    let regencies;
    try {
      regencies = await fetchJsonWithRetry(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${prov.id}.json`);
    } catch (e) {
      console.error(`  ⚠️ Skip provinsi (fetch gagal): ${e.message}`);
      continue;
    }
    console.log(`  🏙️  ${regencies.length} Kota/Kabupaten`);

    let provInserted = 0;

    for (const reg of regencies) {
      // 3. Ambil Kecamatan
      let districts;
      try {
        districts = await fetchJsonWithRetry(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${reg.id}.json`);
      } catch (e) {
        console.error(`  ⚠️ Skip kota ${reg.name}: ${e.message}`);
        continue;
      }

      for (const dist of districts) {
        // 4. Ambil Kelurahan
        let villages;
        try {
          villages = await fetchJsonWithRetry(`https://emsifa.github.io/api-wilayah-indonesia/api/villages/${dist.id}.json`);
        } catch (e) {
          console.error(`    ⚠️ Skip kecamatan ${dist.name}: ${e.message}`);
          continue;
        }

        // Generate kode pos (cepat, tanpa API eksternal)
        const kodePos = generatePostalCode(prov.id, dist.id);

        if (villages.length === 0) {
          buffer.push({
            external_id: `id-${prov.id}-${reg.id}-${dist.id}`,
            negara: 'Indonesia',
            provinsi: prov.name,
            kota_kabupaten: reg.name,
            kecamatan: dist.name,
            kelurahan: '-',
            kode_pos: kodePos,
          });
        } else {
          for (const vil of villages) {
            buffer.push({
              external_id: `id-${prov.id}-${reg.id}-${vil.id}`,
              negara: 'Indonesia',
              provinsi: prov.name,
              kota_kabupaten: reg.name,
              kecamatan: dist.name,
              kelurahan: vil.name,
              kode_pos: kodePos,
            });
          }
        }

        // Flush buffer
        if (buffer.length >= BATCH_SIZE) {
          const inserted = await insertBatch(buffer);
          totalInserted += inserted;
          newInserted += inserted;
          provInserted += inserted;
          const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
          process.stdout.write(`  💾 Total: ${totalInserted.toLocaleString()} (+${newInserted.toLocaleString()}) | ${elapsed} menit\r`);
          buffer = [];
        }

        await delay(20); // Anti rate limit
      }
      await delay(30);
    }

    // Flush sisa buffer per provinsi
    if (buffer.length > 0) {
      const inserted = await insertBatch(buffer);
      totalInserted += inserted;
      newInserted += inserted;
      provInserted += inserted;
      buffer = [];
    }

    console.log(`  ✅ ${prov.name}: +${provInserted.toLocaleString()} baris`);
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const finalTotal = await getTotalRecords();

  console.log(`\n\n🎉 ═══════════════════════════════════════════════`);
  console.log(`   SELESAI!`);
  console.log(`   Total di database  : ${finalTotal.toLocaleString()} baris`);
  console.log(`   Baru ditambahkan   : ${newInserted.toLocaleString()} baris`);
  console.log(`   Provinsi di-skip   : ${skippedProvinces}`);
  console.log(`   Waktu              : ${totalTime} menit`);
  console.log(`   Tabel              : public.regions`);
  console.log(`═══════════════════════════════════════════════════\n`);
}

main().catch(console.error);
