import React, { useState } from 'react';

function TeacherView({ teachers, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', specialism: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const id = 'T' + Date.now();
    onUpdate([...teachers, { ...newTeacher, id }]);
    setIsAdding(false);
    setNewTeacher({ name: '', specialism: '' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdate(teachers.map(t => t.id === editingTeacher.id ? editingTeacher : t));
    setEditingTeacher(null);
  };

  const handleRemove = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người chia sẻ này?')) {
      onUpdate(teachers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Quản Lý Người Chia Sẻ</h1>
          <p style={{ color: 'var(--text-muted)' }}>Quản lý danh sách các người chia sẻ/giảng viên của hệ thống.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Thêm Người Chia Sẻ</button>
      </div>

      <div className="grid">
        {(teachers || []).map(teacher => (
          <div key={teacher.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3>{teacher.name}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--primary)' }} onClick={() => setEditingTeacher(teacher)}>✎</button>
                <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--accent)' }} onClick={() => handleRemove(teacher.id)}>✕</button>
              </div>
            </div>
            <p style={{ color: 'var(--primary)', marginTop: '8px' }}>Chuyên môn: {teacher.specialism || 'Chưa cập nhật'}</p>
          </div>
        ))}
        {(teachers || []).length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa có người chia sẻ nào.</p>}
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Thêm người chia sẻ mới</h2>
            <form onSubmit={handleAdd}>
              <label>Họ và Tên</label>
              <input required value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} placeholder="Nguyễn Văn X" />
              <label>Chuyên môn</label>
              <input value={newTeacher.specialism} onChange={e => setNewTeacher({...newTeacher, specialism: e.target.value})} placeholder="Vd: Frontend, Backend, Design..." />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Lưu thông tin</button>
                <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTeacher && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Chỉnh sửa người chia sẻ</h2>
            <form onSubmit={handleSaveEdit}>
              <label>Họ và Tên</label>
              <input required value={editingTeacher.name} onChange={e => setEditingTeacher({...editingTeacher, name: e.target.value})} />
              <label>Chuyên môn</label>
              <input value={editingTeacher.specialism} onChange={e => setEditingTeacher({...editingTeacher, specialism: e.target.value})} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Cập nhật</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingTeacher(null)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherView;
