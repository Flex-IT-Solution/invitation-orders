// Fungsi untuk mengambil nilai parameter dari URL
function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Ambil nama tamu dari URL
const namaTamu = getQueryParameter("tamu");

// Tampilkan nama tamu pada bagian cover, jika ada
if (namaTamu) {
  document.getElementById("nama-tamu").textContent = `${namaTamu}`;
}

// Cover 
function closeCover() {
  const coverModal = document.getElementById('cover-modal');
  const mainContent = document.getElementById('main-content');
  
  coverModal.classList.add('slide-up');
  coverModal.addEventListener('transitionend', () => {
      coverModal.classList.add('hidden');
      mainContent.classList.remove('hidden');
      setTimeout(() => {
          mainContent.classList.add('fade-in');
      }, 10);  // Small delay to ensure 'hidden' class is applied before fade-in
  }, { once: true });
  audio.play();
}

//COUNTDOWN TIMER
function countDown() {
  // Set the date we're counting down to
  const countDownDate = new Date('October 16, 2025 08:30:00').getTime();
  
  // Update the count down every 1 second
  const x = setInterval(function() {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id 
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("days").innerText = '00';
      document.getElementById("hours").innerText = '00';
      document.getElementById("minutes").innerText = '00';
      document.getElementById("seconds").innerText = '00';
    }
  }, 1000);
}

  // Set up the "Save to Calendar" link
  function saveToCalendar() {
    const title = "Event Countdown";
    const startDate = new Date('October 16, 2025 09:00:00');
    const endDate = new Date(startDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hour event

    const startDateISO = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDateISO = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateISO}/${endDateISO}&ctz=UTC`;

    window.open(url, '_blank');
  }

  document.getElementById('save-to-calender').addEventListener('click', saveToCalendar);

countDown();

//Music
function playMusic() {
  const audio = document.getElementById('audio');
  const rotateButton = document.getElementById('rotateButton');

  function toggleAudio() {
    if (audio.paused) {
      audio.play();
      rotateButton.classList.add('spin');
    } else {
      audio.pause();
      rotateButton.classList.remove('spin');
    } 
  }

  rotateButton.addEventListener('click', toggleAudio);

  // Tambahkan event listener untuk mematikan musik
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      audio.pause();
      rotateButton.classList.remove('spin');
    }
  });
}

// Panggil fungsi playMusic ketika dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
  playMusic();
});


//fungsi untuk scroll fade
function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);

//modal galery
function openModal(imageSrc) {
  document.getElementById('modalImage').src = imageSrc;
  document.getElementById('imageModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('imageModal').classList.add('hidden');
}

//button angpao digital
function toggleGift() {
  const textElement = document.getElementById('hiddenText');
  const buttonElement = document.getElementById('toggleButton');
  if (textElement.classList.contains('hidden')) {
    textElement.classList.remove('hidden');
    buttonElement.textContent = 'Sembunyikan';
  } else {
    textElement.classList.add('hidden');
    buttonElement.textContent = 'Tampilkan';
  }
}

//Clipboard
function copyToClipboard(button) {
  const textElement = button.previousElementSibling;
  const textToCopy = textElement.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
      button.innerHTML = 'Teks Disalin!';
      setTimeout(() => {
          button.innerHTML = '<i class="fi fi-ss-copy-alt"></i> ' + button.dataset.originalText;
      }, 2000);
  }).catch(err => {
      console.error('Gagal menyalin teks: ', err);
  });
}


