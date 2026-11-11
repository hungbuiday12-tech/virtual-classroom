
/* =====================================
   VIRTUAL CLASSROOM
   JAVASCRIPT
===================================== */


/* 1. CHUYỂN TRANG */

function showPage(page, button) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(p => {
        p.classList.remove("active");
    });

    const selectedPage = document.getElementById(page);

    if (!selectedPage) return;

    selectedPage.classList.add("active");

    document.querySelectorAll(".nav").forEach(b => {
        b.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        document.querySelectorAll(".nav").forEach(b => {
            if (b.getAttribute("onclick")?.includes("'" + page + "'")) {
                b.classList.add("active");
            }
        });
    }

    const names = {
        home: "Tổng quan",
        math: "Phòng Toán",
        physics: "Phòng Vật lí",
        informatics: "Phòng Tin học",
        progress: "Tiến độ học tập"
    };

    document.getElementById("current").textContent = names[page] || "";

    if (page === "math") {
        requestAnimationFrame(drawGraph);
    }
}


/* 2. GIAO DIỆN SÁNG / TỐI */

function toggleTheme() {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");

    localStorage.setItem("theme", isLight ? "light" : "dark");

    document.getElementById("theme").textContent =
        isLight ? "☾" : "☼";
}


/* 3. VẼ ĐỒ THỊ HÀM SỐ */

function drawGraph() {
    const canvas = document.getElementById("graph");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    const scale = 35;

    ctx.clearRect(0, 0, w, h);

    // Nền đồ thị

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Lưới tọa độ

    ctx.strokeStyle = "#e8eaf0";
    ctx.lineWidth = 1;

    for (let x = cx % scale; x < w; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }

    for (let y = cy % scale; y < h; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // Trục tọa độ

    ctx.strokeStyle = "#596579";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);

    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);

    ctx.stroke();

    // Lấy biểu thức

    const equation = document.getElementById("equation");

    if (!equation) return;

    try {
        let expression = equation.value
            .replace(/\^/g, "**")
            .replace(/X/g, "x")
            .trim();

        if (expression === "") {
            throw new Error("Chưa nhập biểu thức");
        }

        // KIỂM TRA BIỂU THỨC
        // Đã sửa lỗi cú pháp regex

        if (!/^[0-9x+\-*\/().\s]+$/.test(expression)) {
            throw new Error("Biểu thức không hợp lệ");
        }

        const f = new Function(
            "x",
            '"use strict"; return (' + expression + ');'
        );

        // Vẽ đồ thị

        ctx.strokeStyle = "#6378dc";
        ctx.lineWidth = 3;
        ctx.beginPath();

        let started = false;

        for (let px = 0; px <= w; px++) {
            const x = (px - cx) / scale;
            const y = f(x);

            if (!Number.isFinite(y) || Math.abs(y) > 1000) {
                started = false;
                continue;
            }

            const py = cy - y * scale;

            if (py < -1000 || py > h + 1000) {
                started = false;
                continue;
            }

            if (!started) {
                ctx.moveTo(px, py);
                started = true;
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();

    } catch (error) {
        ctx.fillStyle = "#d9534f";
        ctx.font = "16px Arial";
        ctx.fillText("Biểu thức hàm số không hợp lệ!", 20, 30);
    }
}


/* 4. MÔ PHỎNG VẬT LÍ */

let physicsTimer = null;

function updatePhysics() {
    const speed = document.getElementById("speed");
    const duration = document.getElementById("duration");

    if (!speed || !duration) return;

    const v = Number(speed.value);
    const t = Number(duration.value);

    const s = v * t;

    document.getElementById("speedValue").textContent = v;
    document.getElementById("timeValue").textContent = t;
    document.getElementById("time").textContent = t.toFixed(1);
    document.getElementById("distance").textContent = s.toFixed(1);

    document.getElementById("object").style.left =
        (t / 10 * 95) + "%";
}

function stopPhysics() {
    if (physicsTimer !== null) {
        clearInterval(physicsTimer);
        physicsTimer = null;
    }
}

function playPhysics() {
    const duration = document.getElementById("duration");

    if (!duration) return;

    stopPhysics();

    if (Number(duration.value) >= 10) {
        duration.value = 0;
        updatePhysics();
    }

    let current = Number(duration.value);

    physicsTimer = setInterval(function() {
        current = Math.min(current + 0.1, 10);

        duration.value = current.toFixed(1);

        updatePhysics();

        if (current >= 10) {
            stopPhysics();
        }
    }, 100);
}

function resetPhysics() {
    const duration = document.getElementById("duration");

    if (!duration) return;

    stopPhysics();

    duration.value = 0;

    updatePhysics();
}


/* 5. PHÒNG TIN HỌC */

function changeLanguage() {
    const language = document.getElementById("language").value;
    const code = document.getElementById("code");

    if (language === "cpp") {
        code.value =
`#include <bits/stdc++.h>
using namespace std;

int main()
{
    cout << "Hello World!";
    return 0;
}`;

    } else {
        code.value =
`print("Hello World!")`;
    }
}

function runCode() {
    const language = document.getElementById("language").value;

    document.getElementById("output").textContent =
        "Bạn đang sử dụng " +
        (language === "cpp" ? "C++" : "Python") +
        ".\nChức năng chạy code sẽ được kết nối với máy chủ biên dịch.";
}

function submitCode() {
    document.getElementById("output").textContent =
        "Chức năng nộp bài và chấm test đang được phát triển.";
}


/* 6. KHỞI TẠO WEBSITE */

document.addEventListener("DOMContentLoaded", function() {

    // Khôi phục giao diện

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        document.getElementById("theme").textContent = "☾";
    } else {
        document.body.classList.remove("light");
        document.getElementById("theme").textContent = "☼";
    }

    // Sự kiện đồ thị

    const equation = document.getElementById("equation");

    if (equation) {
        equation.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                drawGraph();
            }
        });
    }

    // Sự kiện mô phỏng vật lí

    const speed = document.getElementById("speed");
    const duration = document.getElementById("duration");

    if (speed) {
        speed.addEventListener("input", updatePhysics);
    }

    if (duration) {
        duration.addEventListener("input", function() {
            stopPhysics();
            updatePhysics();
        });
    }

    // Khởi tạo

    updatePhysics();
    drawGraph();

});
