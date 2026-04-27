import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://decamcuijatzmeqqgvqy.supabase.co';
const supabaseKey = 'sb_publishable_xcgKOkOQScsM2BYp7q3Okg_eboQJUSN';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing insert with string ID...');
  const { data, error } = await supabase.from('students').insert({
    id: Date.now().toString(),
    name: 'Test Student',
    birthYear: '2000',
    groupId: 'G1'
  }).select();

  if (error) {
    console.error('INSERT ERROR:', error.message);
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

testInsert();
