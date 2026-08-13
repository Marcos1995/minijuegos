var Swipe = (function () {
  function pos(el, e) {
    var r = el.getBoundingClientRect();
    var w = r.width || 1, h = r.height || 1;
    return { x: (e.clientX - r.left) / w, y: (e.clientY - r.top) / h };
  }

  function on(el, fn) {
    var x0 = 0, y0 = 0, tracking = false;
    el.addEventListener("pointerdown", function (e) {
      tracking = true;
      x0 = e.clientX;
      y0 = e.clientY;
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    el.addEventListener("pointerup", function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      var ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax < 28 && ay < 28) fn({ type: "tap", dir: null, dist: 0 });
      else fn({ type: "swipe", dir: ax > ay ? (dx > 0 ? "R" : "L") : (dy > 0 ? "D" : "U"), dist: Math.max(ax, ay) });
    });
    el.addEventListener("pointercancel", function () { tracking = false; });
    el.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
  }

  function drag(el, fn) {
    var down = false;
    function send(e) { fn(pos(el, e)); }
    el.addEventListener("pointerdown", function (e) {
      down = true;
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      send(e);
    });
    el.addEventListener("pointermove", function (e) { if (down) send(e); });
    el.addEventListener("pointerup", function () { down = false; });
    el.addEventListener("pointercancel", function () { down = false; });
    el.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
  }

  return { on: on, drag: drag };
})();
if (typeof module !== "undefined") module.exports = Swipe;
