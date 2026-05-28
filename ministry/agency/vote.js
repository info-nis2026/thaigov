const API_URL = "https://script.google.com/macros/s/AKfycbwUVQmvY5LwosLN88Ym_GmQpCqscWDjLljUlrRKVCWJgzTGsulkpZlgXlxBNdMpJ27v/exec";

async function loadCabinetResolutions() {

    const container = document.getElementById("resolutionContainer");
    const loadingBox = document.getElementById("loadingBox");

    container.innerHTML = "";
    loadingBox.style.display = "block";

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        loadingBox.style.display = "none";

        if (!data || data.length === 0) {

            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning rounded-4 shadow-sm">
                        ไม่พบข้อมูลมติคณะรัฐมนตรี
                    </div>
                </div>
            `;

            return;
        }

        data.reverse();

        data.forEach(item => {

            let resultHTML = "";

            const result = item["ผลการลงมติ"] || "";

            if (result.includes("เห็นชอบ")) {
                resultHTML += `
                    <span class="badge bg-success me-1">
                        ${result.match(/เห็นชอบ\s\d+/)?.[0] || "เห็นชอบ"}
                    </span>
                `;
            }

            if (result.includes("ไม่เห็นชอบ")) {
                resultHTML += `
                    <span class="badge bg-danger me-1">
                        ${result.match(/ไม่เห็นชอบ\s\d+/)?.[0] || "ไม่เห็นชอบ"}
                    </span>
                `;
            }

            if (result.includes("งดออกเสียง")) {
                resultHTML += `
                    <span class="badge bg-warning text-dark me-1">
                        ${result.match(/งดออกเสียง\s\d+/)?.[0] || "งดออกเสียง"}
                    </span>
                `;
            }

            container.innerHTML += `

                <div class="col-lg-6">

                    <div class="card border-0 shadow-sm rounded-4 h-100">

                        <div class="card-body p-4">

                            <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">

                                <span class="badge bg-primary rounded-pill px-3 py-2">
                                    ${item["วันที่ลงมติ"] || "-"}
                                </span>

                                <div>
                                    ${resultHTML}
                                </div>

                            </div>

                            <h5 class="fw-bold mb-3 lh-base">
                                ${item["เสนอเรื่อง"] || "-"}
                            </h5>

                            <div class="text-muted small mb-3">

                                <div class="mb-1">
                                    <i class="bi bi-person-fill me-1"></i>
                                    <strong>ผู้เสนอ:</strong>
                                    ${item["ชื่อผู้เสนอ/ประธานที่ประชุม"] || "-"}
                                </div>

                                <div>
                                    <i class="bi bi-briefcase-fill me-1"></i>
                                    <strong>ตำแหน่ง:</strong>
                                    ${item["ตำแหน่งผู้เสนอ"] || "-"}
                                </div>

                            </div>

                            ${item["ไฟล์ (ถ้ามี)"] ? `
                                <a href="${item["ไฟล์ (ถ้ามี)"]}" 
                                   target="_blank"
                                   class="btn btn-outline-secondary rounded-pill">

                                    <i class="bi bi-file-earmark-arrow-down"></i>
                                    เปิดเอกสาร

                                </a>
                            ` : ""}

                        </div>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

        loadingBox.style.display = "none";

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger rounded-4 shadow-sm">
                    ไม่สามารถโหลดข้อมูลได้
                </div>
            </div>
        `;
    }
}

loadCabinetResolutions();
