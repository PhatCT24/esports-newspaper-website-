document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, ''); 
      if (input.value.length && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '' && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const verifyButton = document.getElementById('verify-btn');
  document.getElementById('error-message').textContent = data.message;
  if (verifyButton) { 
    verifyButton.addEventListener('click', function (e) {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      let email = urlParams.get('email');
      const otp = Array.from(document.querySelectorAll('.otp-input')).map(input => input.value).join('');
      fetch('/auth/verify-code', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otp })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          alert('Verified successfully!');
          const previous_page = document.referrer;
          setTimeout(() => {
            if (previous_page === "/html/forgot-password.html") {
                  window.location.href = "/html/login.html";
            } else {
                  window.location.href = "/html/confirm-password.html";
            }
          }, 100);
        } else {}
          
        }
      })
      .catch(error => {
        console.error('OTP Verified Failed: ', error);
        alert('A JS error occurred. See console for details.');
      });
    });
  } else {
    console.error('Verify button not found');
  }
});


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
