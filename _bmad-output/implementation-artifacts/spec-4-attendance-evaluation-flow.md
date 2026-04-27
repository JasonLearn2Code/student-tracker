---
title: 'Cải thiện flow điểm danh & đánh giá học viên'
type: 'feature'
created: '2026-04-27'
status: 'done'
baseline_commit: 'NO_VCS'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Flow điểm danh hiện tại đi thẳng vào form đánh giá không có bước xem trước. Đánh giá chỉ có 1 field "ghi chú" tự do, thiếu mức độ tiến bộ. Badge mức độ tiến bộ trong hành trình học viên bị lỗi vì DB lưu integer 1-5 nhưng UI đọc enum string.

**Approach:** (1) Thêm bước "Xem danh sách trước khi điểm danh" (FR23). (2) Nâng cấp field ghi chú thành form đánh giá có cấu trúc với nhận xét + mức độ tiến bộ 1-5 (FR22). (3) Fix badge hiển thị progress_level từ integer 1-5 thay vì enum string (FR31).

## Boundaries & Constraints

**Always:** Giữ nguyên data model hiện tại (attendance.notes + care_attendance.progress_level integer 1-5). Mức độ tiến bộ cho điểm danh người chia sẻ cũng dùng integer 1-5 cho nhất quán.

**Ask First:** Thay đổi schema attendance table (thêm cột progress_level).

**Never:** Không thêm authentication. Không thay đổi care_giver flow. Không thêm tính năng báo cáo mới.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Pre-session review | Click "Điểm danh buổi mới" | Hiện danh sách học viên nhóm + button "Bắt đầu điểm danh" | N/A |
| Save evaluation | Điền nhận xét + chọn mức 1-5, bấm Lưu | Lưu notes + progress_level vào attendance record | progress_level mặc định = 3 nếu không chọn |
| View progress badge | Mở hành trình học viên có care_attendance | Hiện badge "Tốt/Khá/Cần cải thiện" tương ứng 4-5/3/1-2 | progress_level null → không hiện badge |

</frozen-after-approval>

## Code Map

- `src/components/GroupView.jsx` -- Thêm bước xem trước + nâng cấp form đánh giá
- `src/components/StudentView.jsx` -- Fix getProgressLevelBadge để map integer 1-5
- `src/data-supabase.js` -- Có thể cần cập nhật nếu thêm cột progress_level cho attendance

## Tasks & Acceptance

**Execution:**
- [x] `src/components/GroupView.jsx` -- Thêm bước "Xem danh sách" trước form điểm danh (FR23). Click "Điểm danh buổi mới" → hiện danh sách học viên + nút "Bắt đầu điểm danh" → chuyển sang form đánh giá
- [x] `src/components/GroupView.jsx` -- Nâng cấp form đánh giá: thêm progress_level (1-5) cho từng học viên bên cạnh field notes (FR22). Giữ nguyên tempAttendance structure, thêm key progress_level
- [x] `src/components/StudentView.jsx` -- Fix getProgressLevelBadge: map integer 1-2 → "Cần cải thiện", 3 → "Khá", 4-5 → "Tốt" (FR31)
- [x] `src/data-supabase.js` -- Nếu attendance table cần cột progress_level, thêm SQL migration và cập nhật syncTableToSupabase

**Acceptance Criteria:**
- Given tôi là người chia sẻ, when tôi bấm "Điểm danh buổi mới", then tôi thấy danh sách học viên trước khi đi vào form đánh giá
- Given tôi đang điểm danh, when tôi nhập nhận xét và chọn mức tiến bộ, then đánh giá được lưu cùng progress_level
- Given tôi xem hành trình học viên có đánh giá từ kíp chăm sóc, when progress_level = 5, then hiện badge "Tốt"

## Spec Change Log

## Design Notes

### Progress Level Mapping (nhất quán cross-system)
```
1-2 → "Cần cải thiện" (badge-danger/warning)
3   → "Khá" (badge-warning)  
4-5 → "Tốt" (badge-success)
```

### Pre-session Flow
```
[Button: Điểm danh buổi mới]
  → Step 1: Danh sách học viên (chỉ đọc) + [Bắt đầu điểm danh]
  → Step 2: Form điểm danh & đánh giá (như hiện tại + progress_level)
```

### Attendance Data Extension
```
tempAttendance[studentId] = {
  status: 'present' | 'absent',
  notes: '...',        // existing
  progress_level: 3    // new, default 3
}
```

## Verification

**Commands:**
- `npm run lint` -- expected: 0 errors
- `npm run build` -- expected: build success

**Manual checks:**
- Mở GroupView, bấm "Điểm danh buổi mới" → verify thấy bước xem danh sách trước
- Điền đánh giá với progress_level → verify lưu thành công
- Mở StudentView, bấm vào học viên có care attendance → verify badge "Tốt/Khá/Cần cải thiện" hiển thị đúng

## Suggested Review Order

**Pre-session review flow (FR23)**

- Entry point: two-step marking flow state
  [`GroupView.jsx:6`](../../src/components/GroupView.jsx#L6)

- Start handler with review-first logic + disabled guards
  [`GroupView.jsx:17`](../../src/components/GroupView.jsx#L17)

- Group select disabled during marking (edge case fix)
  [`GroupView.jsx:93`](../../src/components/GroupView.jsx#L93)

- Empty-group guard on start button
  [`GroupView.jsx:107`](../../src/components/GroupView.jsx#L107)

- Review step modal with read-only student list
  [`GroupView.jsx:211`](../../src/components/GroupView.jsx#L211)

**Progress level evaluation (FR22)**

- progressLevel initialization with default 3
  [`GroupView.jsx:20`](../../src/components/GroupView.jsx#L20)

- Progress level select in form (1-5 scale)
  [`GroupView.jsx:294`](../../src/components/GroupView.jsx#L294)

**Progress badge display (FR31)**

- Badge mapping: integer 1-5 → Tốt/Khá/Cần cải thiện
  [`GroupView.jsx:53`](../../src/components/GroupView.jsx#L53)

- Badge in session detail modal
  [`GroupView.jsx:192`](../../src/components/GroupView.jsx#L192)

- StudentView badge fix (enum→integer mapping)
  [`StudentView.jsx:104`](../../src/components/StudentView.jsx#L104)

- Teacher evaluation progressLevel from attendance data
  [`StudentView.jsx:60`](../../src/components/StudentView.jsx#L60)

**Schema change**

- DB migration for progressLevel column
  [`supabase-migration.sql:56`](../../supabase-migration.sql#L56)
