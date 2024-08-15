export function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp(`^(?:.*[&\\?]${encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&')}(?:\\=([^&]*))?)?.*$`, 'i'), '$1'))
}

export function isOnMobile () {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i)
   || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)
   || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
   || navigator.userAgent.match(/Windows Phone/i)) {
    return true
  }
  return false
}
