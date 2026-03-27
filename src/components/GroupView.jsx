import React, { useState } from 'react';

function GroupView({ groups = [], students = [], sessions = [], attendance = [], masterData = [], teachers = [], onUpdate }) {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || null);
  const [isMarking, setIsMarking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState({ date: new Date().toISOString().split('T')[0], teacherId: '', masterId: '' });
  const [newGroupData, setNewGroupData] = useState({ name: '', courseName: '' });
  const [tempAttendance, setTempAttendance] = useState({});

  const groupStudents = students.filter(s => s.groupId === selectedGroup);
  const groupSessions = sessions.filter(s => s.groupId === selectedGroup);

  const handleStartSession = () => {
    setIsMarking(true);
    setTempAttendance(groupStudents.reduce((acc, s) => ({ ...acc, [s.id]: { status: 'present', notes: '' } }), {}));
  };

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    const sessionId = 'S' + Date.now();
    const masterTopic = masterData.find(m => m.id === newSession.masterId)?.topic || 'Không rõ';
    const sessionObj = { ...newSession, id: sessionId, topic: masterTopic, groupId: selectedGroup };
    
    const newAttendanceRecords = groupStudents.map(s => ({
      id: 'A' + Math.random().toString(36).substr(2, 9),
      sessionId,
      studentId: s.id,
      ...tempAttendance[s.id]
    }));

    onUpdate({
      sessions: [...sessions, sessionObj],
      attendance: [...attendance, ...newAttendanceRecords]
    });

    setIsMarking(false);
    setNewSession({ date: new Date().toISOString().split('T')[0], teacherId: '', masterId: '' });
  };

  const getSessionAttendance = (sessionId) => {
    const sessionRecords = attendance.filter(a => a.sessionId === sessionId);
    return sessionRecords.map(a => {
      const student = students.find(s => s.id === a.studentId);
      return { ...a, studentName: student?.name || 'N/A' };
    });
  };

  const handleSaveSessionEdit = (e) => {
    e.preventDefault();
    const masterTopic = masterData.find(m => m.id === selectedSession.masterId)?.topic || selectedSession.topic;
    const updatedSession = { ...selectedSession, topic: masterTopic };
    const updatedSessions = sessions.map(s => s.id === selectedSession.id ? updatedSession : s);
    onUpdate({ sessions: updatedSessions });
    setIsEditing(false);
    setSelectedSession(updatedSession);
  };

  const handleSaveGroup = (e) => {
    e.preventDefault();
    if (!newGroupData.name) return;
    
    const newGroup = {
      ...newGroupData,
      id: 'G' + Date.now()
    };
    
    onUpdate({ groups: [...groups, newGroup] });
    setNewGroupData({ name: '', courseName: '' });
    setSelectedGroup(newGroup.id);
    setIsAddingGroup(false);
  };

  return (
    <div className="view">
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ flex: '1' }}>
          <h1>Nhóm Học</h1>
        </div>
        <div style={{ flex: '0 0 450px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select style={{ flex: '1', marginBottom: 0 }} value={selectedGroup || ''} onChange={e => setSelectedGroup(e.target.value)}>
            <option value="" disabled>-- Chọn nhóm --</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setIsAddingGroup(true)}>+ Nhóm mới</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{ flex: '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Lộ trình & Buổi học</h2>
            <button className="btn btn-primary" onClick={handleStartSession}>+ Điểm danh buổi mới</button>
          </div>

          <div className="grid">
            {groupSessions.map((session, index) => (
              <div key={session.id} className="glass-card session-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedSession(session)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="badge badge-warning">Buổi {index + 1}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{session.date}</span>
                </div>
                <h3 style={{ marginTop: '12px' }}>{session.topic}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Người chia sẻ: {(teachers || []).find(t => t.id === session.teacherId)?.name || 'N/A'}</p>
              </div>
            ))}
            {groupSessions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa có buổi học nào.</p>}
          </div>
        </div>

        <div style={{ flex: '0 0 350px' }}>
          <h2>Học viên trong nhóm</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groupStudents.map(student => (
              <div key={student.id} className="glass-card" style={{ padding: '16px' }}>
                {student.name}
              </div>
            ))}
            {groupStudents.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Chưa có học viên nào.</p>}
          </div>
        </div>
      </div>

      {selectedSession && (
        <div className="modal-overlay" onClick={() => { setSelectedSession(null); setIsEditing(false); }}>
          <div className="modal-content glass-card" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2>Chi tiết buổi học</h2>
              {!isEditing && <button className="btn btn-ghost" onClick={() => setIsEditing(true)}>✎ Sửa</button>}
            </div>
            
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label>Ngày học</label>
                    <input type="date" value={selectedSession.date} onChange={e => setSelectedSession({...selectedSession, date: e.target.value})} />
                  </div>
                  <div>
                    <label>Chủ đề</label>
                    <select 
                      value={selectedSession.masterId || ''} 
                      onChange={e => setSelectedSession({...selectedSession, masterId: e.target.value})}
                    >
                      {masterData.map(m => (
                        <option key={m.id} value={m.id}>{m.topic}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Người chia sẻ</label>
                    <select 
                      value={selectedSession.teacherId || ''} 
                      onChange={e => setSelectedSession({...selectedSession, teacherId: e.target.value})}
                    >
                      {(teachers || []).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={handleSaveSessionEdit}>Cập nhật</button>
                    <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Hủy</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{selectedSession.topic}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Ngày học: {selectedSession.date}</p>
                  <p style={{ color: 'var(--text-muted)' }}>Người chia sẻ: {(teachers || []).find(t => t.id === selectedSession.teacherId)?.name || 'N/A'}</p>
                </>
              )}
            </div>

            <h3>Danh sách điểm danh</h3>
            <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
              {getSessionAttendance(selectedSession.id).map((record, idx) => (
                <div key={idx} className="glass-card" style={{ marginBottom: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{record.studentName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {record.notes && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>({record.notes})</span>}
                    <span className={`badge ${record.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                      {record.status === 'present' ? 'Tham gia' : 'Vắng'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMarking && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '800px' }}>
            <h2>Ghi nhận buổi học mới</h2>
            <form onSubmit={handleSaveAttendance}>
              <div className="grid" style={{ marginBottom: '24px' }}>
                <div>
                  <label>Chủ đề (Từ chương trình chuẩn)</label>
                  <select 
                    required 
                    value={newSession.masterId} 
                    onChange={e => setNewSession({...newSession, masterId: e.target.value})}
                  >
                    <option value="">-- Chọn buổi học --</option>
                    {masterData.map(m => (
                      <option key={m.id} value={m.id}>{m.topic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Người chia sẻ</label>
                  <select 
                    required 
                    value={newSession.teacherId} 
                    onChange={e => setNewSession({...newSession, teacherId: e.target.value})}
                  >
                    <option value="">-- Chọn người chia sẻ --</option>
                    {(teachers || []).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h3>Điểm danh & Đánh giá</h3>
              <div style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: '24px' }}>
                {groupStudents.map(student => (
                  <div key={student.id} className="glass-card" style={{ marginBottom: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ flex: '1' }}>{student.name}</div>
                      <div style={{ flex: '1' }}>
                        <select 
                          style={{ marginBottom: 0 }}
                          value={tempAttendance[student.id]?.status}
                          onChange={e => setTempAttendance({
                            ...tempAttendance,
                            [student.id]: { ...tempAttendance[student.id], status: e.target.value }
                          })}
                        >
                          <option value="present">Tham gia</option>
                          <option value="absent">Vắng</option>
                        </select>
                      </div>
                      <div style={{ flex: '2' }}>
                        <input 
                          style={{ marginBottom: 0 }}
                          placeholder="Ghi chú đánh giá..." 
                          value={tempAttendance[student.id]?.notes}
                          onChange={e => setTempAttendance({
                            ...tempAttendance,
                            [student.id]: { ...tempAttendance[student.id], notes: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">Lưu buổi học</button>
                <button type="button" className="btn btn-ghost" onClick={() => setIsMarking(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingGroup && (
        <div className="modal-overlay" onClick={() => setIsAddingGroup(false)}>
          <div className="modal-content glass-card" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '24px' }}>Khai báo nhóm mới</h2>
            <form onSubmit={handleSaveGroup}>
              <div style={{ marginBottom: '16px' }}>
                <label>Tên nhóm học</label>
                <input 
                  required 
                  placeholder="VD: Nhóm Sáng Thứ 7" 
                  value={newGroupData.name}
                  onChange={e => setNewGroupData({...newGroupData, name: e.target.value})}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label>Tên khóa học / Chương trình</label>
                <input 
                  placeholder="VD: Web Development Basics" 
                  value={newGroupData.courseName}
                  onChange={e => setNewGroupData({...newGroupData, courseName: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Tạo nhóm</button>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIsAddingGroup(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupView;
