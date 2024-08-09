// {
//     name: 'Location 2',
//     barcode: '987654321',
//     RFID: 'RFID54321',
//     nestings: [],
//     virtualLocation: true,
//     forLostItems: true
// }

const locations = []

const defaultLocations = [
   {
        name: 'Локация 1',
        barcode: '',
        RFID: 'RFID54321',
        virtualLocation: false,
        forLostItems: true,
        nastings: [{
            locationName: '',
        }]
    },
    {
        barcode: '',
        RFID: 'RFID54321',
        virtualLocation: true,
        forLostItems: false,
        name: 'Подотдел 1',
        nastings: [{
            locationName: 'Локация 1',
        }]
    },
    {
        barcode: '987654321',
        RFID: 'RFID54321',
        virtualLocation: false,
        forLostItems: true,
        name: 'Подотдел 2',
        nastings: [{
            locationName: 'Локация 1',
        }]
    },
   {
        barcode: '987654321',
        RFID: 'RFID54321',
        virtualLocation: true,
        forLostItems: true,
        name: 'Подотдел 3',
        nastings: [{
            locationName: 'Локация 1',
        }]
    },
    {
        barcode: '987654321',
        RFID: 'RFID54321',
        virtualLocation: false,
        forLostItems: false,
        name: 'Подподотдел',
        nastings: [{
            locationName: 'Подотдел 2',
        }]
    },
    {
        barcode: '987654321',
        RFID: 'RFID54321',
        virtualLocation: true,
        forLostItems: true,
        name: 'Локация 2',
        nastings: [{
            locationName: '',
        }]
    },
]


function addLocation(location) {
    const { nastings, ...newLocation } = location;
    newLocation.nastings = [];

    if (!location.nastings[0].locationName) {
        locations.push(newLocation);
        return;
    }
    locations.map(item => {
        if(item.name == location.nastings[0].locationName) {
            item.nastings.push(newLocation)
        } else {
            item.nastings.map(item1 => {
                if(item1.name == location.nastings[0].locationName) {
                    item1.nastings.push(newLocation)
                }
            })
        }
    })
}

defaultLocations.forEach(loc => {
    addLocation.call(this, loc)
})

function locationSelect(location) {
    const select = document.getElementById('locationSelect');
    select.innerHTML = '';

    let option = document.createElement('option');
    option.value = '';
    option.textContent = 'Вложенность';
    select.appendChild(option)

    function addOptions(locationList) {
        locationList.forEach(location => {
            option = document.createElement('option');
            option.value = location.name;
            option.textContent = location.name;
            select.appendChild(option)
            if(location.nastings.length > 0) {
                addOptions(location.nastings)
            }
        })
    }
    addOptions(location)
}

export function initLocationsPage() {
    function renderLocations(locations) {
        return locations.map((location) => `
            <li>
                <div class='ulButton'>
                    <div class='ulButton-plus'> + </div>
                    <div class='ulButton-threeDots'> 
                        <img src="../assets/threeDots.svg" alt="">
                    </div>
                    <div class='ulButton-info'>
                        <strong>${location.name}</strong>
                        <div class='location-settings hide'>
                            <div>
                                <img src="../assets/pencil.svg" alt="">
                                Редактировать
                            </div>
                            <div>
                                <img src="../assets/cross.svg" alt="">
                                Удалить
                            </div>
                        </div>
                        <div class='location-info'>
                            ${location.virtualLocation == true ? '<p> Виртуальная </p>' : ''}
                            ${location.forLostItems == true ? '<p> Для утерь </p>' : ''}
                        </div>
                    </div>
                </div>
                ${location.nastings.length > 0 ? `<ul>${renderLocations(location.nastings)}</ul>` : ''}
            </li>
        `).join('');
    }
 
    const html = `<ul>${renderLocations(locations)}</ul>`;

    function rerenderLocation(locations) {
        const locationList = document.querySelector('#locationList');
        locationList.innerHTML = `<ul>${renderLocations(locations)}</ul>`;
    }

    document.querySelector('#locationList').innerHTML = html;

    document.querySelectorAll('#locationList li').forEach(li => {
        li.addEventListener('click', function(event) {
            event.stopPropagation();
            this.classList.toggle('expanded');

            const ulButtonPlus = this.querySelector('.ulButton-plus');
            
            if (ulButtonPlus) {
                ulButtonPlus.classList.toggle('active') ? 
                ulButtonPlus.textContent = '-' : 
                ulButtonPlus.textContent = '+';
            }
        });
    });

    const buttonList = document.getElementById('buttonList')
    buttonList.querySelector('div').classList.add('button-active')
    document.getElementById('contentName').innerText = `Локации / Все локации`;
    buttonList.addEventListener('click', function(event) {
        event.stopPropagation();

        const buttons = this.querySelectorAll('div');
        
        buttons.forEach(button => button.classList.remove('button-active'));
        if (event.target.matches('div')) {
            event.target.classList.add('button-active');

            const buttonName = event.target.innerText;
            document.getElementById('contentName').innerText = `Локации / ${buttonName}`;
        }
    })
    const addButton = document.getElementById('addButton');
    const addForm = document.getElementById('addForm');
    const addFormDiv = addForm.querySelector('.addForm-div');
    addButton.addEventListener('click', function(event) {
        addForm.classList.add('open')
    })
    addForm.addEventListener('click', function(event) {
        if (!addFormDiv.contains(event.target)) {
            event.stopPropagation();
            addForm.classList.remove('open');
        }
    })

    document.querySelectorAll('.ulButton-threeDots').forEach(dot => {
        dot.addEventListener('click', function(event) {
            event.stopPropagation();

            const parent = this.closest('.ulButton').querySelector('.ulButton-info');
            if (parent) {
                const locationSettings = parent.querySelector('.location-settings');
                const locationInfo = parent.querySelector('.location-info');
    
                if (locationSettings) {
                    locationSettings.classList.toggle('hide');
                }
                if (locationInfo) {
                    locationInfo.classList.toggle('hide');
                }
            }
        });
        
    });

    document.getElementById('createButton').addEventListener('click', function(event) {
        event.preventDefault();
    
        const locationName = document.getElementById('locationName').value;
        const barcode = document.getElementById('barcode').value;
        const rfid = document.getElementById('rfid').value;
        const selectedLocation = document.getElementById('locationSelect').value;
        const virtualLocation = document.getElementById('virtualLocation').checked;
        const forLostItems = document.getElementById('forLostItems').checked;
    
        const locationObject = {
            name: locationName,
            barcode: barcode,
            RFID: rfid,
            virtualLocation: virtualLocation,
            forLostItems: forLostItems,
            nastings: [{
                locationName: selectedLocation,
            }]
        };
    
    
        const alertCheck = [];
        const check = {
            название: locationName,
            шрифхкод: barcode,
            RFID: rfid
        };
        for (let key of Object.keys(check)) {
            if (!check[key]) {
                alertCheck.push(' ' + key);
            }
        };

        alertCheck.length > 0 
            ? 
            alert(`Вы забыли ввести${alertCheck}`) 
            : 
            (addLocation.call(this, locationObject));
            rerenderLocation(locations);
        
        console.log(locations)
       
    });

    locationSelect(locations);
}

initLocationsPage();