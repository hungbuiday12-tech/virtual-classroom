
function showPage(page, button) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    document.querySelectorAll(".nav").forEach(b => {
        b.classList.remove("active");
    });

    if (button) button.classList.add("active");

    const names = {
        home: "Tổng quan",
        math: "Phòng Toán",
        physics: "Phòng Vật lí",
        informatics: "Phòng Tin học",
        progress: "Tiến độ học tập"
    };

    document.getElementById("current").textContent = names[page];

    if (page === "math") {
        setTimeout(drawGraph, 50);
    }
}

// Đổi giao diện sáng / tối
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// VẼ ĐỒ THỊ HÀM SỐ
function drawGraph() {
    const canvas = document.getElementById("graph");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const scale = 35;

    ctx.clearRect(0, 0, w, h);
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

    // Vẽ hàm số
    try {
        let expression = document.getElementById("equation").value
            .replace(/\^/g, "**");

        if (!/^[0-9xX+\-*/().\s*]+$/.test(expression)) {
            throw new Error("Biểu thức không hợp lệ");
        }

        const f = new Function(
            "x",
            '"use strict"; return (' + expression.replace(/X/g, "x") + ');'
        );

        ctx.strokeStyle = "#6378dc";
        ctx.lineWidth = 3;
        ctx.beginPath();

        let started = false;

        for (let px = 0; px <= w; px++) {
            let x = (px - cx) / scale;
            let y = f(x);

            if (!Number.isFinite(y) || Math.abs(y) > 1000) {
                started = false;
                continue;
            }

            let py = cy - y * scale;

            if (!started) {
                ctx.moveTo(px, py);
                started = true;
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();
    } catch (error) {
        alert("Hàm số không hợp lệ!");
    }
}

document.getElementById("equation").addEventListener(
    "keydown",
    function(e) {
        if (e.key === "Enter") drawGraph();
    }
);

// MÔ PHỎNG VẬT LÍ
const speed = document.getElementById("speed");
const duration = document.getElementById("duration");

speed.oninput = updatePhysics;
duration.oninput = updatePhysics;

function updatePhysics() {
    let v = Number(speed.value);
    let t = Number(duration.value);
    let s = v * t;

    document.getElementById("speedValue").textContent = v;
    document.getElementById("timeValue").textContent = t;
    document.getElementById("time").textContent = t.toFixed(1);
    document.getElementById("distance").textContent = s.toFixed(1);

    document.getElementById("object").style.left =
        (t / 10 * 95) + "%";
}

function playPhysics() {
    let t = Number(duration.value);

    if (t >= 10) {
        duration.value = 0;
    }

    let current = Number(duration.value);

    let timer = setInterval(function() {
        current += 0.1;

        if (current >= 10) {
            current = 10;
            clearInterval(timer);
        }

        duration.value = current;
        updatePhysics();
    }, 100);
}

function resetPhysics() {
    duration.value = 0;
    updatePhysics();
}

updatePhysics();

// TIN HỌC
function changeLanguage() {
    let language = document.getElementById("language").value;
    let code = document.getElementById("code");

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
    let language = document.getElementById("language").value;

    document.getElementById("output").textContent =
        "Bạn đang sử dụng " +
        (language === "cpp" ? "C++" : "Python") +
        ".\nChức năng chạy code sẽ được kết nối với máy chủ biên dịch.";
}

function submitCode() {
    document.getElementById("output").textContent =
        "Chức năng nộp bài và chấm test đang được phát triển.";
}

// Khởi tạo
drawGraph();
