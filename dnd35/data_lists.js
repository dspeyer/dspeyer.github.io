epic = [ "abomination", "behemoth", "brachyurus", "colossus", "demilich", "devastationvermin", "dragonadvanced", "dragonepic", "elementalprimal", "geniusloci", "gibberingorb", "gloom", "golem", "hanaga", "hagunemnon", "hoaryhunter", "hunefer", "lavawight", "legendaryanimal", "leshay", "livingvault", "mercane", "muspore", "nehthalggu", "paragoncreature", "prismasaurus", "pseudonaturalcreature", "ruinswarm", "shadowofthevoid", "shapeoffire", "sirrush", "sirrush", "tayellah", "thorciasid", "titanelder", "treantelder", "umbralblot", "uvuudaum", "vermiurge", "winterwight", "wormthatwalks" ];
psionic = [ "abolethpsionic", "astralconstruct", "blue", "brainmole", "callerindarkness", "cerebrilith", "couatlpsionic", "crysmal", "dromite", "duergarpsionic", "elan", "folugub", "grayglutton", "halfgiant", "intellectdevourer", "maenad", "neothelid", "phreniccreature", "phthisic", "psicrystal", "psionkiller", "puppeteer", "temporalfilcher", "thoughteater", "thoughtslayer", "udoroot", "unbodied", "xeph" ];

for(i in monsters){
    if (epic.indexOf(monsters[i]['>file'].toLowerCase()) > -1) {
	monsters[i].Source = 'epic level handbook';
    }
    if (psionic.indexOf(monsters[i]['>file'].toLowerCase()) > -1) {
	monsters[i].Source = 'expanded psionics handbook';
    }
}
