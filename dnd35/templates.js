function append(d, k, v) {
    if (typeof(d[k]) == typeof([])) {
	d[k].push(v);
    } else if  (typeof(d[k]) == typeof('')) {
	d[k] = [d[k], v];
    } else {
	d[k] = v;
    }
}

function appendAll(d, k, v) {
    if (typeof(v)=='undefined') {
	return;
    } else if (typeof(v)=='object') {
	for (var i in v) {
	    append(d, k, v[i]);
	}
    } else {
	append(d, k, v);
    }
}

function boost(o, k, n) {
    if (!o[k]) {
	//	dbg('o has no '+k);
	return false;
    }
    //    dbg(k+': '+o[k]);
    l = (o[k]+'').split(/([\d\.]+|\(|\))/);
    //    dbg(' has '+l.length+' parts');
    for (i in l) {
	if (l[i]-0+'' == l[i]) {
	    l[i] = (l[i] - -n) + '';
	}
    }
    o[k] = l.join('');
    //    dbg('new val '+o[k]);
    return true;
}

function recalECL(m){
    la = m['Level Adjustment'] - 0;
    if (isNaN(la)) {
	return;
    }
    rhd = m['Hit Dice'] - 0;
    m['Equivalent Character Level'] = (rhd < 2 ? la : la + rhd) + '';
}

function boostLA(o, n) {
    boost(o, 'Level Adjustment', n);
    recalECL(o);
}

function boostNA(o, n) {
    boost(o, 'Armor Class -- Flat-footed', n);
    boost(o, 'Armor Class', n);
    if (!boost(o, 'Armor Class: natural', n)) {
	o['Armor Class: natural'] = n + '';
    }
}

