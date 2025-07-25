const wrapper = document.querySelector('.wrapper')
const registerLink = document.querySelector('.register-link')
const loginLink = document.querySelector('.login-link')

registerLink.onclick = () => {
    wrapper.classList.add('active')
}

loginLink.onclick = () => {
    wrapper.classList.remove('active')
}



const signInButton = document.getElementById("SIGN-IN");
if (signInButton) {
    signInButton.addEventListener("click", function() {
        const POST = 5500;
        window.location.href = `http://localhost:${POST}`;
    });
}
else{
    alert("SIGN UP FIRST")
}

