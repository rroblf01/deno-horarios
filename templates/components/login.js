class LoginNav extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = /*html*/`
<div class="flex justify-center items-center mt-2">
    <div id="logout_place">
        <button id="logout"
            class="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true">
            Logout
        </button>
    </div>

    <div id="login_place">
        <div class="p-5">
            <div class="mt-2">
                <div class="flex flex-col md:flex-row border-b border-gray-200 pb-4 mb-4">
                    <div class="flex-1 flex flex-col md:flex-row">
                        <div class="w-full flex-1 mx-2">
                            <div class="my-2 p-1 bg-white flex border border-gray-200 rounded">
                                <input id="username" type="text" placeholder="username"
                                    class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">
                            </div>
                        </div>
                        <div class="w-full flex-1 mx-2">
                            <div class="my-2 p-1 bg-white flex border border-gray-200 rounded">
                                <input id="password" type="password" placeholder="password"
                                    class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">
                            </div>
                        </div>

                    </div>
                    <button id="login"
                        class="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true">Login</button>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    connectedCallback() {
        this.setVisibility()

        const login = document.getElementById('login');
        const logout = document.getElementById('logout');

        logout.addEventListener('click', () => {
            this.removeToken();
            this.setVisibility();
            window.location.reload();
        });

        login.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            this.login(username, password);
        })
    }

    login(username, password) {
        const body = JSON.stringify({ username, password });
        fetch('/login', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body
        }).then(response => {
            return response.json()
        }).then(res => {
            if (res.errors) {
                alert(res.errors)
                return;
            } else {
                this.setToken(res.token);
                this.setVisibility();
                window.location.reload();
            }

        })
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    setVisibility() {
        const login_place = document.getElementById('login_place');
        const logout_place = document.getElementById('logout_place');

        const token = this.getToken();
        if (token) {
            login_place.style.display = 'none';
            logout_place.style.display = 'block';

        } else {
            login_place.style.display = 'block';
            logout_place.style.display = 'none';
        }
    }
}

if ('customElements' in window) {
    customElements.define('login-nav', LoginNav);
}