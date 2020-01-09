(function () {
  const urlMap = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHItcml2ZXJvIiwiYSI6ImNrNHB2MmEwZTF4enIzZG1ycjVid2dvY2kifQ.4Pa5VpeHzFg6osCJm9n8jg';
  const baseMap = L.map('main-map', {
    center: [-34.8986, -56.1727],
    zoom: 13,
    minZoom: 12
  });
  const localData = `${location.href}data.json`;
  let baseData = [];
  let dataLoaded = [];
  let markersLoaded = [];

  function init () {
    L.tileLayer(urlMap, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'your.mapbox.access.token'
    }).addTo(baseMap);
  
    fetch(localData)
      .then(res => res.json())
      .then(data => {
        baseData = data;
        dataLoaded = data;
        renderLocations();
      });
    
    document.querySelectorAll('.check-filter')
      .forEach(DOMItem => DOMItem.addEventListener('click', filterLocations));
  }

  function filterLocations (ev) {
    const checkedInputs = document.querySelectorAll('input[type="checkbox"]:checked');
    if (baseData.length && checkedInputs.length) {
      dataLoaded = [];
      baseData.forEach(row => {
        checkedInputs.forEach(target => {
          if (row.tags.indexOf(target.value) !== -1 && dataLoaded.indexOf(row) === -1) {
            dataLoaded.push(row);
          }
        });
      });
    } else if (!checkedInputs.length) {
      dataLoaded = baseData;
    }
    renderLocations();
  }
  
  function renderLocations () {
    markersLoaded.forEach(marker => baseMap.removeLayer(marker));
    markersLoaded = [];
    dataLoaded.forEach(row => {
      const marker = L.marker(row.location);
      marker.bindPopup(`
        <h3>${row.name}</h3>
        <p><span class="bolder">Estilos</span>: ${row.style}</p>
        <p><span class="bolder">Dirección</span>: ${row.address}</p>
      `);
      markersLoaded.push(marker);
      marker.addTo(baseMap);
    });
  }

  init();
}());