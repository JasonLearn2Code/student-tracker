import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://decamcuijatzmeqqgvqy.supabase.co';
const supabaseKey = 'sb_publishable_xcgKOkOQScsM2BYp7q3Okg_eboQJUSN';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  console.log('Testing UPDATE...');
  const { data, error } = await supabase.from('groups').upsert({
    id: 'G1',
    name: 'Nhóm Sáng Thứ 2 (Đã Cập Nhật)',
    courseName: 'Test RLS Update'
  }).select();

  if (error) {
    console.error('LỖI KHI UPDATE (Chắc do RLS):', error.message);
  } else {
    console.log('UPDATE THÀNH CÔNG! RLS ổn.', data);
  }
}

testUpdate();
