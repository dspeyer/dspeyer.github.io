for (let i=1; i<=6; i++) {
    let tag = 'h'+i;
    for (let el of document.getElementsByTagName(tag)) {
        if ( ! el.id ) continue;
        let a = document.createElement('a');
        a.href = '#'+el.id;
        a.innerText = '↙';
        a.className = 'selflink';
        el.appendChild(a);
    }
}
