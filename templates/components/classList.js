import { customGet, customPost, customPut } from '../utils/http-fetch.js';

class ClassList extends HTMLElement {
    constructor() {
        super();
        this.month = this.getMonth();
        this.innerHTML = /*html*/`
<form id="classForm">
    <div class="p-5">
        <div class="mt-2">
            <div class="flex flex-col md:flex-row border-b border-gray-200 pb-4 mb-4">
                <div class="flex-1 flex flex-col md:flex-row">
                    <div class="w-full flex-1 mx-2">
                        <div class="my-2 p-1 bg-white flex border border-gray-200 rounded">
                            <label for="date"
                                class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">Fecha</label>
                            <input type="date" placeholder="date" name="date"
                                class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">
                        </div>
                    </div>
                    <div class="w-full flex-1 mx-2">
                        <div class="my-2 p-1 bg-white flex border border-gray-200 rounded">
                            <label for="place"
                                class="p-1 px-2 appearance-none outline-none text-gray-800 ">Lugar</label>
                            <input type="text" placeholder="place" name="place"
                                class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">
                        </div>
                    </div>
                    <div class="w-full flex-1 mx-2">
                        <div class="my-2 p-1 bg-white flex border border-gray-200 rounded">
                            <label for="hours"
                                class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">Horas</label>
                            <input type="number" placeholder="hours" name="hours"
                                class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">
                        </div>
                        <div class="my-2 p-1 bg-white flex border border-gray-200 rounded">
                            <label for="minuts"
                                class="p-1 appearance-none outline-none w-full text-gray-800 ">Minutos</label>
                            <input type="number" placeholder="minuts" name="minuts" min="0" max="59"
                                class="p-1 px-2 appearance-none outline-none w-full text-gray-800 ">
                        </div>
                    </div>
                    <button class="text-sm  mx-2 w-32 h-10  focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
hover:bg-teal-700 hover:text-teal-100 
bg-teal-100 
text-teal-700 
border duration-200 ease-in-out 
border-teal-600 transition">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</form>

<div class="flex justify-center items-center mt-2">
    <button id="previous_button" class="bg-gray-200 hover:bg-gray-300 py-2 px-4">
        <- </button>
            <h1 id="current_month" class="text-2xl px-2">${this.month}</h1>
            <button id="next_button" class="bg-gray-200 hover:bg-gray-300 py-2 px-4">
                ->
            </button>
</div>
<div>
    <div class="flex flex-col">
        <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-white border-b">
                            <tr>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">
                                    Fecha
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Sitio
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Horas
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Minutos
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Dinero
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table_classes">
                        </tbody>
                    </table>

                    <div class="flex justify-center items-center mt-2">
                        <h1 id="total_hours" class="text-2xl px-2"></h1>
                        <h1 id="total_money" class="text-2xl px-2"></h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    connectedCallback() {
        this.getClasses()

        const form = document.getElementById('classForm');
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const body = this.getBody()
            this.createClassElement(body)
        });

        const previous_button = document.getElementById('previous_button');
        const next_button = document.getElementById('next_button');

        previous_button.addEventListener('click', () => {
            this.setMonth(-1);
            this.getClasses();
        });

        next_button.addEventListener('click', () => {
            this.setMonth(1);
            this.getClasses();
        });
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getClasses(clearCache = false) {
        this.clearTable()
        const token = this.getToken();
        if (!token) {
            return [];
        }

        const headers = { "content-type": "application/json", "Authorization": `Bearer ${token}` };
        const url = `/api/classes/${this.month}`;
        customGet(url, headers, clearCache).then(response => {
            this.createList(response);
        });
    }

    getMonth() {
        const date = new Date();

        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    clearTable() {
        const tableClasses = document.getElementById('table_classes');
        tableClasses.innerHTML = '';

        const total_hours_el = document.getElementById('total_hours');
        total_hours_el.innerHTML = '';

        const total_money_el = document.getElementById('total_money');
        total_money_el.innerHTML = '';
    }

    createList(classes) {
        const tableClasses = document.getElementById('table_classes');
        tableClasses.innerHTML = '';
        classes.forEach((c, index) => {
            const tr = document.createElement('tr');
            tr.className = index % 2 === 0 ? 'bg-gray-100 border-b' : 'border-b';
            tr.id = `table-element-${index}`;
            const hours = Math.floor(c.duration);
            const minutes = Math.round((c.duration - hours) * 60);
            const money = c.duration * 10;
            tr.innerHTML = `
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                    ${c.date}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${c.place}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${hours}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${minutes}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${money} + 5€
                </td>
            `;
            const button = document.createElement('button');
            button.className = 'middle none center mr-4 rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';
            button.setAttribute('data-ripple-light', 'true');
            button.innerHTML = 'Delete';
            button.addEventListener('click', () => {
                this.deleteClassElement(index);
            })

            tr.appendChild(button);
            tableClasses.appendChild(tr);
        })

        this.getTotalHours();
        this.getMoney();
    }

    cleanList() {
        const list = document.getElementById('classList');
        list.innerHTML = '';
    }

    getBody() {
        const form = document.getElementById('classForm');
        const formData = new FormData(form);
        const body = {};
        for (const key of formData.keys()) {
            body[key] = formData.get(key);
        }

        body.duration = parseFloat(body.hours) + parseFloat(body.minuts) / 60;
        delete body.hours;
        delete body.minuts;

        return body;
    }

    createClassElement(body) {
        if (!body.date || !body.place || !body.duration) {
            alert('Por favor, rellene todos los campos.')
            return;
        }

        const token = this.getToken();
        if (!token) {
            alert('Por favor, inicie sesión.')
            return;
        }

        const headers = { "content-type": "application/json", "Authorization": `Bearer ${token}` };
        const url = '/api/classes';
        customPost(url, headers, JSON.stringify(body)).then(res => {
            if (res.errors) {
                alert(res.errors)
            } else {
                this.getClasses(true);
            }
        })
    }

    deleteClassElement(id) {
        const token = this.getToken();
        if (!token) {
            return;
        }

        const tableClasses = document.getElementById('table_classes');
        const classes = Array.from(tableClasses.children).filter((el, index) => index !== id).map(el => {
            return {
                date: el.children[0].innerText,
                place: el.children[1].innerText,
                duration: el.children[2].innerText
            }
        });

        const headers = { "content-type": "application/json", "Authorization": `Bearer ${token}` };
        const url = `/api/classes/${this.month}`;
        customPut(url, headers, JSON.stringify({ classes })).then(res => {
            if (res.errors) {
                alert(res.errors)
            } else {
                this.getClasses(true);
            }
        })
    }

    setMonth(n) {
        const date = new Date(`${this.month}-01`);
        date.setMonth(date.getMonth() + n);
        this.month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const current_month = document.getElementById('current_month');
        current_month.innerHTML = this.month;
    }

    getTotalHours() {
        const tableClasses = document.getElementById('table_classes');

        let total_hours = 0;
        let total_minutes = 0;
        Array.from(tableClasses.children).forEach(el => {
            total_hours += parseFloat(el.children[2].innerText);
            total_minutes += parseFloat(el.children[3].innerText);
        });

        const total_time = total_hours + total_minutes / 60;
        const hours = Math.floor(total_time);
        const minutes = Math.round((total_time - hours) * 60);

        if ((isNaN(hours) || isNaN(minutes)) || (hours === 0 && minutes === 0)) {
            return;
        }
        const total_hours_el = document.getElementById('total_hours');
        const text = `${hours}h ${minutes}m`
        total_hours_el.innerHTML = text;
    }

    getMoney() {
        const tableClasses = document.getElementById('table_classes');

        let total_hours = 0;
        let total_minutes = 0;
        let total_money = 0;

        Array.from(tableClasses.children).forEach(el => {
            total_hours += parseFloat(el.children[2].innerText);
            total_minutes += parseFloat(el.children[3].innerText);
            total_money += 5
        });

        total_money += (total_hours + total_minutes / 60) * 10;

        const total_money_el = document.getElementById('total_money');
        const text = `Total: ${total_money}€`

        total_money_el.innerHTML = text;
    }
}

if ('customElements' in window) {
    customElements.define('class-list', ClassList);
}