templates = {

    'Phrenic': function (c) {
	if (c.Subtypes && c.Subtypes.indexOf('psionic') > -1 ||  c.Int == 0) {
	    return null;
	}
	o = clone(c);
	if (o.Type == 'animal') o.Type = 'magical beast';
	append(o,'Subtypes', 'psionic');
	append(o,'Special Attacks', 'psi-like abilities');
	append(o,'Special Qualities','naturally psionic');
	o['Spell/Power Resistance'] = o['Hit Dice'] + 10;
	boost(o, 'Wis', 2);
	boost(o, 'Cha', 4);
	if (o.Int >= 3) boost(o, 'Int', 2);
	if (o['Hit Dice'] < 5) {
	    boost(o,'Challenge Rating', 1);
	} else if (o['Hit Dice'] < 10) {
	    boost(o,'Challenge Rating', 2);
	} else { 
	    boost(o,'Challenge Rating', 2);
	}
	boostLA(o, 2);
	o['>templateurl'] = 'http://www.d20srd.org/srd/psionic/monsters/phrenicCreature.htm';
	return o;
    },

    'Celestial': function (c) {
	if (c.Subtypes && c.Subtypes.indexOf('incorporeal') > -1 || 
	    ['aberration', 'animal', 'dragon', 'fey', 'giant', 'humanoid', 'magical beast',
	     'monstrous humanoid', 'plant', 'vermin'].indexOf(c.Type) == -1 ||
	    (c['Alignment - Free Will'] == 'always' && 
	     c['Alignment - Morals'] == ['evil'])) {
	    return null;
	}
	o = clone(c);
	if (o.Type == 'animal') o.Type = 'magical beast';
	append(o,'Subtypes','extraplanar');
	append(o,'Special Attacks','smite evil');
	o['Alignment - Free Will'] = 'always';
	o['Alignment - Morals'] = 'good';
	o['Alignment - Ethics'] = 'any';
	o['Alignment'] = 'always good (any)';
	o['Darkvision'] = '60 ft';
	o['Spell/Power Resistance'] = o['Hit Dice'] + 5;
	if (o.Int < 3) o.Int = 3;
	if (o['Hit Dice'] < 4) {
	    append(o,'Resistances','acid 5');
	    append(o,'Resistances','cold 5');
	    append(o,'Resistances','electricity 5');
	} else if (o['Hit Dice'] < 8) {
	    append(o,'Resistances','acid 5');
	    append(o,'Resistances','cold 5');
	    append(o,'Resistances','electricity 5');
	    append(o,'Damage Reduction', '5/magic');
	    boost(o, 'Challenge Rating', 1);
	} else if (o['Hit Dice'] < 12) {
	    append(o,'Resistances','acid 10');
	    append(o,'Resistances','cold 10');
	    append(o,'Resistances','electricity 10');
	    append(o,'Damage Reduction', '5/magic');
	    boost(o, 'Challenge Rating', 2);
	} else { 
	    append(o,'Resistances','acid 10');
	    append(o,'Resistances','cold 10');
	    append(o,'Resistances','electricity 10');
	    append(o,'Damage Reduction', '10/magic');
	    boost(o, 'Challenge Rating', 2);
	}
	boostLA(o, 2);
	o['>templateurl'] = 'http://www.d20srd.org/srd/monsters/celestialCreature.htm';
	return o;
    },
    
    'Fiendish': function (c) {
	if (c.Subtypes && c.Subtypes.indexOf('incorporeal') > -1 || 
	    ['aberration', 'animal', 'dragon', 'fey', 'giant', 'humanoid', 'magical beast',
	     'monstrous humanoid', 'plant', 'vermin'].indexOf(c.Type) == -1 ||
	    (c['Alignment - Free Will'] == 'always' && 
	     c['Alignment - Morals'] == ['good'])) {
	    return null;
	}
	o = clone(c);
	if (o.Type == 'animal') o.Type = 'magical beast';
	append(o,'Subtypes','extraplanar');
	append(o,'Special Attacks','smite good');
	o['Alignment - Free Will'] = 'always';
	o['Alignment - Morals'] = 'evil';
	o['Alignment - Ethics'] = 'any';
	o['Alignment'] = 'always evil (any)';
	o['Darkvision'] = '60 ft';
	o['Spell/Power Resistance'] = o['Hit Dice'] + 5;
	if (o.Int < 3) o.Int = 3;
	if (o['Hit Dice'] < 4) {
	    append(o,'Resistances','fire 5');
	    append(o,'Resistances','cold 5');
	} else if (o['Hit Dice'] < 8) {
	    append(o,'Resistances','fire 5');
	    append(o,'Resistances','cold 5');
	    append(o,'Damage Reduction', '5/magic');
	    boost(o,'Challenge Rating', 1);
	} else if (o['Hit Dice'] < 12) {
	    append(o,'Resistances','fire 10');
	    append(o,'Resistances','cold 10');
	    append(o,'Damage Reduction', '5/magic');
	    boost(o,'Challenge Rating', 2);
	} else { 
	    append(o,'Resistances','fire 10');
	    append(o,'Resistances','cold 10');
	    append(o,'Damage Reduction', '10/magic');
	    boost(o,'Challenge Rating', 2);
	}
	boostLA(o, 2);
	o['>templateurl'] = 'http://www.d20srd.org/srd/monsters/fiendishCreature.htm';
	return o;
    },
    
    'HalfCelestial': function (c) {
	if (c.Subtypes && c.Subtypes.indexOf('incorporeal') > -1 || 
	    ['undead','construct','outsider'].indexOf(c.Type) > -1 ||
	    c.Int < 4 ||
	    (c['Alignment - Free Will'] == 'always' && 
	     c['Alignment - Morals'] == ['evil'])) {
	    return null;
	}
	o = clone(c);
	o.Type = 'outsider';
	for (i in o.Speed) {
	    fs = o.Speed[i].split(' ')[0] * 2;
	    if (isNaN(fs)) {
		continue;
	    } else {
		append(o, 'Speed', 'fly '+fs+' (good)');
	    }
	}
	boostNA(o, 1);
	append(o,'Special Attacks','smite evil');
	append(o,'Special Attacks','daylight');
	append(o,'Special Attacks','spell-like abilities');
	o['Alignment - Free Will'] = 'always';
	o['Alignment - Morals'] = 'good';
	o['Alignment - Ethics'] = 'any';
	o['Alignment'] = 'always good (any)';
	o['Darkvision'] = '60 ft';
	o['Spell/Power Resistance'] = o['Hit Dice'] + 10;
	append(o,'Resistances','acid 10');
	append(o,'Resistances','cold 10');
	append(o,'Resistances','electricity 10');
	append(o, 'Immunities', 'disease');
	if (o['Hit Dice'] < 6) {
	    append(o,'Damage Reduction', '5/magic');
	    boost(o,'Challenge Rating', 1);
	} else if (o['Hit Dice'] < 11) {
	    append(o,'Damage Reduction', '5/magic');
	    boost(o,'Challenge Rating', 2);
	} else { 
	    append(o,'Damage Reduction', '10/magic');
	    boost(o,'Challenge Rating', 3);
	}
	boostLA(o, 4);
	boost(o, 'Str', 4);
	boost(o, 'Dex', 2);
	boost(o, 'Con', 4);
	boost(o, 'Int', 2);
	boost(o, 'Wis', 4);
	boost(o, 'Cha', 4);
	o['>templateurl'] = 'http://www.d20srd.org/srd/monsters/halfCelestial.htm';
	return o;
    },

    'HalfFiend': function (c) {
	if (c.Subtypes && c.Subtypes.indexOf('incorporeal') > -1 || 
	    ['undead','construct','outsider'].indexOf(c.Type) > -1 ||
	    c.Int < 4 ||
	    (c['Alignment - Free Will'] == 'always' && 
	     c['Alignment - Morals'] == ['good'])) {
	    return null;
	}
	o = clone(c);
	o.Type = 'outsider';
	for (i in o.Speed) {
	    fs = o.Speed[i].split(' ')[0] - 0;
	    if (isNaN(fs)) {
		continue;
	    } else {
		append(o, 'Speed', 'fly '+fs+' (good)');
	    }
	}
	boostNA(1);
	append(o,'Weapons (melee)', 'claw');
	append(o,'Weapons (melee)', 'bite');
	append(o,'Special Attacks','smite good');
	append(o,'Special Attacks','spell-like abilities');
	o['Alignment - Free Will'] = 'always';
	o['Alignment - Morals'] = 'evil';
	o['Alignment - Ethics'] = 'any';
	o['Alignment'] = 'always evil (any)';
	o['Darkvision'] = '60 ft';
	o['Spell/Power Resistance'] = o['Hit Dice'] + 10;
	append(o,'Resistances','fire 10');
	append(o,'Resistances','acid 10');
	append(o,'Resistances','cold 10');
	append(o,'Resistances','electricity 10');
	append(o, 'Immunities', 'poison');
	if (o['Hit Dice'] < 6) {
	    append(o,'Damage Reduction', '5/magic');
	    boost(o,'Challenge Rating', 1);
	} else if (o['Hit Dice'] < 11) {
	    append(o,'Damage Reduction', '5/magic');
	    boost(o,'Challenge Rating', 2);
	} else { 
	    append(o,'Damage Reduction', '10/magic');
	    boost(o,'Challenge Rating', 3);
	}
	boostLA(o, 4);
	boost(o, 'Str', 4);
	boost(o, 'Dex', 4);
	boost(o, 'Con', 2);
	boost(o, 'Int', 4);
	boost(o, 'Wis', 4);
	boost(o, 'Cha', 2);
	o['>templateurl'] = 'http://www.d20srd.org/srd/monsters/halfFiend.htm';
	return o;
    },


    'HalfDragon': function (c) {
	if (c.Subtypes && c.Subtypes.indexOf('incorporeal') > -1 || 
	    ['undead','construct','outsider'].indexOf(c.Type) > -1) {
	    return null;
	}
	o = clone(c);
	o.Type = 'dragon';
	if (['colossal+', 'colossal', 'gargantuan', 'huge', 'large'].indexOf(o.Size) > -1) {
	    for (i in o.Speed) {
		fs = o.Speed[i].split(' ')[0] * 2;
		if (isNaN(fs)) {
		    continue;
		} else {
		    append(o, 'Speed', 'fly '+fs+' (average)');
		}
	    }
	}
	dicemap = {'d4':'d6', 'd6':'d8', 'd8':'d10', 'd10':'d12'};
	if (dicemap[o['Hit Die']]) {
	    o['Hit Die'] = dicemap[o['Hit Die']];
	    boost(o, 'Hit Points', o['Hit Dice']-0);
	}	    
	boostNA(4);
	append(o,'Weapons (melee)', 'claw');
	append(o,'Weapons (melee)', 'bite');
	append(o,'Special Attacks','breath weapon');
	o['Alignment - Free Will'] = 'always';
	o['Alignment - Morals'] = 'same as dragon';
	o['Alignment - Ethics'] = 'same as dragon';
	o['Alignment'] = 'always same as dragon';
	o['Darkvision'] = '60 ft';
	append(o, 'Immunities', 'paralysis');
	append(o, 'Immunities', 'sleep');
	append(o, 'Immunities', 'acid, fire, cold *or* electricity');
	boost(o, 'Challenge Rating', 2);
	boostLA(o, 3);
	boost(o, 'Str', 8);
	boost(o, 'Con', 2);
	boost(o, 'Int', 2);
	boost(o, 'Cha', 2);
	o['>templateurl'] = 'http://www.d20srd.org/srd/monsters/halfDragon.htm';
	return o;
    },

    'MiddleAged': function(c) {
	if (c.Type != 'humanoid') return null;
	o = clone(c);
	boost(o, 'Str', -1);
	boost(o, 'Dex', -1);
	boost(o, 'Con', -1);
	boost(o, 'Int', 1);
	boost(o, 'Wis', 1);
	boost(o, 'Cha', 1);
	o['>templateurl'] = 'http://www.d20srd.org/srd/description.htm#age';
	return o;
    },

    'Old': function(c) {
	if (c.Type != 'humanoid') return null;
	o = clone(c);
	boost(o, 'Str', -3);
	boost(o, 'Dex', -3);
	boost(o, 'Con', -3);
	boost(o, 'Int', 2);
	boost(o, 'Wis', 2);
	boost(o, 'Cha', 2);
	o['>templateurl'] = 'http://www.d20srd.org/srd/description.htm#age';
	return o;
    },

    'Venerable': function(c) {
	if (c.Type != 'humanoid') return null;
	o = clone(c);
	boost(o, 'Str', -6);
	boost(o, 'Dex', -6);
	boost(o, 'Con', -6);
	boost(o, 'Int', 3);
	boost(o, 'Wis', 3);
	boost(o, 'Cha', 3);
	o['>templateurl'] = 'http://www.d20srd.org/srd/description.htm#age';
	return o;
    },

    'Vampire': function(c) {
	if (c.Type != 'humanoid' && c.Type != 'monstrous humanoid') return null;
	o = clone(c);
	o.Type = 'Undead';
	o['Hit Die'] = 'd12';
	o['Con'] = 0;
	o['Hit Points'] = Math.round(6.5 * (o['Hit Dice'] - 1) + 12);
	boostNA(o, 6);
	append(o, 'Weapons (Melee)', 'slam');
	append(o, 'Special Attacks', 'blood drain');
	append(o, 'Special Attacks', 'children of the night');
	append(o, 'Special Attacks', 'dominate');
	append(o, 'Special Attacks', 'create spawn');
	append(o, 'Special Attacks', 'energy drain');
	append(o, 'Special Qualities', 'gaseous form');
	append(o, 'Special Qualities', 'alternate form');
	append(o, 'Special Qualities', 'spider climb');
	append(o, 'Damage Reduction', '10/silver and magic');
	append(o, 'Turn Resistance', '4');
	append(o, 'Resistances', 'cold 10');
	append(o, 'Resistances', 'electricity 10');
	append(o, 'Regeneration', '10');
	append(o, 'Feats', 'Alertness');
	append(o, 'Feats', 'Combat Reflexes');
	append(o, 'Feats', 'Dodge');
	append(o, 'Feats', 'Improved Initiative');
	append(o, 'Feats', 'Lightning Reflexes');
	boost(o, 'Str', 6);
	boost(o, 'Dex', 4);
	boost(o, 'Int', 2);
	boost(o, 'Wis', 2);
	boost(o, 'Cha', 4);
	boost(o, 'Challenge Rating', 2);
	boostLA(o, 8);
	o['Alignment - Free Will'] = 'always';
	o['Alignment - Morals'] = 'evil';
	o['Alignment - Ethics'] = 'any';
	o['Alignment'] = 'always evil (any)';
	return o;
    }
};


