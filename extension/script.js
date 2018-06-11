(function() {
	if (window._initialized)
		return
	if (!window.location.pathname.includes('zakaz'))
		return

    let updateTotal = () => {}

    let basket = {
        content: new Map(),
        has(s) {
            return basket.content.has(s)
        },
        put(description, price) {
            if (this.content.has(description)) {
                this.content.get(description).count++
            } else {
                this.content.set(description, {price, count: 1})
            }
            return this.content.get(description)
        },
        get(description) {
            return this.content.get(description)
        },
        delete(description) {
            this.content.delete(description)
        },
        getResult() {
            let result = 0
            let msg = Array.from(this.content.entries())
                .map(([description, {price, count}]) => {
                    result += price * count
                    let counter = count > 1
                        ? `${count}x `
                        : ''
                    return counter + description + ` - ${formatFloat(price * count)}p.`
                })
                .join('\n')
            console.log(msg)
            console.log(formatFloat(result))
            updateTotal(result)
            copyText(msg)
            return [msg, result]
        },
    }

	setTimeout(updateDom, 300) // wait for page loading

	function updateDom() {
        const btnTemplate = `
		<div class="shop-item__order-btn">
        	<span class="btn btn-block _counter">&nbsp;</span>
        	<span class="btn btn-block _btn-add"> В корзину</span>
        	<span class="btn btn-block _btn-remove">
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

        replaceBasket()
        cleanUp()
        setInterval(replaceItems, 100) // to handle new dom changes

        function replaceBasket() {
            let container = document.querySelector('.shop-view-sidebar > div > cart-summary > .shop-cart')
            container.innerHTML = basketTemplate

            let btn = container.querySelector('#_copy-btn')
            let priceHolder = container.querySelector('#_total_price')

            updateTotal = f => priceHolder.innerText = formatFloat(f) + 'p.'
            btn.onclick = basket.getResult()
        }

        function replaceItems() {
            Array.from(document.querySelectorAll('.shop-item'))
                .filter(item => !item._updated)
                .forEach(replaceItem)
        }

        function replaceItem(item) {
            let container = item.querySelector('.shop-item__order-btn')
            container.innerHTML = btnTemplate
            let oldCounter = item.querySelector('.shop-item__order')
            oldCounter.parentNode.removeChild(oldCounter)

	        let description = item.querySelector('.shop-item__text').innerText
            let btnAdd = container.querySelector('._btn-add')
            let btnRemove = container.querySelector('._btn-remove')
            let counter = container.querySelector('._counter')

	        if (basket.has(description)) {
		        btnRemove.classList.add('_enabled')
                updateCounter(basket.get(description))
	        }

            btnAdd.onclick = () => {
                let price = item.querySelector('.shop-item__weight-price > dl > dd:nth-child(4)').innerText
                price = parseFloat(price.trim().replace(',', '.').replace('р.', ''))
                basket.put(description, price)
                updateCounter(basket.get(description))

                btnRemove.classList.add('_enabled')

                basket.getResult()
            }

            btnRemove.onclick = () => {
                basket.delete(description)
                btnRemove.classList.remove('_enabled')
                updateCounter()

                basket.getResult()
            }

            function updateCounter(i) {
                if (i && i.count > 0) {
                    counter.innerText = i.count + 'X'
                } else {
                    counter.innerHTML = '&nbsp;'
                }
            }

            item._updated = true
        }

        function cleanUp() {
            document.querySelector('footer').innerHTML = ''
            document.querySelector('.page-slogan').innerHTML = ''
            document.querySelector('.top-content').innerHTML = ''
        }
	}

	function formatFloat(f) {
	    return f.toFixed(2).toString().replace('.', ',')
    }

    function copyText(text) {
        let textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
            document.execCommand('copy')
        } catch (err) {
            console.error('Oops, unable to copy', err)
        }

        document.body.removeChild(textArea)
    }

	window._initialized = true
})()
