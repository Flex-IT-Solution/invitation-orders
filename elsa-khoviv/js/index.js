document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form');
    const komentarDiv = document.getElementById('komentar');

    // auth dulu bang
    const email = document.body.getAttribute('data-email');
    const password = document.body.getAttribute('data-password');

    // tamu
    const urlParams = new URLSearchParams(window.location.search);
    const tamu = urlParams.get('tamu');

    const namaTamu = document.getElementById('nama-tamu');
    namaTamu.innerText = tamu;
    const formTamu = document.getElementById('commenter_name');
    formTamu.value = tamu;

    const loginData = new FormData();
    // Siapkan data untuk dikirim
    loginData.append('email', email);
    loginData.append('password', password);

    fetch('https://api.flexation.flexdev.site/api/v1/login', {
        method: 'POST',
        body: loginData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Proses data balasan dari server di sini
            // console.log('Login Berhasil Coii');
            const iduser = data.user_id;
            // console.log('User ID:', iduser);

            getComments(iduser);
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // Menghentikan pengiriman formulir default
    
                // Validasi input sebelum mengirimkan data
                const commenterName = form.elements['commenter_name'].value.trim();
                const content = form.elements['content'].value.trim();
                const kehadiran = form.elements['kehadiran'].value;
    
                if (!commenterName || !content || !kehadiran) {
                    alert('Harap lengkapi semua kolom');
                    return;
                }
    
                if (!['Hadir', 'Tidak Hadir', 'Belum Tau'].includes(kehadiran)) {
                    alert('Pilihan kehadiran tidak valid');
                    return;
                }
    
                tambahKomentar(iduser, commenterName, content, kehadiran);
            });
        })
        .catch(error => {
            // Tangani kesalahan di sini
            console.error('There was a problem with your fetch operation:', error);
        });


        async function tambahKomentar(iduser, commenterName, content, kehadiran) {
            const commentFormData = new FormData();
            commentFormData.append('commenter_name', commenterName);
            commentFormData.append('content', content);
            commentFormData.append('kehadiran', kehadiran);
            commentFormData.append('user_id', iduser);
    
            try {
                const response = await fetch('https://api.flexation.flexdev.site/api/v1/comments', {
                    method: 'POST',
                    body: commentFormData
                });
    
                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }
    
                // Clear form fields
                form.reset();
    
                // Refresh comments
                getComments(iduser);
            } catch (error) {
                console.error('Error:', error);
            }
        }

    // Function untuk mengambil dan menampilkan komentar
    function getComments(user_id) {
        const url = `https://api.flexation.flexdev.site/api/v1/comments/user/${user_id}`;

        fetch(url)
            .then(response => response.json())
            .then(comments => {
                komentarDiv.innerHTML = ''; // Kosongkan komentar sebelumnya
                comments.forEach(comment => {

                    const createdAt = new Date(comment.created_at);

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
                            <div class="w-8 h-8 rounded-full bg-white text-center">
                                <h1 class="font-bold text-primary p-1 text-xl font-cinzeldecorative">${comment.commenter_name.charAt(0)}</h1>
                            </div>
                            <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span class="text-sm font-semibold text-colortext">${comment.commenter_name}</span>
                                    <span class="text-sm font-semibold text-green-600">${comment.kehadiran}</span>
                                </div>
                                <p class="text-sm font-normal py-2.5 text-gray-900">${comment.content}</p>
                                <span class="text-xs font-normal text-gray-500">${formattedDate} ${formattedTime}</span>
                            </div>  
                        </div>
                    `;
                    komentarDiv.appendChild(commentDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Panggil getComments() saat halaman dimuat
    getComments();

});


// bug di post
