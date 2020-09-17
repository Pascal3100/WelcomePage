// jshint esversion:6

function getCoords() {
    return new Promise(function(resolve, reject) {
        if (!navigator.permissions) {
            // Permission API was not implemented
            reject(new Error("Permission API is not supported"));
        }
        // Permission API is implemented
        navigator.permissions.query({
            name: 'geolocation'
        }).then(function(permission) {
            // is geolocation granted?
                if (permission.state === "granted") {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        resolve(pos.coords);
                    });
                } else {
                    resolve(null);
                }
            }
        );
    });
}
//
// Envoi des données de geolocalisation au server et redirection vers la page d'acceuil
getCoords().then(
    function(coords) {
        $.post( "/setGeoLocation", {latitude: coords.latitude,
                                    longitude: coords.longitude} );
        window.location.replace("/home");
    });

