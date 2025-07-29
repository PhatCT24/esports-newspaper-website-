document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('newsBarChart').getContext('2d');
  
    // Tạo biểu đồ ban đầu với dữ liệu rỗng
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['News Uploaded', 'News Edited', 'News Deleted'],
        datasets: [{
          label: 'News Management Stats',
          data: [], // Dữ liệu sẽ được cập nhật sau
          backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
          borderColor: ['#1e81ce', '#e74c3c', '#3ba99c'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Categories',
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count',
            }
          }
        }
      }
    });
  
    // Fetch dữ liệu từ API
    fetch('/api/analytics/news-stats')
        .then(response => response.json())
        .then(data => {
          console.log(data); // Kiểm tra dữ liệu từ API
          
          // Cập nhật dữ liệu vào biểu đồ
          myChart.data.datasets[0].data = [
            data.newsUploaded,
            data.newsEdited,
            data.newsDeleted
          ];

          // Cập nhật biểu đồ
          myChart.update();
        })
        .catch(error => console.error('Error fetching news stats:', error));
});