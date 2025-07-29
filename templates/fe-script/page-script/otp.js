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

window.onload = () => {
    // Try to get email from query string
    const urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get('email');
    if (!email) {
        // fallback to cookie if not found in query string
        const token = getCookie("Authorization");
        if (token) {
            const userInfo = JSON.parse(atob(token.split('.')[1]));
            email = userInfo.email;
        }
    }
    if (!email) {
        alert('Email not found for verification!');
        return;
    }
    fetch('/auth/send-verification-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("OTP sent successfully");
        } else {
            console.log("OTP Send Failed:", data.message);
        }
    })
    .catch(error => {
        console.error(error);
    });
};

document.addEventListener('DOMContentLoaded', () => {
  const verifyButton = document.getElementById('verify-btn');
  if (verifyButton) { 
    verifyButton.addEventListener('click', function (e) {
      e.preventDefault();

      // Try to get email from query string
      const urlParams = new URLSearchParams(window.location.search);
      let email = urlParams.get('email');
      if (!email) {
          // fallback to cookie if not found in query string
          const token = getCookie("Authorization");
          if (token) {
              const userInfo = JSON.parse(atob(token.split('.')[1]));
              email = userInfo.email;
          }
      }
      if (!email) {
          alert('Email not found for verification!');
          return;
      }
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
          setTimeout(() => {
            console.log('Redirecting to homepage...');
            window.location.href = "/";
          }, 100);
        } else {
          alert('OTP Verified failed: ' + data.message);
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
