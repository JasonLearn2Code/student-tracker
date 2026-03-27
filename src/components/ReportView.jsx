import React, { useState } from 'react';

function ReportView({ students, groups, sessions, attendance }) {
  const [minSessions, setMinSessions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSessions, setSelectedSessions] = useState([]);

  const toggleSession = (sessionId) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId) 
        : [...prev, sessionId]
    );
  };

  const reportData = students.map(student => {
    const studentAttendance = attendance.filter(a => a.studentId === student.id && a.status === 'present');
    const group = groups.find(g => g.id === student.groupId);
    
    // Check if student attended ALL selected sessions
    const attendedAllSelected = selectedSessions.every(sessionId => 
      studentAttendance.some(a => a.sessionId === sessionId)
    );

    return {
      ...student,
      groupName: group?.name || 'N/A',
      sessionsCompleted: studentAttendance.length,
      lastTopic: sessions.find(s => s.id === studentAttendance[studentAttendance.length - 1]?.sessionId)?.topic || 'Chưa học',
      attendedAllSelected
    };
  });

  const filteredData = reportData.filter(s => 
    s.sessionsCompleted >= minSessions && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    s.attendedAllSelected
  );

  return (
    <div className="view">
      <h1>Báo Cáo Tổng Hợp</h1>
      
      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
        <div style={{ flex: '1' }}>
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <label>Tìm kiếm học viên</label>
            <input 
              style={{ marginBottom: '16px' }}
              placeholder="Nhập tên học viên..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <label>Hoàn thành ít nhất (buổi)</label>
            <input 
              type="number" 
              min="0"
              value={minSessions}
              onChange={e => setMinSessions(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="glass-card">
            <h3>Lọc theo buổi học cụ thể</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>Học viên phải tham gia ĐỦ các buổi được chọn bên dưới.</p>
            <div style={{ maxHeight: '30vh', overflowY: 'auto' }}>
              {sessions.map(session => (
                <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <input 
                    type="checkbox" 
                    style={{ width: 'auto', marginBottom: 0 }}
                    checked={selectedSessions.includes(session.id)}
                    onChange={() => toggleSession(session.id)}
                  />
                  <div style={{ fontSize: '0.9rem' }}>
                    <strong>{session.topic}</strong>
                    <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>({groups.find(g => g.id === session.groupId)?.name} - {session.date})</span>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa có buổi học nào để lọc.</p>}
            </div>
          </div>
        </div>

        <div style={{ flex: '2' }}>
          <div className="glass-card" style={{ overflowX: 'auto', height: '100%' }}>
            <table>
              <thead>
                <tr>
                  <th>Học Viên</th>
                  <th>Nhóm</th>
                  <th>Số buổi</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td>{s.groupName}</td>
                    <td>
                      <span className="badge badge-warning">{s.sessionsCompleted}</span>
                    </td>
                    <td>
                      <span className={`badge ${s.sessionsCompleted >= 10 ? 'badge-success' : 'badge-warning'}`}>
                        {s.sessionsCompleted >= 10 ? 'Hoàn thành' : 'Đang học'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Không tìm thấy học viên phù hợp với bộ lọc.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportView;
