// Written by hand, boo

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

function variant(v, old, changes) {
    m = old+', '+v;
    monsters[m] = clone(monsters[old]);
    for (i in changes){
	if (monsters[m][i] && monsters[m][i].push) {
	    monsters[m][i].push(changes[i]);
	}else {
	    monsters[m][i] = changes[i];
	}
	if (!monsters[m]['>anchor']) {
	    monsters[m]['>anchor'] = v.toLowerCase()+old;
	}
    }
    monsters[m]['>variant'] = 1;
}


monsters["Human"] ={'Cha': '10', 'Str': '10', 'Space': '5 ft.', 'Reach': '5 ft.', 'Alignment - Morals': ['any'], 'Hit Points': '4', 'Environment': ['any'], 'Type': 'humanoid', 'Alignment - Ethics': ['any'], 'Challenge Rating': ['0.5'], 'Ref': '+0', 'Hit Die': 'd8', 'Hit Dice': '1', 'Alignment - Free Will': 'any', 'Wis': '10', 'Fort': '+2', 'Dex': '10', 'Base Attack': '+1', 'Armor Class -- Touch': '10', 'Advancement': 'by character class', 'Will': '+0', 'Treasure': 'standard', 'Con': '10', 'Level Adjustment': '+0', 'Special Attacks': 'none', 'Weapons (ranged touch)': [], 'Special Qualities': ['bonus feat', 'extra skill'], 'Weapons (melee touch)': [], 'Grapple': '+1', 'Armor Class': '10', 'Int': '10', 'Initiative': '+1', 'Subtypes': ['human'], 'Speed': ['30 ft'], 'Armor Class -- Flat-footed': '10', 'Alignment': 'any', 'Size': 'medium', '>url':'http://www.d20srd.org/srd/races.htm#humans'};


variant('Aquatic', 'Elf', {'Int':'8', 'Con':'10', 'Subtypes':'aquatic', 'Speed':'swim 40 ft'});
variant('Gray', 'Elf', {'Int':'12', 'Str':'8'});
variant('Wild', 'Elf', {'Int':'8', 'Con':'10'});
variant('Wood', 'Elf', {'Str':'12', 'Int':'8'});

variant('Forest', 'Gnome', {'Special Qualities': 'pass without trace', 'hide':'+7', 'hide (in forest)':'+11'});

variant('Deep', 'Halfling', { 'Darkvision':'60 ft.', 'Special Qualities':'stonecunning'});

variant('Air', 'Gnome', { 'Immunities':'suffocation', 'Dex':'12', 'Con':'10', '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Air', 'Goblin', { 'Immunities':'suffocation', 'Dex':'14', 'Con':'8', 'Cha':'10', '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Earth', 'Dwarf', { 'Str':'12', 'Dex':'8', '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Earth', 'Kobold', { 'Str':'8', 'Dex':'10', '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Fire', 'Elf', { 'Resistances':'fire 5',  'Int':'12', 'Cha':'8' , '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Fire', 'Hobgoblin', { 'Resistances':'fire 5','Int':'12', 'Cha':'8' , '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Water', 'Halfling', { 'Speed':'swim 20 ft', 'Con':'12' , '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});
variant('Water', 'Orc', { 'Speed':'swim 30 ft', 'Con':'12' , '>url':'http://www.d20srd.org/srd/variant/races/elementalRacialVariants.htm'});



variant('Aquatic', 'Dwarf', { 'Subtypes':'aquatic', 'Speed':'swim 20 ft', 'Str':'12', 'Dex':'6', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Aquatic', 'Gnome', { 'Subtypes':'aquatic', 'Speed':'swim 30 ft', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Aquatic', 'Goblin', { 'Subtypes':'aquatic', 'Speed':'swim 30 ft', 'Dex':'10', 'Con':'12', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Aquatic', 'Halfling', { 'Subtypes':'aquatic', 'Speed':'swim 20 ft', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Aquatic', 'Human', { 'Subtypes':'aquatic', 'Speed':'swim 30 ft', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Aquatic', 'Kobold', { 'Subtypes':'aquatic', 'Speed':'swim 40 ft', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Aquatic', 'Orc', { 'Subtypes':'aquatic', 'Speed':'swim 30 ft', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});



variant('Arctic', 'Dwarf', { 'Special Qualities':'cold endurance', 'Str':'12', 'Dex':'6' , '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Arctic', 'Elf', {  'Special Qualities':'cold endurance', 'Str':'8', 'Con':'10', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Arctic', 'Gnome', {  'Special Qualities':'cold endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Arctic', 'Goblin', {  'Special Qualities':'cold endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Arctic', 'Halfling', {  'Special Qualities':'cold endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'}); 
variant('Arctic', 'Kobold', {  'Special Qualities':'cold endurance', 'Str':'8', 'Wis':'8', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Arctic', 'Orc', {  'Special Qualities':'cold endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});


variant('Desert', 'Dwarf', { 'Special Qualities':'heat endurance', 'Dex':'8', 'Cha':'10' , '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Desert', 'Elf', {  'Special Qualities':'heat endurance', 'Str':'8', 'Con':'10', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Desert', 'Gnome', {  'Special Qualities':'heat endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Desert', 'Goblin', {  'Special Qualities':'heat endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Desert', 'Halfling', {  'Special Qualities':'heat endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'}); 
variant('Desert', 'Kobold', {  'Special Qualities':'heat endurance', 'Con':'10', 'Wis':'8', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});
variant('Desert', 'Orc', {  'Special Qualities':'heat endurance', 'Feats':'endurance', '>url':'http://www.d20srd.org/srd/variant/races/environmentalRacialVariants.htm'});



monsters["Goliath"] ={'Cha': '10', 'Str': '14', 'Space': '5 ft.', 'Reach': '10 ft.', 'Alignment - Morals': ['good'], 'Hit Points': '4', 'Environment': ['mountain'], 'Type': 'monstrous humanoid', 'Alignment - Ethics': ['chaotic'], 'Challenge Rating': ['0.5'], 'Ref': '-1', 'Hit Die': 'd8', 'Hit Dice': '1', 'Alignment - Free Will': 'often', 'Wis': '10', 'Fort': '+3', 'Dex': '8', 'Base Attack': '+1', 'Armor Class -- Touch': '9', 'Advancement': 'by character class', 'Will': '+0', 'Treasure': 'standard', 'Con': '12', 'Level Adjustment': '+1', 'Special Qualities': ['acclimated', 'powerful build', 'mountain movement'], 'Weapons (ranged touch)': [], 'Special Attacks': [], 'Weapons (melee touch)': [], 'Grapple': '+6', 'Armor Class': '9', 'Int': '10', 'Initiative': '-1', 'Subtypes': [], 'Speed': ['30 ft'], 'Armor Class -- Flat-footed': '9', 'Alignment': 'often chaotic good', 'Size': ['medium', 'large'], '>url':'http://www.wizards.com/default.asp?x=dnd/iw/20040711b&page=5'};

monsters["Halfgiant"].Size = ['medium', 'large'];