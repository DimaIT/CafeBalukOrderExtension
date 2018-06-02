(function() {
	if (window._initialized)
		return

	let order = new Map()
    let updateTotal = () => {}

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
			<i class="fa fa-cart-arrow-down"></i> 
			<span id="_total_price"> 0,00р.</span>
		</div>
		<div class="shop-cart__order">
			<span id="_copy-btn"><i class="fa fa-copy"></i> Скопировать заказ</span>
		</div>
		<br>
		`

        setTimeout(replaceBasket, 300) // page for loading
        setInterval(replaceItems, 100) // to handle new dom changes

        function replaceBasket() {
            let container = document.querySelector('.shop-view-sidebar > div > cart-summary > .shop-cart')
            container.innerHTML = basketTemplate

            let btn = container.querySelector('#_copy-btn')
            let priceHolder = container.querySelector('#_total_price')

            updateTotal = f => priceHolder.innerText = formatFloat(f) + 'p.'
        }

        function replaceItems() {
            Array.from(document.querySelectorAll('.shop-item'))
                .filter(item => !item._updated)
                .forEach(replaceItem)
        }

        function replaceItem(item) {
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
            msg += `${k} - ${formatFloat(v)}p\n`
        })
        console.log(msg, formatFloat(result))
        updateTotal(result)
		return [msg, result]
	}

	function formatFloat(f) {
	    return f.toFixed(2).toString().replace('.', ',')
    }

	window._initialized = true
})()
