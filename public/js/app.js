// @var
let videFilterOptions = {
  include: 0,
  privacyOneOf: 1,
  count: 15,
  sort: '-createdAt'
}

// @init
$(function() {
  videoFilter()
})

// @func
function videoFilter() {
  const list = $('#video-list')
  const filter = {
    include: $('#vf-include'),
    privacyOneOf: $('#vf-privacyOneOf'),
    count: $('#vf-count'),
    sort: $('#vf-sort'),
    reload: $('#vf-reload')
  }

  if (!list.length) return
  if (!filter.include.length) return
  if (!filter.privacyOneOf.length) return
  if (!filter.count.length) return
  if (!filter.sort.length) return
  if (!filter.reload.length) return

  videFilterOptions = {
    include: filter.include.val(),
    privacyOneOf: filter.privacyOneOf.val(),
    count: filter.count.val(),
    sort: filter.sort.val()
  }

  filter.include.on('change', function() {
    videFilterOptions.include = $(this).val()
    loadFilterVideos(list, videFilterOptions)
  })
  filter.privacyOneOf.on('change', function() {
    videFilterOptions.privacyOneOf = $(this).val()
    loadFilterVideos(list, videFilterOptions)
  })
  filter.count.on('change', function() {
    videFilterOptions.count = $(this).val()
    loadFilterVideos(list, videFilterOptions)
  })
  filter.sort.on('change', function() {
    videFilterOptions.sort = $(this).val()
    loadFilterVideos(list, videFilterOptions)
  })
  filter.reload.on('click', function() {
    filter.include.find('option[value="0"]').prop("selected", true)
    filter.privacyOneOf.find('option[value="1"]').prop("selected", true)
    filter.count.find('option[value="15"]').prop("selected", true)
    filter.sort.find('option[value="-createdAt"]').prop("selected", true)
    
    loadFilterVideos(list, {
      include: 0,
      privacyOneOf: 1,
      count: 15,
      sort: '-createdAt'
    })
  })

  loadFilterVideos(list, videFilterOptions)
}
function loadFilterVideos(list, data) {
  $.ajax({
    url: '/filter',
    type: 'POST',
    data,
    dataType: 'HTML',
    async: true,
    success: function(html) {
      list.html(html)
      list.imagesLoaded(function() {
        list.masonry().masonry('destroy')
        list.masonry({"percentPosition": true })
      })
    },
    error: function(e) {
      console.error(e)
    },
  });
}
function videoJSPlayer(source) {
  document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('jsplayer')

    if (!Hls.isSupported()) return

    const defaultOptions = {
      ratio: '16:9',
      autoplay: true,
    }
    const hls = new Hls()

    hls.loadSource(source)
    hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
      const availableQualities = hls.levels.map((l) => l.height)
      defaultOptions.controls = [
        'play-large', // The large play button in the center
        'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'settings', // Settings menu
        'pip', // Picture-in-picture (currently Safari only)
        'airplay', // Airplay (currently Safari only)
        'fullscreen', // Toggle fullscreen
      ]
      defaultOptions.quality = {
        default: availableQualities[availableQualities.length - 1],
        options: availableQualities,
        forced: true,
        onChange: (e) => updateVideoJSPlayerQuality(e)
      }
      new Plyr(video, defaultOptions)
    })
    hls.attachMedia(video)
    window.hls = hls
  })
}
function updateVideoJSPlayerQuality(quality) {
 window.hls.levels.forEach((level, levelIndex) => {
  if (level.height === quality) {
    window.hls.currentLevel = levelIndex
  }
 })
}
function videoWebTorrentPlayer() {
  const client = new WebTorrent()
}