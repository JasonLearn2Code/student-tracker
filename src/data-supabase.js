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

export const syncTableToSupabase = async (tableName, tableData) => {
  try {
    // 1. Lấy danh sách ID hiện tại trên Supabase để tìm các dòng đã bị xóa
    const { data: currentData } = await supabase.from(tableName).select('id');
    const currentIds = currentData ? currentData.map(d => String(d.id)) : [];
    const incomingIds = tableData.map(d => String(d.id));
    
    const toDelete = currentIds.filter(id => !incomingIds.includes(id));
    
    // 2. Xóa các dữ liệu tương ứng khỏi Supabase nếu nó đã bị xóa ở ứng dụng
    if (toDelete.length > 0) {
      await supabase.from(tableName).delete().in('id', toDelete);
    }
    
    // 3. Upsert (Thêm hoặc Cập nhật) tất cả dữ liệu gốc
    if (tableData.length > 0) {
      const { error } = await supabase.from(tableName).upsert(tableData);
      if (error) {
        console.error(`Lỗi ghi dữ liệu bảng ${tableName}:`, error.message);
      }
    }
  } catch (err) {
    console.error(`Đã xảy ra lỗi đồng bộ bảng ${tableName}:`, err.message);
  }
};
