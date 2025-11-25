# ✨ UKM IT Fun Photobooth

![Banner Image](/docs/banner-photobooth.png)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-white?style=for-the-badge&logo=flask)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**UKM IT Photobooth** adalah aplikasi web interaktif yang memungkinkan pengguna untuk mengambil foto strip bergaya *photobox* secara langsung dari browser. Dibuat menggunakan **Flask**, **Pillow (PIL)**, dan **Vanilla JS**.

Proyek ini dirancang untuk **UKM IT Cipta Karya Informatika** dengan antarmuka bertema *Cyberpunk / Pop Art*.

---

## 📸 Fitur Utama

* **Real-time Camera Access**: Menggunakan API browser (`navigator.mediaDevices`) untuk akses webcam yang lancar.
* **4-Shot Sequence**: Mengambil 4 foto berturut-turut dengan hitung mundur otomatis.
* **Dynamic Frames**: Pilihan frame overlay yang dapat diganti secara instan (Tema: Comic, Alien, Space, Hacker).
* **Live Filters**: Filter CSS real-time (Grayscale, Sepia, Brightness) sebelum pengambilan gambar.
* **Server-Side Processing**: Penggabungan gambar (Grid 2x2) dilakukan di server menggunakan Python Pillow.
* **Privacy Focused**: Tidak ada penyimpanan file di server. Gambar diproses dalam memori dan dikembalikan sebagai string **Base64** untuk diunduh langsung.

## 🛠️ Tech Stack

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Backend** | ![Flask](https://img.shields.io/badge/-Flask-000?logo=flask) | Framework web ringan untuk routing dan logika. |
| **Processing** | ![Pillow](https://img.shields.io/badge/-Pillow-blue) | Manipulasi gambar (Resize, Paste, Grid) di Python. |
| **Frontend** | HTML5, CSS3, JS | UI responsif dengan tema Neon/Dark Mode. |
| **Deployment** | Vercel | Serverless deployment configuration. |

---

## 📂 Struktur Proyek

```bash
Project_Photobooth/
├── app.py                # Main application file (Flask)
├── requirements.txt      # Python dependencies
├── vercel.json           # Konfigurasi deployment Vercel
├── static/
│   ├── css/
│   │   └── style.css     # Styling (Tema Neon/Pop Art)
│   ├── frames/           # Aset gambar frame (.png)
│   └── js/
│       └── script.js     # Logika kamera, timer, dan fetch API
└── templates/
    └── index.html        # Halaman utama


🤝 Kontribusi & Credits
Dibuat dengan ❤️ untuk UKM IT Cipta Karya Informatika.

Developer & Designer: [Ricky & Kholiq & Nafis]