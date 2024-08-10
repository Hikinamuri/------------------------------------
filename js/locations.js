// Редактирование локации
// Удаление локации
// Добаавление страницы настройки

let locations = []

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
        barcode: '987654321',
        RFID: 'RFID54321',
        virtualLocation: true,
        forLostItems: true,
        name: 'Локация 2',
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
]

let localLocations;

localStorage.getItem('locations') == null ? localLocations = [] : localLocations = JSON.parse(localStorage.getItem('locations'))

function addLocation(location) {
    const { nastings, ...newLocation } = location;
    newLocation.nastings = [];

    const nastingName = location.nastings[0].locationName;
    console.log(nastingName, 'Начало')


    function addNastingToLocations(locationList) {
        console.log(nastingName, 'item', locationList)

        for (let item of locationList) {
            if (item.name == nastingName) {
                console.log('Не вложенность')
                item.nastings.push(newLocation)
                localStorage.setItem('locations', JSON.stringify(localLocations));
                return
            } else {
                console.log('Вложенность')
                addNastingToLocations(item.nastings)
            }
        }
    }

    if (!nastingName) {
        console.log(location.nastings[0].locationName, 'В главную')
        localLocations.push(newLocation);
        localStorage.setItem('locations', JSON.stringify(localLocations));
        return;
    } else {
        console.log(location.nastings[0].locationName, 'Дальше')
        addNastingToLocations(localLocations)
    }
}

if (localLocations.length == 0) {
    defaultLocations.forEach(loc => {
        addLocation.call(this, loc)
    })
}

function locationSelect(locations) {
    const select = document.getElementById('locationSelect');
    const editSelect = document.getElementById('edit-locationSelect');

    select.innerHTML = '';
    editSelect.innerHTML = '';

    let option = document.createElement('option');
    let editOption = document.createElement('option');
    option.value = '';
    option.textContent = 'Вложенность';
    editOption.value = '';
    editOption.textContent = 'Корневой элемент';

    select.appendChild(option)
    editSelect.appendChild(editOption)

    function addOptions(locationList) {
        locationList.forEach(location => {
            option = document.createElement('option');
            option.value = location.name;
            option.textContent = location.name;

            editOption = document.createElement('option');
            editOption.value = location.name;
            editOption.textContent = location.name;

            select.appendChild(option)
            editSelect.appendChild(editOption)

            if(location.nastings.length > 0) {
                addOptions(location.nastings)
            }
        })
    }
    addOptions(locations)
}

function findLocationByName(locations, name) {
    for (let location of locations) {
        if (location.name === name) {
            return location;
        } else if (location.nastings.length > 0) {
            let found = findLocationByName(location.nastings, name);
            const parentName = location.name;
            if (found) return {found, parentName};
        }
    }
    return null;
}

function updateLocation(updatedLocation) {
    const name = updatedLocation.name;
    let locationToUpdate = findLocationByName(localLocations, name);
    
    if (locationToUpdate) {
        Object.assign(locationToUpdate, updatedLocation);
        localStorage.setItem('locations', JSON.stringify(localLocations));
    } else {
        console.log("Локация не найдена");
    }
}

function deleteLocation(name) {
    function removeLocation(locations, name) {
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].name == name) {
                locations.splice(i, 1);
                return true;
            } else if (location[i].nastings.lenth > 0) {
                if (removeLocation(location[i].nastings, name)) {
                    return true;
                }
            }
        }
        return false;
    }

    if (removeLocation(localLocations, name)) {
        localStorage.setItem('locations', JSON.stringify(localLocations))
    } else {
        return
    }
}

