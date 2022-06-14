const clientId = document.querySelector('#clientId')
const userForm = document.querySelector('#userForm')
const foodsForm = document.querySelector('#foodBtn')
const foodsCount = document.querySelector('#foodsCount')
const userHeader = document.querySelector('#userHeader')
const ordersList = document.querySelector('.orders-list')
const foodsSelect = document.querySelector('#foodsSelect')
const usernameInput = document.querySelector('#usernameInput')
const customersList = document.querySelector('.customers-list')
const telephoneInput = document.querySelector('#telephoneInput')


const API = 'https://look-js.herokuapp.com'


async function getData(name){
	let res = await fetch(`${API}/${name}`)
	res = await res.json()
	return res
}


let foods = []
let users = []
let orders = []



function renderOrders (orders) {
	ordersList.innerHTML = null
	for(let order of orders) {
		const [ li, img, div, count, name ] = createElements('li', 'img', 'div', 'span', 'span')
		const food = foods.find(el => el.foodId == order.foodId)
		
		count.textContent = order.count
		name.textContent = food.foodName

		li.classList.add('order-item')
		name.classList.add('order-name')
		count.classList.add('order-count')

		img.src = food.foodImg
		
		div.append(name, count)
		li.append(img, div)
		ordersList.append(li)
	}
}

function renderUsers (users) {
	customersList.innerHTML = null

	for(let user of users) {
		const [ li, span, a ] = createElements('li', 'span', 'a')

		span.textContent = user.username
		a.textContent = '+' + user.contact

		span.classList.add('customer-name')
		li.classList.add('customer-item')
		a.classList.add('customer-phone')

		a.setAttribute('href', 'tel:+' + user.contact)

		li.append(span, a)
		customersList.append(li)

		li.onclick = () => {
			const filteredOrders = orders.filter(el => el.userId == user.userId)
			renderOrders(filteredOrders)

			clientId.textContent = user.userId
			userHeader.textContent = user.username
		}
	}
}

function renderFoods (foods) {
	for(let food of foods) {
		const [ option ] = createElements('option')
		option.textContent = food.foodName
		option.value = food.foodId

		foodsSelect.append(option)
	}
}

function getFirstOrders () {
	let userId = clientId.textContent

	const filteredOrders = orders.filter(el => el.userId == userId)

	return filteredOrders
}

userForm.onsubmit = async (event) => {
	event.preventDefault()

	const username = usernameInput.value.trim()
	const contact = telephoneInput.value.trim()
	
	if(!(username.length < 30 && username.length)) {
		return alert('Wrong username')
	}
	
	if(!(/^998[389][012345789][0-9]{7}$/).test(contact)) {
		return alert('Invalid contact!')
	}

	

	await fetch(`${API}/users`, {
			method:'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username,
				contact
			})
	})
	
	
	
	
	usernameInput.value = null
	telephoneInput.value = null
	
	users = await getData('users')
	renderUsers(users)
}

foodsForm.onclick = async () => {

	if(!foodsSelect.value) return
	if(!clientId.textContent) return
	if(!foodsCount.value || foodsCount.value > 10) return

	
	let res = await fetch(`${API}/orders`, {
		method: "POST",
		body: JSON.stringify({
			userId: clientId.textContent,
			foodId: foodsSelect.value,
			count: foodsCount.value
		}),
		headers: {
			"Content-Type": "application/json"
		}
	})


	foodsSelect.value = 1
	foodsCount.value = null

	orders = await getData('orders')

	renderOrders(getFirstOrders())
}



async function render(){
	foods = await getData('foods')
	users = await getData('users')
	orders = await getData('orders')

	renderFoods(foods)
	renderUsers(users)
	renderOrders(getFirstOrders())
}

render()
