(function() {
	if (window._initialized)
		return
	if (!window.location.pathname.includes('zakaz'))
		return

	let order = new Map()
    let updateTotal = () => {}

	setTimeout(updateDom, 300) // wait for page loading

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

        replaceBasket()
        cleanUp()
        setInterval(replaceItems, 100) // to handle new dom changes

        function replaceBasket() {
            let container = document.querySelector('.shop-view-sidebar > div > cart-summary > .shop-cart')
            container.innerHTML = basketTemplate

            let btn = container.querySelector('#_copy-btn')
            let priceHolder = container.querySelector('#_total_price')

            updateTotal = f => priceHolder.innerText = formatFloat(f) + 'p.'
            btn.onclick = getResult
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
            let btnRemove = container.querySelector('._btn-remove')

            btnAdd.onclick = () => {
                let description = item.querySelector('.shop-item__text').innerText
                let price = item.querySelector('.shop-item__weight-price > dl > dd:nth-child(4)').innerText
                price = parseFloat(price.trim().replace(',', '.').replace('р.', ''))
                order.set(description, price)

                btnRemove.classList.add('_enabled')

                getResult()
            }

            btnRemove.onclick = () => {
                let description = item.querySelector('.shop-item__text').innerText
                order.delete(description)
                btnRemove.classList.remove('_enabled')

                getResult()
            }

            item._updated = true
        }

        function cleanUp() {
            document.querySelector('footer').innerHTML = ''
            document.querySelector('.page-slogan').innerHTML = ''
            document.querySelector('.top-content').innerHTML = ''
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
        copyText(msg)
		return [msg, result]
	}

	function formatFloat(f) {
	    return f.toFixed(2).toString().replace('.', ',')
    }

    function copyText(text) {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

	window._initialized = true
})()
