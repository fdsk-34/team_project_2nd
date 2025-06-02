const urlParams = new URLSearchParams(window.location.search);
const announcementId = urlParams.get('id');
let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
const ADMIN_PASSWORD = 'admin123';

announcements = announcements.map(announcement => ({
    ...announcement,
    id: String(announcement.id),
    views: announcement.views || 0,
    password: announcement.password || ''
}));
localStorage.setItem('announcements', JSON.stringify(announcements));

function loadAnnouncement() {
    if (!announcementId) {
        document.getElementById('announcement-details').innerHTML = '<p>잘못된 공지사항 ID입니다.</p>';
        console.log('Error: No announcementId provided');
        return;
    }

    const announcement = announcements.find(a => a.id === announcementId || a.id === String(announcementId));
    console.log('Found announcement:', announcement);

    if (!announcement) {
        document.getElementById('announcement-details').innerHTML = '<p>공지사항을 찾을 수 없습니다. 공지사항이 삭제되었거나 존재하지 않습니다.</p>';
        console.log('Error: Announcement not found for ID', announcementId);
        return;
    }

    announcement.views = (announcement.views || 0) + 1;
    localStorage.setItem('announcements', JSON.stringify(announcements));
    console.log('Updated announcement with views:', announcement);

    document.getElementById('announcement-details').innerHTML = `
        <label for="announcement-title">제목</label>
        <input type="text" id="announcement-title" value="${announcement.title || '제목 없음'}" readonly>
        <label for="announcement-author">작성자</label>
        <input type="text" id="announcement-author" value="${announcement.author || '관리자'}" readonly>
        <label for="announcement-date">작성일</label>
        <input type="text" id="announcement-date" value="${new Date(announcement.createdAt).toLocaleDateString('ko-KR')}" readonly>
        <label for="announcement-views">조회수</label>
        <input type="text" id="announcement-views" value="${announcement.views || 0}" readonly>
        <label for="announcement-content">내용</label>
        <textarea id="announcement-content" readonly>${announcement.content || ''}</textarea>
    `;
}

function openDeleteAuth() {
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('delete-auth-panel').classList.add('open');
    document.getElementById('delete-password').value = '';
}

function closeDeleteAuth() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('delete-auth-panel').classList.remove('open');
}

function verifyAndDelete() {
    const inputPassword = document.getElementById('delete-password').value.trim();
    if (!inputPassword) {
        alert('암호를 입력해주세요.');
        return;
    }

    if (inputPassword !== ADMIN_PASSWORD) {
        alert('관리자 암호가 올바르지 않습니다.');
        return;
    }

    const announcement = announcements.find(a => a.id === announcementId || a.id === String(announcementId));
    if (!announcement) {
        alert('공지사항을 찾을 수 없습니다.');
        closeDeleteAuth();
        return;
    }

    if (!confirm('공지사항을 삭제하시겠습니까?')) return;

    announcements = announcements.filter(a => a.id !== announcementId && a.id !== String(announcementId));
    localStorage.setItem('announcements', JSON.stringify(announcements));
    console.log('Announcement deleted, remaining announcements:', announcements);
    alert('공지사항이 삭제되었습니다.');
    closeDeleteAuth();
    location.href = '07_teamproj_announcement.html';
}

function closeAnnouncement() {
    location.href = '07_teamproj_announcement.html';
}

loadAnnouncement();