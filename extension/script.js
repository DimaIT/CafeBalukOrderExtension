(function() {
	if (window._initialized)
		return

	let order = new Map()

	function updateDom() {
		Array.from(document.querySelectorAll('.shop-item'))
			.filter(item => !item._updated)
			.forEach(updateItem)
	}

	function updateItem(item) {
		let btn = item.querySelector('.shop-item__order-btn')
		btn.innerHTML = `<div class="shop-item__order-btn">
                            <span class="btn btn-block" ></i> В корзину</span>
                         </div>`

		btn.onclick = () => {
			let description = item.querySelector('.shop-item__text').innerText
			let price = item.querySelector('.shop-item__weight-price > dl > dd:nth-child(4)').innerText
			price = parseFloat(price.trim().replace(',', '.').replace('р.', ''))
			order.set(description, price)

			let result = 0
			let msg = ''
			order.forEach((v, k) => {
				result += v
				msg += `${k} - ${v}p\n`
			})
			console.log(msg, result)
		}

		item._updated = true

	}

	setInterval(updateDom, 100) // to handle dom changes

	window._initialized = true
})()