function lycanthrope(a) {
    return  function(h) {
	if (h.Type!='humanoid' && h.Type!='giant') return null;
	if (h.Subtypes.indexOf('shapeshifter')>-1) return null;
	sizes=['colossal+', 'colossal', 'gargantuan', 'huge', 'large', 'medium',
	       'small', 'tiny', 'diminutive', 'fine'];
	var hs=sizes.indexOf(h.Size);
	var as=sizes.indexOf(a.Size);
	if (hs==-1 || as==-1 || Math.abs(hs-as)>1) return null;
	var o = clone(h);
	if (as<hs) {
	    o.Size=a.Size;
	}
	append(o, 'Subtypes', 'shapechanger');
	boost(o, 'Hit Dice', a['Hit Dice']);
	boost(o, 'Hit Points', a['Hit Points']);
	var hna = h['Armor Class: natural'] || 0;
	var ana = a['Armor Class: natural'] || 0;
	o['Armor Class: natural'] = Math.max(h,a)+2;
	boost(o, 'Armor Class', o['Armor Class: natural']-hna);
	boost(o, 'Armor Class -- Flat-footed', o['Armor Class: natural']-hna);
	boost(o, 'Base Attack', a['Base Attack']);
	boost(o, 'Str', a.Str-10);
	boost(o, 'Dex', a.Dex-10);
	boost(o, 'Con', a.Con-10);
	boost(o, 'Wis', 2);
	boost(o, 'Fort', a.Fort);
	boost(o, 'Ref', a.Ref);
	boost(o, 'Will', a.Will+2);
	appendAll(o, 'Special Qualities', a['Special Qualities']);
	appendAll(o, 'Special Qualities', ['Alternate Form', 'Lycanthropic Empathy', 'Low-Light Vision', 'Scent']);
	appendAll(o, 'Special Attacks', a['Special Attacks']);
	append(o, 'Special Attacks', 'Curse of Lycanthropy');
	appendAll(o, 'Feats', a['Feats']);
	append(o, 'Feats', 'Iron Will');
	o['>base']=a;
	boostLA(o, 2);
	return o;
    };
}

