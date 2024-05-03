async function lookup(addr, tr, status) {
    let sp = addr.indexOf(' ');
    if (sp == -1) {
	status.text('Failed');
	$('<td colspan=5>').text(`Could not split ${addr} into number and street`).appendTo(tr);
	return;
    }
    let number = addr.substr(0,sp);
    let street = addr.substr(sp+1);
    $('<td>').text(number).appendTo(tr);
    $('<td>').text(street).appendTo(tr);
    let q = `1|${number}|${street}|1`;
    let url = 'https://a810-dobnow.nyc.gov/Publish/WrapperPP/PublicPortal.svc/getPublicPortalPropertyDetailsGet/' + escape(q);
    console.log(url);
    status.text('BINing');
    let info = await $.get(url);
    console.log(info);
    if (info.ErrorDescription) {
	$('<td colspan=3>').text(info.ErrorDescription).appendTo(tr);
	status.text('Failed');
	return;
    }
    let bin = info.PropertyDetails.BIN;
    let vfo = info.PropertyDetails.VlFinaOccpncy;
    $('<td>').text(bin).appendTo(tr);
    $('<td>').text(vfo).appendTo(tr);
    status.text('Elevating');
    let url2 = 'https://a810-dobnow.nyc.gov/Publish/WrapperPP/PublicPortal.svc/GetPublicPortalELV3Devices';
    let data = {SearchBy: 2, Bin: bin};
    let evi = await $.ajax({type:'POST', url:url2, data:JSON.stringify(data), dataType:'json',  contentType:"application/json; charset=utf-8"});
    console.log(evi);
    $('<td>').text(evi.devices.length).appendTo(tr);
    status.text('');
}

$(()=>{
$('#search').on('click', async ()=>{
    let txt = $('#ta').val();
    let lines = txt.split('\n');
    console.log({txt,lines});
    let promises = [];
    for (let line of lines) {
	let tr = $('<tr>').appendTo($('#results'));
	let status = $('<td>Starting</td>').appendTo(tr);
	promises.push(lookup(line, tr, status))
    }
    for (let p of promises) {
	await p;
    }
});
});
