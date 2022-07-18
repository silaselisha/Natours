const email = document.querySelector('#email')
const password = document.querySelector('#password')
const logoutBtn = document.querySelector('.nav__el--logout')

const hideAlert = () => {
    const component = document.querySelector('.alert')
    if(component) component.parentElement.removeChild(component)
}

const showAlert = (type, msg) => {
    hideAlert
    const component = `<div class='alert alert--${type}'>${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', component)
    window.setTimeout(hideAlert, 5000)
}

const loginHandler = async () => {
    try {
        const emailValue = email.value
        const passwordValue = password.value

        const response = await axios({
            method: 'POST',
            url: `http://localhost:3000/api/v1/users/login/`,
            data: {
                email: emailValue,
                password: passwordValue
            }
        })

        const { data } = response
        if(data.status === 'success') {
            showAlert('success', 'User successfully logged in.')
            setTimeout(() => {
                window.location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}

const logout = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout'
        })

        if(response.data.status === 'success') {
            showAlert('success', 'User successfully logged out.')
            window.location.reload()
        }
        
    } catch (err) {
        showAlert('Error', 'Logout failed, please try again later!')
    }
}

if (document.querySelector('.form'))
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    loginHandler();
})

if(logoutBtn)
    logoutBtn.addEventListener('click', (e) => {
        logout()
    })