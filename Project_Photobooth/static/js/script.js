const video = document.getElementById('video');
const singleFrameOverlay = document.getElementById('singleFrameOverlay');
const captureBtn = document.getElementById('captureBtn');
const countdownEl = document.getElementById('countdown');
const flashEl = document.getElementById('flash');
const resultModal = document.getElementById('resultModal');
const resultImage = document.getElementById('resultImage');
const downloadLink = document.getElementById('downloadLink');
const retakeBtn = document.getElementById('retakeBtn');

let currentTheme = '1';
let currentFilter = 'none';
let isCapturing = false;

// 1. Inisialisasi Kamera
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };
    } catch (err) {
        alert("Gagal mengakses kamera: " + err.message);
    }
}
initCamera();

// 2. Event Listener Tema
document.querySelectorAll('#themeOptions .option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#themeOptions .option-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTheme = e.target.dataset.value;
        singleFrameOverlay.src = `/static/frames/frame_single_${currentTheme}.png`;
    });
});

// 3. Event Listener Filter
document.querySelectorAll('#filterOptions .option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#filterOptions .option-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.value;
        video.style.filter = currentFilter;
    });
});

// 4. Logika Hitung Mundur
function showCountdown(num) {
    return new Promise(resolve => {
        countdownEl.style.display = 'block';
        countdownEl.innerText = num;

        const timer = setInterval(() => {
            num--;
            if (num > 0) {
                countdownEl.innerText = num;
            } else {
                clearInterval(timer);
                countdownEl.style.display = 'none';
                resolve();
            }
        }, 1000);
    });
}

// 5. Efek Flash
function triggerFlash() {
    flashEl.style.opacity = 1;
    setTimeout(() => { flashEl.style.opacity = 0; }, 100);
}

// 6. Capture Foto
captureBtn.addEventListener('click', async () => {
    if (isCapturing) return;
    isCapturing = true;
    captureBtn.disabled = true;
    captureBtn.innerText = "SEDANG MENGAMBIL...";

    let photos = [];

    for (let i = 1; i <= 4; i++) {
        let time = (i === 1) ? 3 : 2;
        await showCountdown(time);
        triggerFlash();

        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const videoRatio = videoWidth / videoHeight;
        const canvasRatio = canvas.width / canvas.height;

        let sWidth, sHeight, sx, sy;

        if (videoRatio > canvasRatio) {
            sHeight = videoHeight;
            sWidth = sHeight * canvasRatio;
            sx = (videoWidth - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = videoWidth;
            sHeight = sWidth / canvasRatio;
            sx = 0;
            sy = (videoHeight - sHeight) / 2;
        }

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        if (currentFilter !== 'none') {
            ctx.filter = currentFilter;
        }

        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        photos.push(canvas.toDataURL('image/png'));
    }

    captureBtn.innerText = "MEMPROSES...";

    try {
        const response = await fetch('/save_photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photos: photos, theme: currentTheme })
        });
        const data = await response.json();

        if (data.success) {
            // PERUBAHAN UTAMA:
            // Menggunakan Base64 string langsung, bukan URL file
            resultImage.src = data.image_data;
            downloadLink.href = data.image_data;

            // Generate nama file unik untuk download
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            downloadLink.download = `photostrip_${timestamp}.png`;

            resultModal.style.display = 'flex';
        } else {
            alert("Gagal memproses: " + (data.error || "Unknown error"));
        }

    } catch (e) {
        console.error(e);
        alert("Terjadi kesalahan koneksi.");
    } finally {
        isCapturing = false;
        captureBtn.disabled = false;
        captureBtn.innerText = "📸 MULAI FOTO";
    }
});

// 7. Tombol Ulang
retakeBtn.addEventListener('click', () => {
    resultModal.style.display = 'none';
    resultImage.src = '';
});