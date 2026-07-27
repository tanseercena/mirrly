fetch(`${process.env.API_URL}/${document.getElementById('pushy').dataset.shop}/api-token`)
    .then(resp => resp.json())
    .then(data => {
        localStorage.setItem('pushyApiToken', data.data)
        
        require('./vendor/jquery')

        require('./campaigns/promotion_bar')
        require('./campaigns/sales_pops')
        require('./campaigns/sticky_cart_bar')
        require('./campaigns/exit_discount')
        const { pushyEl } = require('./bootstrap')

    })


