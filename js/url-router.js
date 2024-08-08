const urlPageTitle = 'Тестовое задание'

document.addEventListener('click', (e) => {
    const targetDiv = e.target.closest('div');
    const href = targetDiv.getAttribute('data-href');

    if (!href) {
        return;
    }
    urlLocationHandler(href)
})

const urlRoutes = {
    404: {
        template: '/templates/404.html',
        title: '404 | ' + urlPageTitle,
        descripytion: 'Это не найденная страница',
    },
    '/' : {
        template: '/templates/general.html',
        title: 'General | ' + urlPageTitle,
        descripytion: 'Это главная страницыа',
    },
    '/locations' : {
        template: '/templates/locations.html',
        title: 'Home | ' + urlPageTitle,
        descripytion: 'Это домашняя страница',
        link: 'Локации'
    },
    '/settings' : {
        template: '/templates/settings.html',
        title: 'About | ' + urlPageTitle,
        descripytion: 'Это познавательная страницыа',
        link: 'Настройки'
    }
}

const urlLocationHandler = async (href) => {
    const route = urlRoutes[href] || urlRoutes[404];
    const html = await fetch(route.template).then(response => response.text());
    const pageName = route.link || route.title;

    document.getElementById('htmlContent').innerHTML = html;
    document.getElementById('contentName').innerText = pageName;
    document.title = route.title;
    document.querySelector('meta[name="description"]').setAttribute('content', route.descripytion);

    if (href === '/locations') {
        import('/js/locations.js').then(module => {
            module.initLocationsPage();
        });
    }
}

window.onpopstate = () => urlLocationHandler(window.location.pathname);
window.onload = () => urlLocationHandler(window.location.pathname);

urlLocationHandler()