export function initLocationsPage() {
    locations = localLocations;

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
                            <div class='editingButton'>
                                <img src="../assets/pencil.svg" alt="">
                                Редактировать
                            </div>
                            <div class='deletingButton'>
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
    document.querySelector('#locationList').innerHTML = html;

    function rerenderLocation(locations) {
        const locationList = document.querySelector('#locationList');
        locationList.innerHTML = `<ul>${renderLocations(locations)}</ul>`;
        addEvents();
    }

    function addEvents() {
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
        const editForm = document.getElementById('editForm');
        const addFormDiv = addForm.querySelector('.addForm-div')
        const editFormDiv = editForm.querySelector('.addForm-div')
        const cancelButtonAdd = document.getElementById('cancelButtonAdd');
        const cancelButtonEdit = document.getElementById('cancelButtonEdit');

        addButton.addEventListener('click', function(event) {
            addForm.classList.add('open')
        })
        
        addForm.addEventListener('click', function(event) {
            if (!addFormDiv.contains(event.target)) {
                event.stopPropagation();
                addForm.classList.remove('open');
            }
        })

        editForm.addEventListener('click', function(event) {
            if (!editFormDiv.contains(event.target)) {
                event.stopPropagation();
                editForm.classList.remove('open');
            }
        })

        function clearValue() {
            document.getElementById('locationName').value = '';
            document.getElementById('barcode').value = '';
            document.getElementById('rfid').value = '';
            document.getElementById('locationSelect').value = '';
            document.getElementById('virtualLocation').checked;
            document.getElementById('forLostItems').checked;
        }

        cancelButtonAdd.addEventListener('click', function(event) {
            clearValue()
            event.stopPropagation();
            addForm.classList.remove('open');
        })
        cancelButtonEdit.addEventListener('click', function(event) {
            clearValue()
            event.stopPropagation();
            editForm.classList.remove('open');
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

        document.querySelectorAll('.editingButton').forEach(edit => {
            edit.addEventListener('click', function(event) {
                event.stopPropagation();
    
                const locationName = this.closest('.ulButton-info').querySelector('strong').textContent;
                const response = findLocationByName(localLocations, locationName);
                let locationToEdit = response.found || response
                let parentName = response.parentName || '';

                console.log(response.parentName)
                if (!locationToEdit) {
                    return;
                }
                
                document.getElementById('editForm').classList.add('open');
                document.getElementById('editFormText').innerText = `Изменить локацию - ${locationName}`

                document.getElementById('edit-locationName').value = locationToEdit.name;
                document.getElementById('edit-barcode').value = locationToEdit.barcode;
                document.getElementById('edit-rfid').value = locationToEdit.RFID;
                document.getElementById('edit-locationSelect').value = parentName;
                
                document.getElementById('edit-virtualLocation').checked = locationToEdit.virtualLocation;
                document.getElementById('edit-forLostItems').checked =  locationToEdit.forLostItems;

                document.getElementById('saveButton').addEventListener('click', function() {
                    let updatedLocation = {
                        name: document.getElementById('edit-locationName').value,
                        barcode: document.getElementById('edit-barcode').value,
                        rfid: document.getElementById('edit-rfid').value,
                        virtualLocation: document.getElementById('edit-virtualLocation').checked,
                        forLostItems: document.getElementById('edit-forLostItems').checked
                    }

                    updateLocation(updatedLocation);
                    rerenderLocation(locations),

                    document.getElementById('editForm').classList.remove('open');
                })
            });
        });

        document.querySelectorAll('.deletingButton').forEach(deleting => {
            deleting.addEventListener('click', function(event) {
                event.stopPropagation();

                const locationName = this.closest('.ulButton-info').querySelector('strong').textContent;
                deleteLocation(locationName);
                rerenderLocation(locations);
            });
        });
    }

    document.getElementById('createButton').addEventListener('click', function(event) {
        event.preventDefault();
        console.log(event.target);
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
        console.log('Check',  alertCheck.length > 0)
        alertCheck.length > 0 
            ? alert(`Вы забыли ввести${alertCheck}`) 
            : (addLocation.call(this, locationObject),
                rerenderLocation(locations),
                locationSelect(locations),
                addForm.classList.remove('open'))
        
        console.log(locations)
       
    });
    
    addEvents();
    locationSelect(locations);
}