const navToggle = document.getElementById("nav-toggle");
const logoImg = document.getElementById("logo-img");
const token = getCookie("Authorization");
const userInfo = JSON.parse(atob(token.split('.')[1]));
if (token){
    document.getElementById("user-info-username").innerHTML = userInfo.username;
    document.getElementById("user-info-email").innerHTML = userInfo.email;
}

navToggle.addEventListener("change", function () {
  if (this.checked) {
    logoImg.src = "../asset/homepage-assets/shortlogo.png";
  } else {
    logoImg.src = "../asset/homepage-assets/image.png";
  }
});

const navItems = document.querySelectorAll('.sidebar-item');
const mainContent = document.getElementById('change-content');

// Gán link tĩnh tương ứng cho từng mục
const pageMap = {
  'News Management': '../adminpgs/newsm.html',
  'User Management': '../adminpgs/user.html',
  'Chat Management': '../adminpgs/chat.html',
  'Analytics': '../adminpgs/analytics.html',
  'Settings': '../adminpgs/settings.html'
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    // Thay class active
    document.querySelector('.sidebar-item.active')?.classList.remove('active');
    item.classList.add('active');

    // Lấy text trong sidebar
    const text = item.querySelector('span').innerText.trim();
    const page = pageMap[text];
    let count = 1;
    if (page) {
      fetch(page)
        .then(res => res.text())
        .then(html => {
          mainContent.innerHTML = html;
          
          if (text === 'News Management') {
            const existingScript = document.getElementById('tab-script');
            if (existingScript) {
              existingScript.remove();
            }

            const script = document.createElement('script');
            script.id = 'tab-script';
            script.src = '../fe-script/newsm.js';
            script.defer = true; // Ensure the script runs after parsing
            document.body.appendChild(script);

            console.log('newsm.js script loaded and executed.');
          }else if (text === 'User Management'){
            const existingScript = document.getElementById('tab-script');
            if (existingScript) {
              existingScript.remove();
            }

            const script = document.createElement('script');
            script.id = 'tab-script';
            script.src = '../fe-script/usersm.js';
            script.defer = true; // Ensure the script runs after parsing
            document.body.appendChild(script);

            console.log('newsm.js script loaded and executed.');
          }
        });
    }
  });
});

//Hàm vẽ biểu đồ cho trang News
function renderNewsChart() {
  setTimeout(() => {
    const canvas = document.getElementById('newChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'July'],
        datasets: [
          {
            label: 'LOL news',
            data: [12, 15, 20, 18, 24, 28],
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Valorant news',
            data: [10, 12, 18, 20, 25, 26],
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Other news',
            data: [5, 7, 10, 9, 12, 15],
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of news posted'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }, 0);
}

window.addEventListener('DOMContentLoaded', () => {
    const defaultPage = 'News Management';
    const page = pageMap[defaultPage];

    if (page) {
        fetch(page)
            .then(res => res.text())
            .then(html => {
                mainContent.innerHTML = html;

                navItems.forEach(item => {
                    const text = item.querySelector('span').innerText.trim();
                    if (text === defaultPage) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });

                renderNewsChart();
            });
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}