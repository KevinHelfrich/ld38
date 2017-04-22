var kovm = {
    playerHealth : ko.observable(100),
    enemyHealth : ko.observable(),
    enemyName : ko.observable(),
    playerMaxHealth : ko.observable(100),
    playerWeapon : ko.observable('dagger')
};


ko.applyBindings(kovm);
