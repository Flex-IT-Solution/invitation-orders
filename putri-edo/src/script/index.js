tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#FAF9F7",
        tersier: "#E7E7E7",
        textprimary: "",
        textsecondary: "",
      },
      fontFamily: {
        poppins: ["Poppins", "system-ui"],
        urbanist: ["Urbanist", "system-ui"],
        pinyon: ["Pinyon Script", "system-ui"],
        lora: ["Lora", "system-ui"],
        cormorant: ["Cormorant Infant", "system-ui"],
      },
    },
  },
};

fetch("./src/data.json") 
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Menampilkan Data Mempelai
    document.querySelectorAll(".nama-panggilan-pria").forEach((element) => {
      element.textContent = data.mempelai.pria.namaPanggilan;
    });
    document.querySelectorAll(".nama-panggilan-wanita").forEach((element) => {
      element.textContent = data.mempelai.wanita.namaPanggilan;
    });

    document.getElementById('foto-pria').src = data.mempelai.pria.foto;
    document.getElementById("nama-lengkap-pria").textContent =
      data.mempelai.pria.namaLengkap;
    document.getElementById("nama-bapak-pria").textContent =
      data.mempelai.pria.namaBapak;
    document.getElementById("nama-ibu-pria").textContent =
      data.mempelai.pria.namaIbu;
    document.getElementById("alamat-pria").textContent =
      data.mempelai.pria.alamat;

      document.getElementById('foto-wanita').src = data.mempelai.wanita.foto;
    document.getElementById("nama-lengkap-wanita").textContent =
      data.mempelai.wanita.namaLengkap;
    document.getElementById("nama-bapak-wanita").textContent =
      data.mempelai.wanita.namaBapak;
    document.getElementById("nama-ibu-wanita").textContent =
      data.mempelai.wanita.namaIbu;
    document.getElementById("alamat-wanita").textContent =
      data.mempelai.wanita.alamat;
    
    const igLinkWanita = document.getElementById("ig-link-wanita");
    const igUsernameWanita = document.getElementById("ig-username-wanita");

    igLinkWanita.href = data.mempelai.wanita.sosmed.link_ig;
    igUsernameWanita.textContent = data.mempelai.wanita.sosmed.ig;
    
    const igLinkPria = document.getElementById("ig-link-pria");
    const igUsernamePria = document.getElementById("ig-username-pria");

    igLinkPria.href = data.mempelai.pria.sosmed.link_ig;
    igUsernamePria.textContent = data.mempelai.pria.sosmed.ig;

    // Menampilkan Data Acara
    data.acara.forEach((acara, index) => {
      document.getElementById(`nama-acara-${index + 1}`).textContent =
        acara.nama;
      document.getElementById(`hari-acara-${index + 1}`).textContent =
        acara.hari;
      document.getElementById(`tanggal-acara-${index + 1}`).textContent =
        acara.tanggal;
      document.getElementById(`waktu-acara-${index + 1}`).textContent =
        acara.waktu;
      document.getElementById(`lokasi-nama-${index + 1}`).textContent =
        acara.lokasi.nama;
      document.getElementById(`lokasi-alamat-${index + 1}`).textContent =
        acara.lokasi.alamat;
    });

    // Menampilkan Data Angpao Digital
    data.angpaoDigital.forEach((angpao, index) => {
      document.getElementById(`nomor-rekening-${index + 1}`).textContent =
        angpao.nomorRekening;
      document.getElementById(`nama-pemilik-${index + 1}`).textContent =
        angpao.namaPemilik;
    });

    const fotoData = data.foto;

    // Fungsi untuk mengisi gambar
    function isiGambarDariJSON(fotoData) {
      // Looping melalui semua properti di dalam fotoData
      Object.keys(fotoData).forEach(fotoKey => {
        // Cari elemen berdasarkan class sesuai key JSON
        const elements = document.querySelectorAll(`.${fotoKey}`);
        elements.forEach(element => {
          element.setAttribute('loading', 'lazy');
          // Set atribut 'src' dengan path gambar yang sesuai
          element.src = fotoData[fotoKey];
        });
      });
    }

    // Panggil fungsi untuk mengisi gambar
    isiGambarDariJSON(fotoData);
  })
  .catch((error) => console.error("Error:", error));
