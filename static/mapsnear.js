(function () {
  // searching on the maps page asks the browser where you are (once the browser has your OK) and sends a rough
  // position, about a kilometre, with that one search, so the closest match comes first. Nothing is kept.
  var form = document.querySelector(".mapsearch");
  var field = form && form.querySelector("input[name=near]");
  if (!form || !field || !navigator.geolocation) return;
  var off = false;
  try { off = localStorage.getItem("nook-near") === "off"; } catch (e) {}
  form.addEventListener("submit", function (e) {
    var q = form.querySelector("input[name=q]").value.trim();
    if (!q || off || field.value) return;
    e.preventDefault();
    var sent = false;
    var go = function () { if (!sent) { sent = true; form.submit(); } };
    var timer = setTimeout(go, 6000);               // never leave the person waiting on a location prompt
    navigator.geolocation.getCurrentPosition(function (pos) {
      clearTimeout(timer);
      field.value = pos.coords.latitude.toFixed(2) + "," + pos.coords.longitude.toFixed(2);
      go();
    }, function (err) {
      clearTimeout(timer);
      if (err && err.code === 1) { try { localStorage.setItem("nook-near", "off"); } catch (x) {} }   // said no: do not ask again
      field.removeAttribute("name");
      go();
    }, { maximumAge: 600000, timeout: 5000 });
  });
})();
