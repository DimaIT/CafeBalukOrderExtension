(function() {
	if (window._initialized)
		return

	let order = new Map()

	updateDom()

	function updateDom() {
        const btnTemplate = `
		<div class="shop-item__order-btn">
        	<span class="btn btn-block _btn-add" > В корзину</span>
        	<span class="btn btn-block _btn-remove" >
        		<i class="fa fa-trash"></i>
			</span>
        </div>`

        const basketTemplate = `
		<h3>Моя корзина</h3>
		<div class="shop-cart__text">
			<span><i class="fa fa-cart-arrow-down"></i> 0,00р.</span>
		</div>
		<div class="shop-cart__order">
			<span><i class="fa fa-copy"></i> Скопировать заказ</span>
		</div>
		<br>
		`

        setTimeout(updateBasket, 200) // page for loading
        setInterval(updateItems, 100) // to handle new dom changes

        function updateBasket() {
            let container = document.querySelector('.shop-view-sidebar > div > cart-summary > .shop-cart')
            container.innerHTML = basketTemplate
        }

        function updateItems() {
            Array.from(document.querySelectorAll('.shop-item'))
                .filter(item => !item._updated)
                .forEach(updateItem)
        }

        function updateItem(item) {
            let container = item.querySelector('.shop-item__order-btn')
            container.innerHTML = btnTemplate;
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
	}

	function getResult() {
        let result = 0
        let msg = ''
        order.forEach((v, k) => {
            result += v
            msg += `${k} - ${v}p\n`
        })
        console.log(msg, result)
		return [msg, result]
	}

	window._initialized = true
})()
