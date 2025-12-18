var body = document.body;

//唱片元素
var recordImg = document.getElementById('record-img');

//右边的歌曲名
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-name')[0];

//音频时间
var audio = document.getElementById('audioTag');
var playedTime = document.getElementsByClassName('played-time')[0];
var totalTime = document.getElementsByClassName('audio-time')[0];
var progressPlay = document.getElementsByClassName('progress-play')[0];

//播放控制按钮
var playMode = document.getElementsByClassName('playMode')[0];
var beforeMusic = document.getElementsByClassName('beforeMusic')[0];
var playPause = document.getElementsByClassName('playPause')[0];
var nextMusic = document.getElementsByClassName('nextMusic')[0];

//音量
var volume = document.getElementsByClassName('volumn')[0];
var volumeTogger = document.getElementById('volumn-togger');

//获取MV按钮
var MV = document.getElementById('MV');

//获得倍速按钮
var speed = document.getElementById('speed');

//列表
var closeContainer = document.getElementsByClassName('close-container')[0];
var listContainer = document.getElementsByClassName('list-container')[0];
var listIcon = document.getElementById('list');
var musicLists = document.getElementsByClassName('musicLists')[0];

//歌曲名称数组
var musicDate = [
    ['落春赋', '高畅25216950607'],
    ['Yesterday', 'Alok/Sofi Tukker'],
    ['江南烟雨色', '杨树人'],
    ['Vision pt.II', 'Vicetone'],
];
var musicId = 0;

//初始化这些音乐
function initMusic() {
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    //当音乐的元数据完成加载时触发下面这个函数
    audio.onloadedmetadata = function () {
        recordImg.style.backgroundImage = `url('img/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('img/bg${musicId}.png')`;
        musicTitle.innerText = musicDate[musicId][0];
        authorName.innerText = musicDate[musicId][1];
        refreshRotate();
        totalTime.innerText = formaTime(audio.duration);
        audio.currentTime = 0;
    };
}
initMusic();

function initAndPlay(){
    initMusic();
    rotateRecord();
    audio.play();
    playPause.classList.remove('icon-play');
    playPause.classList.add('icon-pause');
}

//点击播放按钮事件
playPause.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        playPause.classList.remove('icon-play');
        playPause.classList.add('icon-pause');
    }
    else {
        audio.pause();
        rotateRecordStop();
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }
});

//让唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = 'running';
}

//停止唱片旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = 'paused';
}

//刷新旋转角度
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

nextMusic.addEventListener('click', function(){
    musicId++;
    if(musicId >= musicDate.length){
        musicId = 0;
    }
    initAndPlay();
});

beforeMusic.addEventListener('click', function(){
    musicId--;
    if(musicId < 0){
        musicId = musicDate.length - 1;
    }
    initAndPlay();
});

function formaTime(value){
    var hour = parseInt(value / 3600);
    var minutes = parseInt((value % 3600) / 60);
    var seconds = parseInt(value % 60);
    if(hour > 0){
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2,'0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

audio.addEventListener('timeupdate', updateProgress);

function updateProgress(){
    playedTime.innerText = formaTime(audio.currentTime);
    var value = audio.currentTime / audio.duration;
    progressPlay.style.width = value * 100 + '%';
}

//音乐模式
var modeId = 1;
playMode.addEventListener('click', function () {
    modeId++;
    if (modeId > 3) {
        modeId = 1;
    }
    playMode.style.backgroundImage = `url('img/mode${modeId}.png')`;
});

//当音乐播放完
audio.addEventListener('ended', function () {
    if (modeId == 2) {
        musicId = (musicId + 1) % musicDate.length;
    }
    else if (modeId == 3) {
        var oldId = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * musicDate.length);
            if (musicId != oldId) {
                break;
            }
        }
    }
    initAndPlay();
});

//记录上一次的音量
var lastVolume = 70;
audio.volume = lastVolume / 100;

//音量控制
volume.addEventListener('click', setVolume);
function setVolume(){
    if(audio.muted || audio.volume === 0){
        audio.muted = false;
        volumeTogger.value = lastVolume;
        audio.volume = lastVolume / 100;
    }
    else{
        audio.muted = true;
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
    }
    updateVolumnIcon();
}

volumeTogger.addEventListener('input', updateVolume);

//音量滑动块
function updateVolume(){
    const volumeValue = volumeTogger.value / 100;
    audio.volume = volumeValue;
    if(volumeValue > 0){
        audio.muted = false;
    }
    updateVolumnIcon();
}

//更新音量图标函数
function updateVolumnIcon(){
    if(audio.muted || audio.volume === 0){
        volume.style.backgroundImage = `url('img/静音.png')`;
    }
    else{
        volume.style.backgroundImage = `url('img/音量.png')`;       
    }
}

//MV
MV.addEventListener('click', function(){
    const videoPath = `./mp4/video${musicId}.mp4`;
    window.location.href = videoPath;


});

//倍速
speed.addEventListener('click', function(){
    var speedText = speed.innerText;
    if(speedText == '1.0X'){
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    }
    else if(speedText == '1.5X'){
        speed.innerText = '2.0X';
        audio.playbackRate = 2.0;
    }
    else if(speedText == '2.0X'){
        speed.innerText = '0.5X';
        audio.playbackRate = 0.5;
    }
    else if(speedText == '0.5X'){
        speed.innerText = '1.0X';
        audio.playbackRate = 1.0;
    }
});

//列表
listIcon.addEventListener('click', function(){
    listContainer.classList.remove('list-hide');
    listContainer.classList.add('list-show');
    listContainer.style.display = 'block';
    closeContainer.style.display = 'block';
});

closeContainer.addEventListener('click', function(){
    listContainer.classList.remove('list-show');
    listContainer.classList.add('list-hide');
    closeContainer.style.display = 'none';
});

function createMusic(){
    for(let i = 0; i < musicDate.length; i++){
        //生成一个div
        let div = document.createElement('div');
        div.innerText = `${musicDate[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click', function()
        {
            musicId = i;
            initAndPlay();
        });
    }
}
document.addEventListener('DOMContentLoaded', createMusic);