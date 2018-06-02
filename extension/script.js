(function() {
	if (window._initialized)
		return

    const template = `
		<div class="shop-item__order-btn">
        	<span class="btn btn-block _btn-add" > В корзину</span>
        	<span class="btn btn-block _btn-remove" >
        		<i class="fa fa-trash"></i>
			</span>
        </div>
	`

	let order = new Map()

	function updateItems() {
		Array.from(document.querySelectorAll('.shop-item'))
			.filter(item => !item._updated)
			.forEach(updateItem)
	}

	function updateItem(item) {
		let container = item.querySelector('.shop-item__order-btn')
		container.innerHTML = template;
		let counter = item.querySelector('.shop-item__order')
		counter.parentNode.removeChild(counter)

		let btnAdd = container.querySelector('._btn-add')
        btnAdd.onclick = () => {
			let description = item.querySelector('.shop-item__text').innerText
			let price = item.querySelector('.shop-item__weight-price > dl > dd:nth-child(4)').innerText
			price = parseFloat(price.trim().replace(',', '.').replace('р.', ''))
			order.set(description, price)

			getResult()
		}

        let btnRemove = container.querySelector('._btn-remove')
		btnRemove.onclick = () => {
            let description = item.querySelector('.shop-item__text').innerText
			order.delete(description)

            getResult()
		}

		item._updated = true
	}

	function getResult() {
        let result = 0
        let msg = ''
        order.forEach((v, k) => {
            result += v
            msg += `${k} - ${v}p\n`
        })
        console.log(msg, result)
	}

	setInterval(updateItems, 100) // to handle dom changes

	window._initialized = true
})()
