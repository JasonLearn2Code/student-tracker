import React, { useState, useEffect } from 'react';
import { loadData, saveData } from './data';
import StudentView from './components/StudentView';
import GroupView from './components/GroupView';
import ReportView from './components/ReportView';
import MasterDataView from './components/MasterDataView';
import TamDaoView from './components/TamDaoView';
import TeacherView from './components/TeacherView';
import './index.css';

function App() {
  const [data, setData] = useState(loadData());
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = (newData) => {
    setData({ ...data, ...newData });
  };

  return (
    <div className="app">
      <nav>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          🎓 StudentTracker
        </div>
        <div className="nav-links">
          <span 
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Học Viên
          </span>
          <span 
            className={`nav-link ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            Nhóm Học
          </span>
          <span 
            className={`nav-link ${activeTab === 'tam_dao' ? 'active' : ''}`}
            onClick={() => setActiveTab('tam_dao')}
          >
            Hệ Thống Tâm Đạo
          </span>
          <span 
            className={`nav-link ${activeTab === 'curriculum' ? 'active' : ''}`}
            onClick={() => setActiveTab('curriculum')}
          >
            Chương Trình
          </span>
          <span 
            className={`nav-link ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            Người Chia Sẻ
          </span>
          <span 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Báo Cáo
          </span>
        </div>
        <div className="user-profile" style={{ color: 'var(--text-muted)' }}>
          Admin
        </div>
      </nav>

      <main className="container">
        {activeTab === 'students' && (
          <StudentView 
            students={data.students} 
            groups={data.groups}
            sessions={data.sessions}
            attendance={data.attendance}
            onUpdate={(students) => updateData({ students })}
          />
        )}
        {activeTab === 'groups' && (
          <GroupView 
            groups={data.groups} 
            students={data.students}
            sessions={data.sessions}
            attendance={data.attendance}
            masterData={data.masterData}
            teachers={data.teachers}
            onUpdate={(newData) => updateData(newData)}
          />
        )}
        {activeTab === 'curriculum' && (
          <MasterDataView 
            masterData={data.masterData}
            onUpdate={(masterData) => updateData({ masterData })}
          />
        )}
        {activeTab === 'teachers' && (
          <TeacherView 
            teachers={data.teachers}
            onUpdate={(teachers) => updateData({ teachers })}
          />
        )}
        {activeTab === 'tam_dao' && (
          <TamDaoView 
            students={data.students}
          />
        )}
        {activeTab === 'reports' && (
          <ReportView 
            students={data.students}
            groups={data.groups}
            sessions={data.sessions}
            attendance={data.attendance}
          />
        )}
      </main>
    </div>
  );
}

export default App;