var predators=['Badger', 'Bearblack', 'Bearbrown', 'Bearpolar', 'Cachalot Whale', 'Cat', 'Cheetah', 'Cliff Raptor', 'Constrictor Snake', 'Constrictor Snake, Giant', 'Crocodile', 'Crocodilegiant', 'Deinonychus', 'Dinosaur, Fastieth', 'Dire Rat', 'Direape', 'Direbadger', 'Direbat', 'Direbear', 'Direlion', 'Direshark', 'Diretiger', 'Direweasel', 'Direwolf', 'Direwolverine', 'Dog', 'Dogriding', 'Donkey', 'Eagle', 'Elasmosaurus', 'Hyena', 'Legendary Bear ', 'Legendary Tiger ', 'Leopard', 'Lion', 'Lizard', 'Lizardmonitor', 'Megaraptor', 'Octopus', 'Octopusgiant', 'Orca', 'Rat', 'Roc', 'Shark, Huge', 'Shark, Large', 'Shark, Medium', 'Snake, Huge Viper', 'Snake, Large Viper', 'Snake, Medium Viper', 'Snake, Small Viper', 'Snake, Tiny Viper', 'Squid', 'Squidgiant', 'Tiger', 'Tyrannosaurus', 'Weasel', 'Wolf', 'Wolverine'];

for (var i in predators) {
    templates[predators[i]]=lycanthrope(monsters[predators[i]]);
};
