var kovm = {
    playerHealth : ko.observable(100),
    enemyHealth : ko.observable(),
    enemyName : ko.observable(),
    playerMaxHealth : ko.observable(100)
};


ko.applyBindings(kovm);
