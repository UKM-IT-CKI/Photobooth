from flask import Flask, render_template, request, jsonify
import os
import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)

# Konfigurasi Path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRAME_FOLDER = os.path.join(BASE_DIR, "static", "frames")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save_photos", methods=["POST"])
def save_photos():
    try:
        data = request.get_json()
        photos = data.get("photos", [])
        theme = data.get("theme", "1")

        if len(photos) != 4:
            return jsonify({"error": "Jumlah foto harus 4"}), 400

        # === 1. Proses 4 Foto ===
        img_list = []
        for p in photos:
            # Hapus header data:image/png;base64,
            if "," in p:
                header, encoded = p.split(",", 1)
            else:
                encoded = p
                
            img_data = base64.b64decode(encoded)
            img = Image.open(BytesIO(img_data)).convert("RGBA")
            
            # Resize ke ukuran standar slot grid (640x480)
            img = img.resize((640, 480), Image.Resampling.LANCZOS)
            img_list.append(img)

        # === 2. Buat Canvas Grid (1280x960) ===
        final_width = 1280
        final_height = 960
        final_img = Image.new("RGBA", (final_width, final_height), (255, 255, 255, 255))

        # Posisi grid 2x2
        positions = [
            (0, 0),         # Kiri Atas
            (640, 0),       # Kanan Atas
            (0, 480),       # Kiri Bawah
            (640, 480)      # Kanan Bawah
        ]

        # Tempel foto ke canvas
        for img, pos in zip(img_list, positions):
            final_img.paste(img, pos)

        # === 3. Overlay Frame Grid ===
        frame_filename = f"frame_grid_{theme}.png"
        frame_path = os.path.join(FRAME_FOLDER, frame_filename)
        
        if os.path.exists(frame_path):
            frame = Image.open(frame_path).convert("RGBA")
            frame = frame.resize((final_width, final_height), Image.Resampling.LANCZOS)
            final_img = Image.alpha_composite(final_img, frame)
        else:
            print(f"Warning: Frame {frame_filename} tidak ditemukan.")

        # === 4. Konversi Hasil ke Base64 (Bukan Save File) ===
        # Di Vercel, kita tidak bisa save file ke disk (read-only system)
        # Jadi kita kirim balik gambarnya sebagai string base64
        buffered = BytesIO()
        final_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Buat Data URI lengkap
        full_data_uri = f"data:image/png;base64,{img_str}"

        return jsonify({
            "success": True,
            "image_data": full_data_uri
        })

    except Exception as e:
        print(f"Error processing photos: {e}")
        return jsonify({"error": str(e)}), 500

# Route uploads dihapus karena tidak digunakan di serverless (tidak ada penyimpanan file)

if __name__ == "__main__":
    app.run(debug=True, port=5000)