// Fungsi untuk mengambil nilai parameter dari URL
function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Ambil nama tamu dari URL
const namaTamu = getQueryParameter('tamu');

// Tampilkan nama tamu pada bagian cover, jika ada
if (namaTamu) {
  document.getElementById('nama-tamu').textContent = `${namaTamu}`;
}

// Fungsi untuk mendekode token JWT
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Mengganti karakter untuk decoding

  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload); // Mengembalikan objek hasil dekode
}

// Fungsi untuk menghandle login
function login() {
  const url = 'https://be-flexation-production.up.railway.app/api/v0/auth/login';
  
  const data = {
      email: 'aida@flexation.site',
      password: '123@aidaAwokawok'
  };

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
      if (result.data && result.data.accessToken) {
          localStorage.setItem('authToken', result.data.accessToken);
          console.log('Login successful! Token saved.');

          // Dekode token untuk mendapatkan user_id dan simpan di localStorage
          const decodedToken = parseJwt(result.data.accessToken);
          localStorage.setItem('user_id', decodedToken.user_id); // Ganti 'user_id' sesuai dengan struktur token
      } else {
          console.error('Login gagal:', result.message);
      }
  })
  .catch(error => {
      console.error('Error during login:', error);
  });
}

// Fungsi untuk mengirim komentar
async function submitComment(author, content, hadir) {
  const payload = {
      author: author,
      content: content,
      hadir: hadir
  };

  try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("https://be-flexation-production.up.railway.app/api/v0/comment/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
      }

      const result = await response.json();
      console.log(result); 
  } catch (error) {
      console.error("Error:", error);
  }
}

// Event listener untuk submit form komentar
document.getElementById("commentForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  // Mengambil nilai dari form
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;
  
  // Mengambil nilai kehadiran dan mengubahnya menjadi boolean
  const hadirValue = document.getElementById("hadir").value;
  const hadir = (hadirValue === "true"); // Mengonversi string ke boolean

  // Panggil fungsi untuk mengirim komentar
  await submitComment(author, content, hadir);

  // Mengosongkan form setelah pengiriman
  this.reset();
});

// Fungsi untuk mengambil dan menampilkan komentar
async function getComments() {
  const token = localStorage.getItem('authToken'); // Ambil token dari local storage
  // const userId = localStorage.getItem('user_id'); // Ambil user_id dari local storage

  // if (!token || !userId) {
  //     console.error("Token or User ID not found.");
  //     return;
  // }

  const url = `https://be-flexation-production.up.railway.app/api/v0/comment/37dad539-8ebd-47ba-911e-cb6518eb9818`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`, // Menambahkan header Authorization
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const commentsResponse = await response.json();
      const comments = commentsResponse.data;
      const komentarDiv = document.getElementById('komentar');
      // komentarDiv.innerHTML = ''; // Kosongkan komentar sebelumnya

      comments.forEach(comment => {
          const createdAt = new Date(comment.createdAt);

          // Memformat tanggal dengan format 'dd/mm/yyyy'
          const formattedDate = createdAt.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
          });

          // Memformat waktu dengan format 'hh:mm'
          const formattedTime = createdAt.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
          });

          const commentDiv = document.createElement('div');
          commentDiv.className = 'flex flex-col py-4 h-[130px]';
          commentDiv.innerHTML = `
              <div class="flex items-start gap-2.5 my-2 mr-5">
                  <div class="w-8 h-8 rounded-full bg-primary text-center">
                      <h1 class="font-bold text-white p-1 text-xl font-cinzeldecorative">${comment.author.charAt(0)}</h1>
                  </div>
                  <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-300 rounded-e-xl rounded-es-xl">
                      <div class="flex items-center space-x-2 rtl:space-x-reverse">
                          <span class="text-sm font-semibold text-colortext">${comment.author}</span>
                          <span class="text-xs font-semibold text-green-600">${comment.hadir ? 'Hadir' : 'Tidak Hadir'}</span>
                      </div>
                      <p class="text-sm font-normal py-2.5 text-gray-900">${comment.content}</p>
                      <span class="text-xs font-normal text-gray-500">${formattedDate} ${formattedTime}</span>
                  </div>  
              </div>
          `;
          komentarDiv.appendChild(commentDiv);
      });
  } catch (error) {
      console.error('Error:', error);
  }
}

// Panggil getComments() saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  login(); // Panggil login untuk autentikasi
  getComments(); // Ambil komentar setelah login
});
