import React, { useState } from 'react';

function StudentView({ students, groups, sessions, attendance, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', birthYear: '', groupId: '', helperId: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const id = self.crypto.randomUUID();
    const updated = [...students, { ...newStudent, id, joinDate: new Date().toISOString().split('T')[0] }];
    onUpdate(updated);
    setIsAdding(false);
    setNewStudent({ name: '', birthYear: '', groupId: '', helperId: '' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = students.map(s => s.id === selectedStudent.id ? selectedStudent : s);
    onUpdate(updated);
    setIsEditing(false);
  };

  const handleTransfer = (studentId, newGroupId) => {
    const updated = students.map(s => s.id === studentId ? { ...s, groupId: newGroupId } : s);
    onUpdate(updated);
    if (selectedStudent?.id === studentId) {
      setSelectedStudent({ ...selectedStudent, groupId: newGroupId });
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentHistory = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    return studentAttendance.map(a => {
      const session = sessions.find(s => s.id === a.sessionId);
      return { ...a, session };
    }).sort((a, b) => new Date(b.session?.date) - new Date(a.session?.date));
  };

  const getHelpingSystem = (studentId) => {
    return students.filter(s => s.helperId === studentId);
  };

  return (
    <div className="view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Quản Lý Học Viên</h1>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Thêm Học Viên</button>
      </div>

      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <input 
          style={{ marginBottom: 0 }}
          placeholder="🔍 Tìm kiếm học viên theo tên..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Khai báo học viên mới</h2>
            <form onSubmit={handleAdd}>
              <label>Họ và Tên</label>
              <input 
                required 
                value={newStudent.name} 
                onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
                placeholder="Nguyễn Văn A" 
              />
              <label>Năm sinh</label>
              <input 
                required 
                value={newStudent.birthYear} 
                onChange={e => setNewStudent({...newStudent, birthYear: e.target.value})} 
                placeholder="Vd: 1995" 
              />
              <div className="grid">
                <div>
                  <label>Nhóm Học</label>
                  <select 
                    required 
                    value={newStudent.groupId} 
                    onChange={e => setNewStudent({...newStudent, groupId: e.target.value})}
                  >
                    <option value="">Chọn nhóm...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Người giúp (Tâm đạo)</label>
                  <select 
                    value={newStudent.helperId} 
                    onChange={e => setNewStudent({...newStudent, helperId: e.target.value})}
                  >
                    <option value="">-- Không có --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => { setSelectedStudent(null); setIsEditing(false); }}>
          <div className="modal-content glass-card" style={{ maxWidth: '800px', display: 'flex', gap: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ flex: '1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2>Chi tiết học viên</h2>
                {!isEditing && <button className="btn btn-ghost" onClick={() => setIsEditing(true)}>✎ Sửa thông tin</button>}
              </div>
              
              <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label>Họ tên</label>
                      <input value={selectedStudent.name} onChange={e => setSelectedStudent({...selectedStudent, name: e.target.value})} />
                    </div>
                    <div>
                      <label>Năm sinh</label>
                      <input value={selectedStudent.birthYear} onChange={e => setSelectedStudent({...selectedStudent, birthYear: e.target.value})} />
                    </div>
                    <div>
                      <label>Người trực tiếp giúp</label>
                      <select 
                        value={selectedStudent.helperId || ''} 
                        onChange={e => setSelectedStudent({...selectedStudent, helperId: e.target.value})}
                      >
                        <option value="">-- Không có --</option>
                        {students.filter(s => s.id !== selectedStudent.id).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button className="btn btn-primary" onClick={handleSaveEdit}>Lưu thay đổi</button>
                      <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{selectedStudent.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Năm sinh: {selectedStudent.birthYear}</p>
                    <p style={{ marginTop: '8px' }}>
                      Nhóm: <span className="badge badge-success">{groups.find(g => g.id === selectedStudent.groupId)?.name}</span>
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      Người trực tiếp giúp: <span style={{ color: 'var(--primary)' }}>{students.find(s => s.id === selectedStudent.helperId)?.name || 'Chưa có'}</span>
                    </p>
                  </>
                )}
              </div>

              <h3>Lịch sử học tập</h3>
              <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                {getStudentHistory(selectedStudent.id).map((record, idx) => (
                  <div key={idx} className="glass-card" style={{ marginBottom: '12px', padding: '12px', borderLeft: `4px solid ${record.status === 'present' ? 'var(--success)' : 'var(--accent)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{record.session?.topic || 'N/A'}</strong>
                      <span className="badge-warning" style={{ fontSize: '0.8rem' }}>{record.session?.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className={`badge ${record.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                        {record.status === 'present' ? 'Tham gia' : 'Vắng'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: '0 0 300px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '24px' }}>
              <button className="btn btn-ghost" style={{ float: 'right' }} onClick={() => setSelectedStudent(null)}>✕</button>
              <h3 style={{ marginBottom: '16px' }}>Hệ thống tâm đạo</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Những người học viên này đang giúp:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getHelpingSystem(selectedStudent.id).map(s => (
                  <div key={s.id} className="glass-card" style={{ padding: '8px 12px', fontSize: '0.9rem', background: 'rgba(56, 189, 248, 0.1)' }}>
                    {s.name}
                  </div>
                ))}
                {getHelpingSystem(selectedStudent.id).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chưa giúp ai.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="glass-card student-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedStudent(student)}>
            <h3 style={{ margin: 0 }}>{student.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{student.email}</p>
            <div style={{ marginTop: '12px' }}>
              <span className="badge badge-success">
                {groups.find(g => g.id === student.groupId)?.name || 'Chưa gán nhóm'}
              </span>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '16px' }} onClick={e => e.stopPropagation()}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chuyển nhóm:</label>
              <select 
                style={{ marginBottom: 0, marginTop: '4px' }}
                value={student.groupId} 
                onChange={(e) => handleTransfer(student.id, e.target.value)}
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy học viên nào.</p>}
      </div>
    </div>
  );
}

export default StudentView;
