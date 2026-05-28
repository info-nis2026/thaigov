const API_URL = "https://script.google.com/macros/s/AKfycbzFxKRXCppnsS6fmVvv1N9u2PtdUpBCBAf22YvPqNT1oOf47xh6EYDCyRNwYYoUOuECuQ/exec";

let allData = [];
let currentIndex = 0;
const step = 10;
let page = 1;
const perPage = 100;

// โหลดข้อมูล
async function loadData() {
    try {
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.status === "success") {
            allData = json.data;

            initTypeFilter();
            renderTop2();
            renderMore();

            hideLoader(); // 👈 เพิ่มตรงนี้
        }
    } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ", err);
        hideLoader(); // กันค้าง
    }
}

// ซ่อน loader
function hideLoader() {
    const loader = document.getElementById("pageLoader");
    loader.classList.add("hide");

    // ลบออกจาก DOM (optional)
    setTimeout(() => {
        loader.remove();
    }, 500);
}

// -------------------------
// 🔹 2 รายการแรก
// -------------------------
function renderTop2() {
    const container = document.getElementById("new-ratchakitcha");

    const top2 = allData.slice(0, 2);

    container.innerHTML = top2.map(item => `
        <div class="flex">
            <div class="left">
                <div class="type">
                    <div class="type-top">ประเภท</div>
                    <div class="type-bottom">${item.type}</div>
                </div>
            </div>
            <div class="right">
                <a href="${item.link}" target="_blank">
                    <div class="title">${item.name}</div>
                    <div class="bottom">
                        <div class="time"><i class="fa-solid fa-calendar"></i>${item.day} </div>
                        <div class="book"><i class="fa-solid fa-book"></i> ${item.book}</div>
                    </div>
                </a>
            </div>
        </div>
    `).join("");
}

// -------------------------
// 🔹 โหลดเพิ่มทีละ 10
// -------------------------
function renderMore() {
    const container = document.getElementById("all-ratchakitcha");

    // 🔥 คำนวณช่วงของ page
    const start = (page - 1) * perPage;
    const end = page * perPage;

    // 🔥 จำกัดเฉพาะใน page
    const pageData = allData.slice(start, end);

    // 🔥 โหลดทีละ 10 ใน page นั้น
    const nextData = pageData.slice(currentIndex, currentIndex + step);

    nextData.forEach(item => {
        const html = `
            <div class="flex">
                <div class="right">
                    <a href="${item.link}" target="_blank">
                        <div class="title">${item.name}</div>
                        <div class="bottom">
                            <div class="time"><i class="fa-solid fa-calendar"></i>${item.day} </div>
                            <div class="book"><i class="fa-solid fa-book"></i> ${item.book}</div>
                        </div>
                    </a>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
    });

    currentIndex += step;

    renderLoadMoreButton(pageData);
}

// -------------------------
// 🔹 ปุ่มโหลดเพิ่ม
// -------------------------
function renderLoadMoreButton(pageData) {
    let btn = document.getElementById("loadMoreBtn");
    if (btn) btn.remove();

    // 🔥 ยังโหลดใน page ไม่ครบ
    if (currentIndex < pageData.length) {
        const container = document.getElementById("all-ratchakitcha");

        btn = document.createElement("button");
        btn.id = "loadMoreBtn";
        btn.className = "btn btn-primary w-100 mt-3";
        btn.innerText = "ดูเพิ่ม";
        btn.onclick = renderMore;

        container.appendChild(btn);
    } 
    // 🔥 ครบ 100 แล้ว → เปลี่ยนหน้า
    else {
        renderPagination();
    }
}

// เริ่มทำงาน
loadData();

// เก็บข้อมูล filter
let filteredData = [];

// -------------------------
// 🔹 สร้าง dropdown ประเภท
// -------------------------
function initTypeFilter() {
    const select = document.getElementById("typeFilter");

    // เอา type ไม่ซ้ำ
    let types = [...new Set(allData.map(item => item.type))];

    // 🔥 เรียงแบบภาษาไทย (ก-ฮ)
    types.sort((a, b) => a.localeCompare(b, 'th'));

    // ล้าง option เก่า (กันซ้ำ)
    select.innerHTML = '<option value="">ทุกประเภท</option>';

    // ใส่ option
    types.forEach(t => {
        if (!t) return; // กันค่าว่าง
        const option = document.createElement("option");
        option.value = t;
        option.textContent = t;
        select.appendChild(option);
    });
}

// -------------------------
// 🔹 ค้นหา
// -------------------------
function searchData() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const type = document.getElementById("typeFilter").value;

    filteredData = allData.filter(item => {
        const matchKeyword =
            item.name.toLowerCase().includes(keyword) ||
            item.search_key.some(k => k.toLowerCase().includes(keyword));

        const matchType = type ? item.type === type : true;

        return matchKeyword && matchType;
    });

    // reset index
    page = 1;
    currentIndex = 0;

    // clear
    document.getElementById("all-ratchakitcha").innerHTML = "";

    renderMoreFiltered();
}

// -------------------------
// 🔹 render filtered
// -------------------------
function renderMoreFiltered() {
    const container = document.getElementById("all-ratchakitcha");

    const nextData = filteredData.slice(currentIndex, currentIndex + step);

    nextData.forEach(item => {
        const html = `
            <div class="flex">
                <div class="right">
                    <a href="${item.link}" target="_blank">
                        <div class="title">${item.name}</div>
                        <div class="bottom">
                            <div class="time">${item.day}</div>
                            <div class="book">${item.book}</div>
                        </div>
                    </a>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
    });

    currentIndex += step;

    renderLoadMoreButtonFiltered();
}

// -------------------------
// 🔹 ปุ่มโหลดเพิ่ม (filtered)
// -------------------------
function renderLoadMoreButtonFiltered() {
    let btn = document.getElementById("loadMoreBtn");

    if (btn) btn.remove();

    if (currentIndex >= filteredData.length) return;

    const container = document.getElementById("all-ratchakitcha");

    btn = document.createElement("button");
    btn.id = "loadMoreBtn";
    btn.className = "btn btn-primary w-100 mt-3";
    btn.innerText = "ดูเพิ่ม";

    btn.onclick = renderMoreFiltered;

    container.appendChild(btn);
}

function renderPagination() {
    let old = document.getElementById("pagination");
    if (old) old.remove();

    const totalPages = Math.ceil(allData.length / perPage);

    const container = document.getElementById("all-ratchakitcha");

    const div = document.createElement("div");
    div.id = "pagination";
    div.className = "d-flex justify-content-center mt-4 gap-2 flex-wrap";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary";
        btn.innerText = i;

        if (i === page) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            page = i;
            currentIndex = 0;
            container.innerHTML = "";
            renderMore();
        };

        div.appendChild(btn);
    }

    container.appendChild(div);
}