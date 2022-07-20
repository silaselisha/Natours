const email = document.querySelector('#email')
const userName = document.querySelector('#name')
const password = document.querySelector('#password')
const logoutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const passwordCurrent = document.querySelector('#password-current');
const passwordConfirm = document.querySelector('#password-confirm');
const imageUpload = document.querySelector('#upload')
const button = document.querySelector('.btn--save')
const bookTour = document.querySelector('#book--tour')

const stripe = Stripe(
  'pk_test_51L8NxoKrb5pAV7ktZnQDC2mu0RHLzBt6BTcVjQL9tduhRuWLaJav5FPqZeTGSKTmQQNtNKY8lDNCn17U6pFoAPOx00YAOsSgYP'
)



const hideAlert = () => {
    const component = document.querySelector('.alert')
    if(component) component.parentElement.removeChild(component)
}

const showAlert = (type, msg) => {
    hideAlert
    const component = `<div class='alert alert--${type}'>${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', component)
    window.setTimeout(hideAlert, 1500)
}

const loginHandler = async () => {
    try {
        const emailValue = email.value
        const passwordValue = password.value

        const response = await axios({
            method: 'POST',
            url: `/api/v1/users/login/`,
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
            url: '/api/v1/users/logout'
        })

        if(response.data.status === 'success') {
            showAlert('success', 'User successfully logged out.')
            setTimeout(() => {
                window.location.assign('/');
            }, 3000)
        }
        
    } catch (err) {
        showAlert('error', 'Logout failed, please try again later!')
    }
}

const updateSettings = async (data, type) => {
    try {
        const URL =
          type === 'password'
            ? '/api/v1/users/update-password'
            : '/api/v1/users/update-me';

        const response = await axios({
            method: 'PATCH',
            url: URL,
            data: data
        })

        if(response.data.status === 'success') {
            showAlert('success', `User ${type.toUpperCase()} Successfully updated.`)
                location.reload()
        }
        
    } catch (err) {
        showAlert('error', 'Personal data unsuccessfully saved.')
    }
}

const bookingTour = async (tourId) => {
    try {
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)

        await stripe.redirectToCheckout({ sessionId: session.data.session.id });
    } catch (err) {
        showAlert('error', 'Payment for the tour was unsuccessfully.');
    }
}

if (document.querySelector('.form--login'))
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    loginHandler();
})

if(logoutBtn)
    logoutBtn.addEventListener('click', (e) => {
        logout()
    })

if(userDataForm)
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData()

        formData.append('name', userName.value)
        formData.append('email', email.value)
        formData.append('photo', imageUpload.files[0])
        updateSettings(formData, 'text')
    })

if(userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const currentPassword = passwordCurrent.value
        const passwordValue = password.value
        const confirmPassword = passwordConfirm.value

        const data = {
            currentPassword,
            password: passwordValue,
            confirmPassword
        }

        button.textContent = 'Upadting...'
        await updateSettings(data, 'password')
        passwordCurrent.value = ''
        password.value = ''
        passwordConfirm.value = ''
        button.textContent = 'Save password';
    })

if(bookTour) 
    bookTour.addEventListener('click', (e) => {
        const { tourId } = e.target.dataset
        bookingTour(tourId)
    })