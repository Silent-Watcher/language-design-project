document.getElementById('switch').addEventListener('click', (e) => {
  e.target.innerHTML === 'Sign Up' ? 'Log In' : 'Sign Up';
  document.getElementById('login').classList.toggle('on');
  document.getElementById('signup').classList.toggle('on');
  e.target.classList.toggle('two');
  document.getElementById('background').classList.toggle('on');
  document.getElementById('image-overlay').classList.toggle('on');
});

// register a new user
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const registerReq = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: document.querySelector('#registerUserName').value,
      email: document.querySelector('#registerUserEmail').value,
      password: document.querySelector('#registerUserPass').value,
    }),
  });

  if (registerReq.status === 201) {
    const newUser = await registerReq.json();
    alert(`${newUser.message} \n please login to your account`);
  }
});

// user login

const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const loginReq = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: document.querySelector('#loginUserEmail').value,
      password: document.querySelector('#loginUserPass').value,
    }),
  });
  if (loginReq.status === 200) {
    const loginReqResult = await loginReq.json();
    alert(`${loginReqResult.message}`);
    location.href = 'http://localhost:3000/';
  }
});
