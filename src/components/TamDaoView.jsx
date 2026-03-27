import React, { useState } from 'react';

function TamDaoView({ students }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minHelping, setMinHelping] = useState(0);

  const studentsWithHelpingStats = students.map(student => {
    const helping = students.filter(s => s.helperId === student.id);
    return {
      ...student,
      helpingCount: helping.length,
      helpingList: helping
    };
  });

  const filteredData = studentsWithHelpingStats.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    s.helpingCount >= minHelping
  ).sort((a, b) => b.helpingCount - a.helpingCount);

  return (
    <div className="view">
      <div style={{ marginBottom: '32px' }}>
        <h1>Hệ Thống Tâm Đạo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Theo dõi mạng lưới học viên giúp đỡ nhau trong quá trình học tập.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1' }}>
          <label>Tìm kiếm học viên</label>
          <input 
            style={{ marginBottom: 0 }}
            placeholder="Nhập tên người giúp..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ flex: '0 0 250px' }}>
          <label>Số lượng người giúp ít nhất</label>
          <input 
            style={{ marginBottom: 0 }}
            type="number" 
            min="0"
            value={minHelping}
            onChange={e => setMinHelping(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid">
        {filteredData.map(student => (
          <div key={student.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{student.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Năm sinh: {student.birthYear}</p>
              </div>
              <div className="badge badge-success" style={{ fontSize: '1rem', padding: '10px 16px' }}>
                Giúp: {student.helpingCount} người
              </div>
            </div>
            
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Danh sách người được giúp:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {student.helpingList.map(s => (
                  <span key={s.id} className="badge badge-ghost" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', border: '1px solid var(--glass-border)' }}>
                    {s.name}
                  </span>
                ))}
                {student.helpingList.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chưa giúp ai.</span>}
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy học viên nào.</p>}
      </div>
    </div>
  );
}

export default TamDaoView;
