export const INITIAL_DATA = {
  students: [
    { id: '1', name: 'Nguyễn Văn A', birthYear: '1995', groupId: 'G1', joinDate: '2024-03-01', helperId: null },
    { id: '2', name: 'Thị B', birthYear: '1998', groupId: 'G1', joinDate: '2024-03-05', helperId: '1' },
    { id: '3', name: 'Lê Văn C', birthYear: '2000', groupId: 'G2', joinDate: '2024-03-10', helperId: '1' },
  ],
  groups: [
    { id: 'G1', name: 'Nhóm Sáng Thứ 2', courseName: 'Web Development Basics' },
    { id: 'G2', name: 'Nhóm Chiều Thứ 4', courseName: 'Web Development Basics' },
  ],
  masterData: [
    { id: 'M1', topic: 'Giới thiệu HTML', description: 'Cấu trúc cơ bản của trang web' },
    { id: 'M2', topic: 'CSS Cơ bản', description: 'Định dạng giao diện' },
    { id: 'M3', topic: 'JavaScript cơ bản', description: 'Kiến thức lập trình nền tảng' },
    { id: 'M4', topic: 'React Hooks', description: 'Xử lý logic state' },
  ],
  teachers: [
    { id: 'T1', name: 'Người Chia Sẻ Dũng', specialism: 'Frontend' },
    { id: 'T2', name: 'Người Chia Sẻ Lan', specialism: 'UI/UX' },
  ],
  sessions: [
    { id: 'S1', groupId: 'G1', date: '2024-03-10', teacherId: 'T1', topic: 'Giới thiệu HTML', masterId: 'M1' },
    { id: 'S2', groupId: 'G1', date: '2024-03-17', teacherId: 'T2', topic: 'CSS Cơ bản', masterId: 'M2' },
  ],
  attendance: [
    { id: 'A1', sessionId: 'S1', studentId: '1', status: 'present', notes: 'Tiếp thu tốt' },
    { id: 'A2', sessionId: 'S1', studentId: '2', status: 'absent', notes: 'Có phép' },
  ]
};

export const STORAGE_KEY = 'student_tracker_data';

export const loadData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return INITIAL_DATA;
  const data = JSON.parse(saved);
  
  // Data upgrade path
  if (!data.masterData) data.masterData = INITIAL_DATA.masterData;
  if (!data.teachers) data.teachers = INITIAL_DATA.teachers;
  
  if (data.students) {
    data.students = data.students.map(s => ({
      ...s,
      birthYear: s.birthYear || 'N/A',
      email: undefined // Removing email
    }));
  }
  
  return data;
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
