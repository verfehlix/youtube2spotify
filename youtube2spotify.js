var start = 1,
    index = 0,
    matches = [],
    success = document.getElementById('success'),
    success2 = document.getElementById('success2'),
    failed = document.getElementById('failed');

function load(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                callback([{}]);
            }
        }
    };
    xhr.send();
}

function loadPage(id) {
    if (!id) {
        id = document.getElementById('input').value;
    }
    load('https://gdata.youtube.com/feeds/api/playlists/' + id + '?alt=jsonc&v=2&start-index=' + start + '&max-results=50', function (e) {
        console.log('loadPage', e);
        if (e.data) {
            searchSpotify(e.data.items);
        }
    });
}

function clearLists(){
    success.innerHTML += '';
    success2.innerHTML += '';
    failed.innerHTML += '';
}

function searchSpotify(items) {
    var name = items[index].video.title || [];
    name = name.match(/[\w']+/g)
        .join(' ')
        .replace(/official/ig, '')
        .replace(/featuring/ig, '')
        .replace(/feat/ig, '')
        .replace(/video/ig, '')
        .replace(/1080p/ig, '')
        .replace(/music/ig, '');

    load('http://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(name), function (e) {
        if (e.tracks && e.tracks[0]) {
            console.log('success', name, e);
            // success
            matches.push(e.tracks[0]);
            var checkbox = $('#checkbox:checked').val();
            if(checkbox){
                success.innerHTML +='<div class="row"><div class="col-md-12"><h3><a href="' + e.tracks[0].href + '">'+name+'</a></h3></div><div class="col-md-12"><iframe src="https://embed.spotify.com/?uri='+ e.tracks[0].href +'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe></div><div class="col-md-12"><p class="goodText">'+e.tracks[0].href+'</p></div></div>';
            }
            else{
                success.innerHTML +='<div class="row"><div class="col-md-12"><h3><a href="' + e.tracks[0].href + '">'+name+'</a></h3></div></div><div class="col-md-12"><p class="goodText">'+e.tracks[0].href+'</p></div></div>';                
            }
            success2.innerHTML += '<text class="goodText">' + e.tracks[0].href + '</text><br/>';
        } else {
            console.log('failt', name, e);
            // fail
            failed.innerHTML += '<li class="badText">' + name + '</li>';
        }

        if (index < items.length - 1) {
            index += 1;
            searchSpotify(items);
        } else {
            console.log(matches);
            start += 50;
            index = 0;
            loadPage();
        }
    });
}

document.getElementById('submit').addEventListener('click', function () {
    clearLists();
    index = 0;
    matches = [];
    loadPage();
});