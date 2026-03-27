import React, { useState } from 'react';

function MasterDataView({ masterData, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [newTopic, setNewTopic] = useState({ topic: '', description: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const id = 'M' + Date.now();
    onUpdate([...masterData, { ...newTopic, id }]);
    setIsAdding(false);
    setNewTopic({ topic: '', description: '' });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onUpdate(masterData.map(m => m.id === editingTopic.id ? editingTopic : m));
    setEditingTopic(null);
  };

  const handleRemove = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
      onUpdate(masterData.filter(m => m.id !== id));
    }
  };

  return (
    <div className="view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Chương Trình Học</h1>
          <p style={{ color: 'var(--text-muted)' }}>Quản lý danh sách các chủ đề/buổi học chuẩn của trung tâm.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Thêm Chủ Đề Mới</button>
      </div>

      <div className="glass-card">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>STT</th>
              <th>Chủ Đề</th>
              <th>Mô Tả Cốt Lõi</th>
              <th style={{ width: '150px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {masterData.map((m, idx) => (
              <tr key={m.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{m.topic}</td>
                <td style={{ color: 'var(--text-muted)' }}>{m.description}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--primary)', marginRight: '8px' }} onClick={() => setEditingTopic(m)}>
                    Sửa
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--accent)' }} onClick={() => handleRemove(m.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {masterData.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                  Chưa có chủ đề nào trong chương trình học.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Thêm chủ đề chuẩn mới</h2>
            <form onSubmit={handleAdd}>
              <label>Tên chủ đề / Tên buổi học</label>
              <input 
                required 
                value={newTopic.topic} 
                onChange={e => setNewTopic({...newTopic, topic: e.target.value})} 
                placeholder="Vd: React Hooks & State" 
              />
              <label>Mô tả ngắn gọn nội dung</label>
              <textarea 
                rows="3"
                value={newTopic.description} 
                onChange={e => setNewTopic({...newTopic, description: e.target.value})} 
                placeholder="Những kiến thức chính học viên cần đạt được..." 
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Lưu chủ đề</button>
                <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTopic && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Chỉnh sửa chủ đề</h2>
            <form onSubmit={handleEdit}>
              <label>Tên chủ đề / Tên buổi học</label>
              <input 
                required 
                value={editingTopic.topic} 
                onChange={e => setEditingTopic({...editingTopic, topic: e.target.value})} 
              />
              <label>Mô tả ngắn gọn nội dung</label>
              <textarea 
                rows="3"
                value={editingTopic.description} 
                onChange={e => setEditingTopic({...editingTopic, description: e.target.value})} 
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Cập nhật</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingTopic(null)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterDataView;
