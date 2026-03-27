import { supabase } from './lib/supabase';

export const loadDataFromSupabase = async () => {
  const { data: students, error: studentsError } = await supabase.from('students').select('*');
  const { data: groups, error: groupsError } = await supabase.from('groups').select('*');
  const { data: masterData, error: masterDataError } = await supabase.from('masterData').select('*');
  const { data: teachers, error: teachersError } = await supabase.from('teachers').select('*');
  const { data: sessions, error: sessionsError } = await supabase.from('sessions').select('*');
  const { data: attendance, error: attendanceError } = await supabase.from('attendance').select('*');

  if (studentsError || groupsError || masterDataError || teachersError || sessionsError || attendanceError) {
    console.error('Lỗi khi tải dữ liệu từ Supabase');
    return null;
  }

  return {
    students,
    groups,
    masterData,
    teachers,
    sessions,
    attendance
  };
};

export const saveStudentToSupabase = async (student) => {
  const { data, error } = await supabase
    .from('students')
    .upsert([student])
    .select();

  if (error) {
    console.error('Lỗi khi lưu học sinh:', error.message);
    return null;
  }
  return data[0];
};

// Tương tự cho các bảng khác...
