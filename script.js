function initMap() {
    const center = { lat: 40.8937, lng: -83.6502 };

    console.log("initMap function is being called.");

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: center,
        mapId: '74d831cea013c3ca'  // Replace with your actual Map ID
    });

    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: center,
        map: map,
        title: "Fletcher DrivePro Mobile Service Center",
    });

    const serviceRanges = [
        { radius: 8000, color: "#2ECC71", speed: 70, distanceLabel: "0-5 miles", fee: "$20", zIndex: 3 },
        { radius: 16000, color: "#1ABC9C", speed: 100, distanceLabel: "5-10 miles", fee: "$35", zIndex: 2 },
        { radius: 32000, color: "#16A085", speed: 130, distanceLabel: "10-20 miles", fee: "$50", zIndex: 1 }
    ];

    serviceRanges.forEach((range, index) => {
        const circle = new google.maps.Circle({
            map: map,
            center: center,
            radius: range.radius,
            fillColor: "transparent",
            fillOpacity: 0,
            strokeColor: range.color,
            strokeOpacity: 0.8,
            strokeWeight: 10 - index * 2,
            zIndex: range.zIndex
        });

        // Custom `InfoWindow` content with black background and green text
        const customInfoWindow = document.createElement('div');
        customInfoWindow.style.position = 'absolute';
        customInfoWindow.style.backgroundColor = '#000000'; // Black background
        customInfoWindow.style.border = '2px solid #2ECC71'; // Green border
        customInfoWindow.style.color = '#2ECC71'; // Green text
        customInfoWindow.style.padding = '8px';
        customInfoWindow.style.fontSize = '14px';
        customInfoWindow.style.fontWeight = 'bold';
        customInfoWindow.style.borderRadius = '8px';
        customInfoWindow.style.maxWidth = '200px';
        customInfoWindow.style.textAlign = 'center';
        customInfoWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        customInfoWindow.innerHTML = `${range.distanceLabel} <br> Service Call Fee: ${range.fee}`;
        customInfoWindow.style.display = 'none'; // Start hidden

        // Add customInfoWindow to map container
        map.getDiv().appendChild(customInfoWindow);

        // Show custom `InfoWindow` on hover
        circle.addListener('mouseover', () => {
            // Get the position on screen
            const projection = map.getProjection();
            const position = projection.fromLatLngToPoint(new google.maps.LatLng(center.lat + (range.radius / 111000), center.lng));
            customInfoWindow.style.left = `${position.x}px`;
            customInfoWindow.style.top = `${position.y}px`;
            customInfoWindow.style.display = 'block';
        });

        // Hide custom `InfoWindow` on mouseout
        circle.addListener('mouseout', () => {
            customInfoWindow.style.display = 'none';
        });

        // Optional: Set up the breathing animation effect
        let opacityIncreasing = false;
        setTimeout(() => {
            setInterval(() => {
                const currentOpacity = circle.get('strokeOpacity');
                circle.set('strokeOpacity', opacityIncreasing ? currentOpacity + 0.02 : currentOpacity - 0.02);
                if (currentOpacity <= 0.5) opacityIncreasing = true;
                if (currentOpacity >= 0.8) opacityIncreasing = false;
            }, range.speed);
        }, index * 200);
    });
}
