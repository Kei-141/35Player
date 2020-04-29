// All rights reserved by author.

//�f�o�b�O�p
function test() {
    var str = document.getElementById("song1_url").textContent;
    alert(str);
}

//�e�[�}�ؑ�
function changeStyle(style) {
    var linkstyle = document.getElementById("darkmode");
    linkstyle.href = style;
}

//�R���e���c�ؑ�
function toggle_contents(dom_id) {
    var childsAll = document.getElementById("contents").children;
    for (i = 0; i < childsAll.length; i++) {
        if (childsAll[i].id == dom_id) {
            document.getElementById(childsAll[i].id).style.display = "block";
        } else if (childsAll[i].id == "viewer") {
            continue;
        } else {
            document.getElementById(childsAll[i].id).style.display = "none";
        }
    }
}

//�����o�[���X�g�\���ؑ�
function toggle_memberlist() {
    if (document.getElementById("member").style.display == "block") {
        document.getElementById("member").style.display = "none";
        document.getElementById("toggle_button").value = "Show Member List";
    } else {
        document.getElementById("member").style.display = "block";
        document.getElementById("toggle_button").value = "Hide Member List";
    }
}

//DB�ǂݍ��݁��\���֐��Ăяo��
function load_db(member_name) {
    var ele = document.getElementById("selected_member");
    ele.innerHTML = "";
    var url = "https://raw.githubusercontent.com/Kei-141/35player/master/db/" + member_name + ".json"
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            for (i = 0; i < json.length; i++) {
                var div_list = document.createElement("div");
                var div_id = "song_list_child_" + i;
                div_list.setAttribute("id", div_id);
                div_list.setAttribute("class", "song_list_child");
                document.getElementById("selected_member").appendChild(div_list);
                gen_songlist(json[i], div_id, member_name);
            }
        });
}

//�ȃ��X�g����
function gen_songlist(json, div_id, member_name) {
    var title = document.createElement("div");
    title.innerHTML = json[0];
    document.getElementById(div_id).appendChild(title);

    var thumbs = document.createElement("img");
    var thumbs_url = "https://i.ytimg.com/vi/" + json[1] + "/hq720.jpg";
    thumbs.setAttribute("src", thumbs_url);
    document.getElementById(div_id).appendChild(thumbs);

    var vid_id = "\'" + json[1] + "\'"

    for (j = 2; j < json.length; j++) {
        var list = document.createElement("div");

        var time_min = Math.floor((json[j].end - json[j].start) / 60);
        var time_sec = (json[j].end - json[j].start) % 60;
        if (time_sec < 10) {
            var time_sec_fix = "0" + time_sec;
        } else {
            time_sec_fix = time_sec;
        }

        var button_ref = ["\'" + replace_space(member_name) + "\'", "\'" + replace_space(json[j].song_name) + "\'", "\'" + replace_space(json[j].artist_name) + "\'", json[j].start, json[j].end, vid_id];
        list.innerHTML = "<button type='button' onclick=" + "javascript:add_playlist(" + button_ref +
            ");>Add</button>&nbsp;" + (j - 1) + " : " + json[j].song_name + "&nbsp;/&nbsp;" + json[j].artist_name + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix;
        document.getElementById(div_id).appendChild(list);
    }
}

//�v���C���X�g�o�^
function add_playlist(liver, name, artist, start, end, vid_id) {
    var list_elem = document.getElementById("playlist");
    var count = list_elem.childElementCount;

    var liver_thumbs_path = "img/" + liver + ".jpg";

    var time_min = Math.floor((end - start) / 60);
    var time_sec = (end - start) % 60;
    if (time_sec < 10) {
        var time_sec_fix = "0" + time_sec;
    } else {
        time_sec_fix = time_sec;
    }

    var song_id = "song" + (count + 1);
    var song_url = song_id + "_url";
    var song_start = song_id + "_start";
    var song_end = song_id + "_end";
    var song = document.createElement("div");
    song.setAttribute("id", song_id);
    song.innerHTML = "<img src='" + liver_thumbs_path + "' />&nbsp;" + "<span>" + (count + 1) + "&nbsp;:&nbsp;</span>" + name + "&nbsp;/&nbsp;" + artist + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix +
        "<var id='" + song_url + "'>" + vid_id + "</var>" + "<var id='" + song_start + "'>" + start + "</var>" + "<var id='" + song_end + "'>" + end + "</var>";
    document.getElementById("playlist").appendChild(song);
}

//�󔒕����u��
function replace_space(str) {
    return str.replace(/\s+/g, "&nbsp;");
}

//�Đ����̋ȏ��i�[
var now_playing = 0;
var playing_id;

//�v���C���X�g�Đ�
function play_list() {
    now_playing = (now_playing == 0) ? 1 : now_playing;
    playing_id = "song" + now_playing;
    var video_url = playing_id + "_url";
    var video_start = playing_id + "_start";
    var video_end = playing_id + "_end";

    var play_elem = document.getElementById(playing_id);
    play_elem.setAttribute("class", "playing");
    player.loadVideoById({
        'videoId': document.getElementById(video_url).textContent,
        'startSeconds': document.getElementById(video_start).textContent,
        'endSeconds': document.getElementById(video_end).textContent,
    })
}

//API���[�h���Ɏ������s
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '480',
        videoId: '0o3VrBLh8jI', //���̓���ID�͌����`�����l������K���ɐݒ�i���ݒ肾�Ɠ����Ȃ��j
        playerVars: { 'rel': 0 },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

//�Đ��I�������s�i���̋ȁj
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.seekTo(0); //�O�Ȃ̏I�����Ԃ����Ȃ̊J�n���Ԃ𒴂���ꍇ���I�����������s�������ɑΏ�
        var play_elem = document.getElementById(playing_id);
        play_elem.setAttribute("class", "");

        //���X�g�Ō������
        var elem_count = document.getElementById("playlist");
        if (elem_count.childElementCount <= now_playing) {
            player.stopVideo();
            now_playing = 0;
        } else {
            now_playing += 1;
            play_list();
        }
    }
}