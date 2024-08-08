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
        nastings: [{
            locationName: '',
        }]
    },
    {
        name: 'Подотдел 1',
        nastings: [{
            locationName: 'Локация 1',
        }]
    },
    {
        name: 'Подотдел 2',
        nastings: [{
            locationName: 'Локация 1',
        }]
    },
   {
        name: 'Подотдел 3',
        nastings: [{
            locationName: 'Локация 1',
        }]
    },
    {
        name: 'Подподотдел',
        nastings: [{
            locationName: 'Подотдел 2',
        }]
    },
    {
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

console.log(locations)

export function initLocationsPage() {
    function renderLocations(locations) {
        return locations.map((location) => `
            <li>
                <div class='ulButton'>
                    <div class='ulButton-plus'> + </div>
                    <div class='ulButton-threeDots'> 
                        <img src="../assets/threeDots.svg" alt="">
                    </div>
                    <strong>${location.name}</strong>
                </div>
                ${location.nastings.length > 0 ? `<ul>${renderLocations(location.nastings)}</ul>` : ''}
            </li>
        `).join('');
    }
 
    const html = `<ul>${renderLocations(locations)}</ul>`;

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
}

initLocationsPage();