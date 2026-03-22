const itemsPerPage = 30;
let currentPage = 1;
let filteredSongs = [];

function updateDisplay() {
    const searchInput = document.getElementById('search-input');
    const keywords = searchInput ? searchInput.value.toLowerCase().replace(/　/g, ' ').split(' ').filter(word => word !== "") : [];
    
    let results = songList.filter(songData => {
        const songName = (songData[0] || "").toLowerCase();
        const memberName = (songData[1] || "").toLowerCase();
        const combinedText = songName + " " + memberName;
        return keywords.every(keyword => combinedText.includes(keyword));
    });

    results.reverse();
    filteredSongs = results;

    const totalCountEl = document.getElementById('total-count');
    const hitCountEl = document.getElementById('hit-count');
    
    if (totalCountEl) totalCountEl.innerText = songList.length;
    if (hitCountEl) hitCountEl.innerText = filteredSongs.length;

    const maxPage = Math.ceil(filteredSongs.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
        currentPage = maxPage;
    }

    displaySongs(currentPage);
}

function displaySongs(page) {
    const container = document.getElementById('song-list-container');
    const pageInfo = document.getElementById('current-page-num');
    
    if (!container) return;

    container.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slicedSongs = filteredSongs.slice(start, end);

    if (slicedSongs.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888; font-size: 18px;">
            該当する楽曲が見つかりませんでした。キーワードを変更して再度検索してください。
        </p>`;
    }

    slicedSongs.forEach(songData => {
        const songName = songData[0];
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <a href="収録楽曲一覧/${songName}.html">
                <img src="img/cover_art/${songName}.jpg" alt="${songName}" loading="lazy">
            </a>
            <p>${songName}</p>
        `;
        container.appendChild(card);
    });

    const maxPage = Math.ceil(filteredSongs.length / itemsPerPage) || 1;
    if (pageInfo) {
        pageInfo.innerText = `${page} / ${maxPage}`;
    }
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.disabled = (page === 1);
    if (nextBtn) nextBtn.disabled = (page === maxPage);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            updateDisplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displaySongs(currentPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(filteredSongs.length / itemsPerPage);
            if (currentPage < maxPage) {
                currentPage++;
                displaySongs(currentPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    updateDisplay();
});