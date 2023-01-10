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

  let data = {
    include: filter.include.val(),
    privacyOneOf: filter.privacyOneOf.val(),
    count: filter.count.val(),
    sort: filter.sort.val()
  }

  filter.include.on('change', function() {
    data.include = $(this).val()
    loadVideos(list, data)
  })
  filter.privacyOneOf.on('change', function() {
    data.privacyOneOf = $(this).val()
    loadVideos(list, data)
  })
  filter.count.on('change', function() {
    data.count = $(this).val()
    loadVideos(list, data)
  })
  filter.sort.on('change', function() {
    data.sort = $(this).val()
    loadVideos(list, data)
  })
  filter.reload.on('click', function() {
    filter.include.find('option[value="0"]').prop("selected", true)
    filter.privacyOneOf.find('option[value="1"]').prop("selected", true)
    filter.count.find('option[value="15"]').prop("selected", true)
    filter.sort.find('option[value="-createdAt"]').prop("selected", true)
    
    loadVideos(list, {
      include: 0,
      privacyOneOf: 1,
      count: 15,
      sort: '-createdAt'
    })
  })

  loadVideos(list, data)
}
function loadVideos(list, data) {
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