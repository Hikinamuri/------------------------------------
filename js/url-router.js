const urlPageTitle = 'Тестовое задание'

document.addEventListener('click', (e) => {
    if(!e.target.matches('nav a')) {
        return;
    }
    console.log(e)
    e.preventDefault();
    urlRoute(e);
})

const urlRoutes = {
    404: {
        template: '/templates/404.html',
        title: '404 | ' + urlPageTitle,
        descripytion: 'Это не найденная страница',
    },
    '/' : {
        template: '/index.html',
        title: 'General | ' + urlPageTitle,
        descripytion: 'Это главная страницыа',
    },
    '/home' : {
        template: '/templates/home.html',
        title: 'Home | ' + urlPageTitle,
        descripytion: 'Это домашняя страницыа',
    },
    '/about' : {
        template: '/templates/about.html',
        title: 'About | ' + urlPageTitle,
        descripytion: 'Это познавательная страницыа',
    }
}

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href)
    urlLocationHandler()
}

const urlLocationHandler = async () => {
    const location = window.location.pathname;
    console.log(location)
    if (location.length == 0) {
        location = '/'
    }

    const route = urlRoutes[location] || urlRoutes[404]
    console.log(route, 'route')
    const html = await fetch(route.template).then(response => response.text())
    document.getElementById('content').innerHTML = html
    document.title = route.title;
    document
        .querySelector('meta[name="description"]')
        .setAttribute('content', route.description)
}

window.onpopstate = urlLocationHandler
window.onload = urlLocationHandler;
window.route = urlRoute

urlLocationHandler()