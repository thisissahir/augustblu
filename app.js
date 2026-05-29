// AUGUST BLU — dependency-free port of the Claude Design prototype.
// Mirrors the original React/Babel kit 1:1 (same structure, same inline styles),
// with a tiny hyperscript helper + a single re-render loop in place of React.

(function () {
  "use strict";

  // --- hyperscript -------------------------------------------------------
  // h(tag, props, ...children) -> DOM node. Mirrors React.createElement so the
  // ported components below read like the originals.
  var UNITLESS = {
    opacity: 1, zIndex: 1, fontWeight: 1, lineHeight: 1, flex: 1,
    flexGrow: 1, flexShrink: 1, order: 1, gridRow: 1, gridColumn: 1,
    zoom: 1, columnCount: 1
  };

  function applyStyle(el, style) {
    for (var k in style) {
      if (!Object.prototype.hasOwnProperty.call(style, k)) continue;
      var v = style[k];
      if (typeof v === "number" && !UNITLESS[k] && v !== 0) v = v + "px";
      el.style[k] = v;
    }
  }

  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) {
      child.forEach(function (c) { append(el, c); });
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(String(child)));
    }
  }

  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    for (var key in props) {
      if (!Object.prototype.hasOwnProperty.call(props, key)) continue;
      var val = props[key];
      if (key === "style") applyStyle(el, val);
      else if (key === "className") el.className = val;
      else if (key === "html") el.innerHTML = val;
      else if (key === "onClick") el.addEventListener("click", val);
      else if (key === "onSubmit") el.addEventListener("submit", val);
      else if (key === "onInput") el.addEventListener("input", val);
      else if (key === "value") el.value = val;
      else if (key === "checked" || key === "disabled" || key === "required") { if (val) el.setAttribute(key, ""); }
      else if (val != null) el.setAttribute(key, val);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function svgFromString(str) {
    var wrap = document.createElement("div");
    wrap.innerHTML = str.trim();
    return wrap.firstChild;
  }

  // =======================================================================
  //  SHARED PRIMITIVES  (was components.jsx)
  // =======================================================================

  function CoverArt(opts) {
    opts = opts || {};
    var bg = opts.bg || "var(--screen-blue)";
    var fg = opts.fg || "var(--paper)";
    var code = opts.code;
    var size = opts.size || "lg";
    var fs = size === "lg" ? "clamp(48px, 8vw, 140px)" :
             size === "md" ? "clamp(28px, 4.5vw, 64px)" :
                             "clamp(16px, 3vw, 28px)";
    var uIsBlue = bg !== "var(--screen-blue)";
    var uColor = uIsBlue ? "var(--screen-blue)" : "var(--late-night)";

    var u = function () { return h("span", { style: { color: uColor } }, "U"); };

    return h("div", {
      style: { position: "absolute", inset: 0, background: bg, color: fg, display: "grid", placeItems: "center", overflow: "hidden" }
    },
      code && h("div", {
        style: { position: "absolute", top: 12, left: 14, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.75 }
      }, code),
      h("div", {
        style: {
          fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "-0.035em", lineHeight: 0.88, fontSize: fs, textAlign: "center"
        }
      }, "A", u(), "G", u(), "ST", h("br"), "BL", u())
    );
  }

  function Wordmark(opts) {
    opts = opts || {};
    var size = opts.size || 28;
    var color = opts.color || "var(--ink)";
    var uColor = opts.uColor || "var(--screen-blue)";
    var u = function () { return h("span", { style: { color: uColor } }, "U"); };
    return h("span", {
      style: {
        fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "-0.03em", fontSize: size, lineHeight: 0.95, color: color
      }
    }, "A", u(), "G", u(), "ST BL", u());
  }

  function Stamp(children, opts) {
    opts = opts || {};
    var style = Object.assign({
      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em",
      textTransform: "uppercase", color: opts.color || "inherit"
    }, opts.style || {});
    return h("span", { className: "mono-label", style: style }, children);
  }

  function Tag(children, variant) {
    variant = variant || "outline";
    var base = {
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      borderRadius: 999, border: "1px solid currentColor", fontFamily: "var(--font-mono)",
      fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1
    };
    var variants = {
      outline: {},
      solid: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
      signal: { background: "var(--signal)", color: "var(--ink)", borderColor: "var(--signal)" },
      disco: { background: "var(--disco)", color: "var(--paper)", borderColor: "var(--disco)" }
    };
    return h("span", { style: Object.assign({}, base, variants[variant]) }, children);
  }

  function Button(opts, children) {
    opts = opts || {};
    var variant = opts.variant || "primary";
    var base = {
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase",
      letterSpacing: "0.04em", fontSize: 13, padding: "14px 22px",
      border: "1px solid currentColor", background: "transparent",
      color: opts.onNight ? "var(--paper)" : "var(--ink)", cursor: "pointer",
      transition: "background 240ms cubic-bezier(0.2,0.7,0.1,1), color 240ms cubic-bezier(0.2,0.7,0.1,1)",
      borderRadius: 0
    };
    var variants = {
      primary: { background: "var(--screen-blue)", color: "var(--paper)", borderColor: "var(--screen-blue)" },
      ghost: {}
    };
    var props = { style: Object.assign({}, base, variants[variant], opts.style || {}) };
    if (opts.onClick) props.onClick = opts.onClick;
    return h("button", props, children);
  }

  function Field(opts) {
    opts = opts || {};
    var cta = opts.cta || "Subscribe →";
    var input = h("input", {
      placeholder: opts.placeholder || "",
      style: {
        flex: 1, border: 0, outline: 0, background: "transparent", padding: "0 18px",
        fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink)"
      }
    });
    return h("form", {
      onSubmit: function (e) { e.preventDefault(); if (opts.onSubmit) opts.onSubmit(input.value); },
      style: { display: "flex", border: "1px solid var(--ink)", height: 56, maxWidth: 540 }
    },
      input,
      Button({ variant: "primary", style: { borderLeft: "1px solid var(--ink)", border: 0 } }, cta)
    );
  }

  // --- Icons (lucide-style subset) --------------------------------------
  function Icon(name, size, stroke) {
    size = size || 18; stroke = stroke || 1.5;
    var open = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + stroke +
      '" stroke-linecap="round" stroke-linejoin="round">';
    var body = {
      "play": '<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>',
      "pause": '<rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/>',
      "arrow": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 5 20 12 13 19"/>',
      "ext": '<polyline points="7 17 17 7"/><polyline points="9 7 17 7 17 15"/>',
      "menu": '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
      "close": '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
      "heart": '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78z"/>',
      "share": '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
      "skip-next": '<polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"/><line x1="19" y1="4" x2="19" y2="20"/>',
      "skip-prev": '<polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none"/><line x1="5" y1="4" x2="5" y2="20"/>'
    };
    if (!body[name]) return document.createComment("icon:" + name);
    return svgFromString(open + body[name] + "</svg>");
  }

  // --- Marquee -----------------------------------------------------------
  function Marquee(items, color, on) {
    color = color || "var(--screen-blue)"; on = on || "var(--paper)";
    var dup = items.concat(items, items);
    return h("div", {
      style: { background: color, color: on, overflow: "hidden", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)" }
    },
      h("div", {
        style: {
          display: "flex", gap: 36, whiteSpace: "nowrap", padding: "12px 0",
          animation: "ab-marquee 40s linear infinite", fontFamily: "var(--font-mono)",
          fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase"
        }
      },
        dup.map(function (t) {
          return h("span", { style: { display: "inline-flex", alignItems: "center", gap: 36 } },
            t, h("span", { style: { opacity: 0.55 } }, "·"));
        })
      )
    );
  }

  // --- Layout shell ------------------------------------------------------
  function Header() {
    var items = ["music", "shows", "notes", "subscribe"];
    return h("header", {
      style: {
        position: "sticky", top: 0, zIndex: 5, display: "grid",
        gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "18px 32px",
        background: "var(--paper)", borderBottom: "1px solid var(--rule)"
      }
    },
      Stamp("AB · 002 · TRANSMISSION"),
      h("a", { onClick: function () { go("landing"); }, style: { cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12 } },
        Wordmark({ size: 20 })),
      h("nav", {
        style: { display: "flex", gap: 18, justifyContent: "flex-end", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }
      },
        items.map(function (i) {
          return h("a", {
            onClick: function () { go(i); },
            style: {
              cursor: "pointer", paddingBottom: 2,
              borderBottom: "1px solid " + (state.page === i ? "var(--screen-blue)" : "transparent"),
              color: state.page === i ? "var(--screen-blue)" : "var(--ink)"
            }
          }, i);
        })
      )
    );
  }

  function Footer() {
    var listStyle = { listStyle: "none", padding: 0, margin: "10px 0 0", display: "grid", gap: 6, fontFamily: "var(--font-display)" };
    return h("footer", { style: { padding: "48px 32px 120px", background: "var(--late-night)", color: "var(--paper)" } },
      h("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32, alignItems: "start" } },
        h("div", null,
          Wordmark({ size: 48, color: "var(--paper)" }),
          h("p", { style: { maxWidth: 420, marginTop: 16, fontSize: 14, color: "rgba(234, 238, 255,.7)" } },
            "For the collective. From the most personal place. Music for the moment you realize you're not the only one feeling this.")
        ),
        h("div", null,
          Stamp("Listen", { style: { opacity: 0.6 } }),
          h("ul", { style: listStyle },
            h("li", null, "Spotify ↗"), h("li", null, "Apple Music ↗"),
            h("li", null, "Bandcamp ↗"), h("li", null, "YouTube ↗"))
        ),
        h("div", null,
          Stamp("Talk", { style: { opacity: 0.6 } }),
          h("ul", { style: listStyle },
            h("li", null, "Instagram ↗"), h("li", null, "TikTok ↗"),
            h("li", null, "letter@augustblu.com"))
        )
      ),
      h("div", {
        style: { display: "flex", justifyContent: "space-between", marginTop: 64, paddingTop: 16, borderTop: "1px solid rgba(234, 238, 255,.18)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.55 }
      },
        h("span", null, "© AUGUST BLU · MMXXVI"),
        h("span", null, "Built between the headlines.")
      )
    );
  }

  function MiniPlayer() {
    var track = state.nowPlaying;
    return h("div", {
      style: {
        position: "fixed", left: 16, right: 16, bottom: 16,
        background: "rgba(19, 26, 46, 0.78)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(234, 238, 255,.18)", padding: "12px 16px", display: "grid",
        gridTemplateColumns: "44px 1fr auto auto auto", alignItems: "center", gap: 16,
        color: "var(--paper)", zIndex: 10
      }
    },
      h("div", { style: { position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(234, 238, 255,.12)" } },
        h("div", { style: { width: "38%", height: "100%", background: "var(--screen-blue)" } })),
      h("div", { style: { width: 44, height: 44, background: "var(--screen-blue)", color: "var(--paper)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.06em" } }, "AB"),
      h("div", null,
        h("div", { style: { fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "-0.01em" } }, track.title),
        Stamp("August Blu · " + track.kind, { style: { opacity: 0.65 } })),
      Stamp("01:34 / " + track.runtime, { style: { opacity: 0.7 } }),
      h("div", { style: { display: "flex", gap: 6 } },
        h("button", {
          onClick: function () { state.playing = !state.playing; render(); },
          style: { width: 40, height: 40, borderRadius: 999, background: "var(--screen-blue)", color: "var(--paper)", border: 0, display: "grid", placeItems: "center", cursor: "pointer" }
        }, Icon(state.playing ? "pause" : "play", 14)),
        h("button", {
          style: { width: 40, height: 40, borderRadius: 999, background: "transparent", color: "var(--paper)", border: "1px solid rgba(234, 238, 255,.4)", display: "grid", placeItems: "center", cursor: "pointer" }
        }, Icon("skip-next", 14))
      ),
      h("button", { style: { background: "transparent", border: 0, color: "rgba(234, 238, 255,.7)", cursor: "pointer", display: "grid", placeItems: "center" } }, Icon("heart", 16))
    );
  }

  // =======================================================================
  //  PAGES
  // =======================================================================

  function Landing() {
    return h("main", null,
      // HERO
      h("section", {
        style: { background: "var(--bay)", color: "var(--static)", padding: "96px 32px 64px", position: "relative", minHeight: "78vh", display: "grid", gridTemplateRows: "auto 1fr auto", gap: 48, overflow: "hidden" }
      },
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          Stamp("↳ NEW TRANSMISSION · 08.21.26 · 03:14 EST", { style: { opacity: 0.75 } }),
          Stamp("LISTENING AT VOLUME, ALONE OR TOGETHER", { style: { opacity: 0.75 } })),
        h("div", null,
          h("h1", {
            style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.035em", margin: 0, textWrap: "balance", maxWidth: "14ch" }
          }, "Not the only", h("br"), "one feeling", h("br"), "this."),
          h("p", {
            style: { marginTop: 32, maxWidth: 520, fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 18, lineHeight: 1.5, color: "rgba(234, 238, 255,.75)" }
          },
            "Anti-Pop, between the headlines. Built from real instruments, digital architecture, and a voice that runs ",
            h("em", { style: { fontStyle: "normal", color: "var(--screen-blue)", fontWeight: 600 } }, "just through"),
            " the machine — not to hide, but to carry more.")
        ),
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" } },
          h("div", { style: { display: "flex", gap: 10 } },
            Button({ variant: "primary", onClick: function () { state.nowPlaying = { title: "Phonelight", kind: "single", runtime: "04:12" }; state.playing = true; go("music"); } }, "▶ Listen to Phonelight"),
            Button({ variant: "ghost", onNight: true, onClick: function () { go("shows"); } }, "See shows")),
          h("div", {
            style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "right", color: "rgba(234, 238, 255,.7)", lineHeight: 1.5 }
          }, "ab · 002", h("br"), "transmission", h("br"), "08.21.26")
        )
      ),
      // MARQUEE
      Marquee([
        "ANTI-POP", "FOR THE COLLECTIVE", "FROM THE MOST PERSONAL PLACE",
        "R&B · ELECTRONICA · HOUSE · GARAGE · IDM · HIP HOP · DISCO",
        "THE FREQUENCY EVERYONE IS ON BUT NOBODY NAMED YET"
      ], "var(--void)", "var(--static)"),
      // LATEST RELEASE STRIP
      h("section", { style: { padding: "80px 32px", background: "var(--paper)", color: "var(--ink)" } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" } },
          h("div", { style: { aspectRatio: "1 / 1", position: "relative" } },
            CoverArt({ bg: "var(--screen-blue)", fg: "var(--paper)", code: "AB · 002 · SINGLE", size: "lg" }),
            h("div", { style: { position: "absolute", bottom: 16, right: 18, color: "rgba(234, 238, 255,.75)" } }, Stamp("08.21.26"))),
          h("div", null,
            Stamp("OUT NOW", { style: { color: "var(--screen-blue)" } }),
            h("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.03em", margin: "12px 0 18px" } }, "Phonelight"),
            h("p", { style: { maxWidth: 460, fontSize: 16, lineHeight: 1.55 } },
              "A song about a saturday that ended on a tuesday. Written at 3am, mixed for 3pm. The first transmission from the upcoming ",
              h("em", { style: { fontStyle: "normal", fontWeight: 600 } }, "Rooms EP"), "."),
            h("div", { style: { display: "flex", gap: 10, marginTop: 24 } },
              Button({ variant: "primary", onClick: function () { state.nowPlaying = { title: "Phonelight", kind: "single", runtime: "04:12" }; render(); } }, "▶ Play"),
              Button({ variant: "ghost" }, "Pre-save Rooms EP")),
            h("div", { style: { display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" } },
              Tag("R&B"), Tag("House"), Tag("Garage"), Tag("2026", "solid"))
          )
        )
      ),
      // PRESS-QUOTE-AS-SELF
      h("section", { style: { padding: "120px 32px", background: "var(--paper)", borderTop: "1px solid var(--rule)" } },
        Stamp("BIO · ABBREVIATED", { style: { opacity: 0.55 } }),
        h("p", {
          style: { marginTop: 18, fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(28px, 4.4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "22ch", textWrap: "balance" }
        },
          "August Blu is not a genre — it's a ",
          h("span", { style: { color: "var(--screen-blue)" } }, "transmission."),
          " Two truths held at the same time: the euphoria of a room, the solitude of 3am."),
        h("a", {
          onClick: function () { go("notes"); }, className: "link",
          style: { marginTop: 32, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", color: "var(--screen-blue)" }
        }, "Read notes from the artist ", Icon("arrow", 14))
      )
    );
  }

  var TRACKS = [
    { n: "01", title: "Rooms", feat: "feat. nobody", runtime: "03:47" },
    { n: "02", title: "Phonelight", feat: "single · 2026", runtime: "04:12" },
    { n: "03", title: "3am, alune", feat: "demo", runtime: "05:08" },
    { n: "04", title: "Carry More", feat: "with the machine", runtime: "03:24" },
    { n: "05", title: "Saturday → Tuesday", feat: "interlude", runtime: "01:55" },
    { n: "06", title: "The Frequency", feat: "title track", runtime: "06:01" }
  ];

  var RELEASES = [
    { code: "AB · 001", title: "First Light", date: "03.14.26", kind: "single", tone: "blue" },
    { code: "AB · 002", title: "Phonelight", date: "08.21.26", kind: "single", tone: "night", current: true },
    { code: "AB · 003", title: "Rooms EP", date: "11.07.26", kind: "EP", tone: "blue", upcoming: true }
  ];

  function Music() {
    var active = state.musicActive;
    return h("main", { style: { padding: "64px 32px 200px", background: "var(--paper)", color: "var(--ink)" } },
      Stamp("↳ DISCOGRAPHY", { style: { opacity: 0.55 } }),
      h("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.95, letterSpacing: "-0.03em", margin: "10px 0 56px" } }, "Music"),
      // RELEASE TILES
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 80 } },
        RELEASES.map(function (r, i) {
          return h("button", {
            onClick: function () { state.musicActive = i; render(); },
            style: {
              textAlign: "left", border: "1px solid " + (active === i ? "var(--screen-blue)" : "var(--rule)"),
              background: "var(--paper)", padding: 14, display: "grid", gridTemplateRows: "1fr auto",
              gap: 14, aspectRatio: "4/5", cursor: "pointer", borderRadius: 0
            }
          },
            h("div", { style: { position: "relative" } },
              CoverArt({ bg: r.tone === "night" ? "var(--late-night)" : "var(--screen-blue)", fg: "var(--paper)", code: r.code, size: "md" }),
              r.current && h("div", { style: { position: "absolute", bottom: 10, right: 12 } }, Tag("Now", "signal")),
              r.upcoming && h("div", { style: { position: "absolute", bottom: 10, right: 12 } }, Tag("Pre-save", "solid"))),
            h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "end" } },
              h("div", null,
                h("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: 20, letterSpacing: "-0.015em" } }, r.title),
                Stamp(r.kind + " · " + r.date, { style: { opacity: 0.6 } })))
          );
        })
      ),
      // TRACK LIST
      h("div", { style: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48 } },
        h("div", null,
          Stamp(RELEASES[active].code, { style: { color: "var(--screen-blue)" } }),
          h("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.03em", margin: "10px 0 16px" } }, RELEASES[active].title),
          Stamp(RELEASES[active].kind + " · " + RELEASES[active].date, { style: { opacity: 0.6 } }),
          h("div", { style: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" } }, Tag("R&B"), Tag("House"), Tag("IDM"))),
        h("div", { style: { borderTop: "1px solid var(--rule)" } },
          TRACKS.map(function (t) {
            var isNow = state.nowPlaying && state.nowPlaying.title && state.nowPlaying.title.toLowerCase() === t.title.toLowerCase();
            return h("div", {
              style: { display: "grid", gridTemplateColumns: "32px 36px 1fr 90px 70px", alignItems: "center", gap: 14, padding: "16px 4px", borderBottom: "1px solid var(--rule)", color: isNow ? "var(--screen-blue)" : "var(--ink)" }
            },
              Stamp(t.n, { style: { opacity: 0.5 } }),
              h("button", {
                onClick: function () { state.nowPlaying = { title: t.title, kind: t.feat, runtime: t.runtime }; state.playing = true; render(); },
                style: { width: 28, height: 28, borderRadius: 999, background: isNow ? "var(--screen-blue)" : "var(--ink)", color: "var(--paper)", border: 0, cursor: "pointer", display: "grid", placeItems: "center" }
              }, Icon(isNow && state.playing ? "pause" : "play", 11)),
              h("div", null,
                h("div", { style: { fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", fontSize: 18, letterSpacing: "-0.005em" } }, t.title),
                Stamp(t.feat, { style: { opacity: 0.55 } })),
              Stamp(t.runtime, { style: { textAlign: "right", opacity: 0.7 } }),
              Stamp("▶ playing", { style: { textAlign: "right", color: "var(--screen-blue)", opacity: isNow ? 1 : 0 } })
            );
          })
        )
      )
    );
  }

  var SHOWS = [
    { date: "10.04.26", dow: "Sat", city: "Brooklyn", venue: "Public Records", state: "tickets" },
    { date: "10.11.26", dow: "Sat", city: "Boston", venue: "Royale (small rm)", state: "tickets" },
    { date: "10.18.26", dow: "Sat", city: "Toronto", venue: "Drake Underground", state: "sold-out" },
    { date: "10.25.26", dow: "Sat", city: "Montréal", venue: "Bar Le Ritz PDB", state: "tickets" },
    { date: "11.01.26", dow: "Sat", city: "Chicago", venue: "Sleeping Village", state: "few-left" },
    { date: "11.08.26", dow: "Sat", city: "Detroit", venue: "Spot Lite", state: "tickets" },
    { date: "11.15.26", dow: "Sat", city: "London", venue: "The Cause", state: "sold-out" },
    { date: "11.22.26", dow: "Sat", city: "Berlin", venue: "Säule (Berghain)", state: "waitlist" }
  ];

  function showCfg(s) {
    var map = {
      "tickets": { label: "Tickets →", variant: "primary", tag: null },
      "few-left": { label: "Few left →", variant: "primary", tag: function () { return Tag("Almost gone", "signal"); } },
      "sold-out": { label: "Sold out", variant: "ghost", tag: function () { return Tag("Sold out", "solid"); }, disabled: true },
      "waitlist": { label: "Waitlist →", variant: "ghost", tag: function () { return Tag("Waitlist", "disco"); } }
    };
    return map[s];
  }

  function Shows() {
    return h("main", { style: { padding: "64px 32px 200px", background: "var(--paper)", color: "var(--ink)" } },
      Stamp("↳ TOUR · ROOMS", { style: { opacity: 0.55 } }),
      h("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.95, letterSpacing: "-0.03em", margin: "10px 0 12px" } }, "Shows"),
      h("p", { style: { maxWidth: 560, fontSize: 17, lineHeight: 1.55, marginBottom: 56 } },
        "Small rooms. On purpose. The whole show is built for the second row. If you can't get a ticket, find a friend who can."),
      h("div", { style: { borderTop: "1px solid var(--ink)" } },
        SHOWS.map(function (s) {
          var cfg = showCfg(s.state);
          var isSoldOut = s.state === "sold-out";
          return h("div", {
            style: { display: "grid", gridTemplateColumns: "120px 80px 1.4fr 1fr auto", alignItems: "center", gap: 24, padding: "20px 0", borderBottom: "1px solid var(--rule)", opacity: isSoldOut ? 0.6 : 1 }
          },
            Stamp(s.date, { style: { color: "var(--screen-blue)" } }),
            Stamp(s.dow, { style: { opacity: 0.6 } }),
            h("div", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1 } }, s.city),
            h("div", { style: { fontFamily: "var(--font-display)", fontSize: 15, opacity: 0.75 } }, s.venue),
            h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
              cfg.tag ? cfg.tag() : null,
              Button({ variant: cfg.variant, style: cfg.disabled ? { opacity: 0.35, cursor: "not-allowed" } : {} }, cfg.label))
          );
        })
      ),
      h("div", { style: { marginTop: 64 } },
        Stamp("Not near you?", { style: { opacity: 0.55 } }),
        h("h3", { style: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, letterSpacing: "-0.02em", margin: "8px 0 16px", maxWidth: 460 } }, "Tell us where to play next."),
        Field({ placeholder: "city, country", cta: "Send →" }))
    );
  }

  var NOTES = [
    {
      code: "n / 014", date: "08.20.26 · 04:02", title: "on saturday",
      body: "started phonelight on a saturday. didn't finish it until a tuesday. that gap is the song. you make a thing on a high and then you live with it on a wednesday morning when the same room looks different. both of those rooms are in there."
    },
    {
      code: "n / 013", date: "08.04.26 · 23:11", title: "the voice through the machine",
      body: "people keep asking if the vocoded sound is to hide. it's the opposite. when the voice goes through the machine it carries more. you can say the embarrassing thing because the machine carries it for you. you say it bigger."
    },
    {
      code: "n / 012", date: "07.22.26 · 02:47", title: "for the room",
      body: "if you're at the show and a song hits you sideways — that's the assignment. don't worry about being seen. nobody's looking. they're in their own version of it."
    }
  ];

  function Notes() {
    return h("main", { style: { padding: "64px 32px 200px", background: "var(--paper)", color: "var(--ink)" } },
      Stamp("↳ NOTES · A LETTER FILE", { style: { opacity: 0.55 } }),
      h("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.95, letterSpacing: "-0.03em", margin: "10px 0 56px" } }, "Notes"),
      h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 200px", gap: 80 } },
        h("div", { style: { display: "grid", gap: 64 } },
          NOTES.map(function (n) {
            return h("article", { style: { borderTop: "1px solid var(--ink)", paddingTop: 24 } },
              h("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 16 } },
                Stamp(n.code, { style: { color: "var(--screen-blue)" } }),
                Stamp(n.date, { style: { opacity: 0.6 } })),
              h("h2", { style: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", margin: "0 0 16px", textTransform: "lowercase" } }, n.title),
              h("p", { style: { fontSize: 18, lineHeight: 1.6, maxWidth: "60ch", textWrap: "pretty" } }, n.body),
              h("a", { className: "link", style: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "var(--screen-blue)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" } },
                "Read full ", Icon("arrow", 12))
            );
          })
        ),
        h("aside", { style: { position: "sticky", top: 100, alignSelf: "start" } },
          Stamp("Subscribe to notes", { style: { opacity: 0.55 } }),
          h("p", { style: { fontSize: 14, lineHeight: 1.55, margin: "10px 0 16px", opacity: 0.8 } }, "once a month. transmissions only."),
          h("form", { onSubmit: function (e) { e.preventDefault(); }, style: { display: "grid", gap: 10 } },
            h("input", { placeholder: "email", style: { border: "1px solid var(--ink)", padding: "12px 14px", background: "transparent", fontFamily: "var(--font-display)", fontSize: 15 } }),
            Button({ variant: "primary", style: { width: "100%" } }, "Send me notes →")))
      )
    );
  }

  function Subscribe() {
    var content;
    if (state.subscribed) {
      content = h("div", { style: { border: "1px solid rgba(234, 238, 255,.4)", padding: 28, maxWidth: 560 } },
        Stamp("SIGNAL RECEIVED ✓", { style: { color: "var(--signal)" } }),
        h("p", { style: { marginTop: 12, fontSize: 18, lineHeight: 1.55 } }, "you'll get the next one. thanks for tuning in."));
    } else {
      content = h("form", {
        onSubmit: function (e) { e.preventDefault(); state.subscribed = true; render(); },
        style: { display: "flex", border: "1px solid var(--paper)", height: 64, maxWidth: 620 }
      },
        h("input", { type: "email", required: true, placeholder: "your email", style: { flex: 1, border: 0, outline: 0, background: "transparent", padding: "0 22px", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--paper)" } }),
        h("button", { style: { background: "var(--screen-blue)", color: "var(--paper)", border: 0, padding: "0 28px", fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 14, cursor: "pointer" } }, "Tune in →"));
    }

    return h("main", { style: { background: "var(--late-night)", color: "var(--paper)", minHeight: "90vh", padding: "120px 32px 200px", position: "relative", overflow: "hidden" } },
      h("div", { style: { position: "absolute", inset: 0, opacity: 0.08, background: "radial-gradient(circle at 80% 20%, var(--screen-blue), transparent 50%)" } }),
      h("div", { style: { position: "relative", maxWidth: 920 } },
        Stamp("↳ TRANSMISSIONS / DIRECT", { style: { color: "rgba(234, 238, 255,.65)" } }),
        h("h1", { style: { fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(48px, 10vw, 144px)", lineHeight: 0.92, letterSpacing: "-0.035em", margin: "12px 0 24px", textWrap: "balance" } }, "One letter,", h("br"), "once a month."),
        h("p", { style: { maxWidth: 560, fontSize: 19, lineHeight: 1.55, color: "rgba(234, 238, 255,.78)", marginBottom: 40 } },
          "Songs before they're released. A note from the room they were written in. The address of the next small show before anyone else gets it. No spam. No \"JUST IN\" emojis. Just the transmission."),
        content,
        h("div", { style: { display: "flex", gap: 24, marginTop: 48, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(234, 238, 255,.55)" } },
          h("span", null, "NO SPAM"), h("span", null, "·"), h("span", null, "UNSUBSCRIBE IN ONE CLICK"), h("span", null, "·"), h("span", null, "~ 1 / MONTH"))
      )
    );
  }

  // =======================================================================
  //  APP — state + router + render loop
  // =======================================================================

  var state = {
    page: "landing",
    nowPlaying: { title: "Phonelight", kind: "single", runtime: "04:12" },
    playing: false,
    musicActive: 1,
    subscribed: false
  };

  function go(page) {
    state.page = page;
    window.scrollTo(0, 0);
    render();
  }

  function currentView() {
    switch (state.page) {
      case "music": return Music();
      case "shows": return Shows();
      case "notes": return Notes();
      case "subscribe": return Subscribe();
      default: return Landing();
    }
  }

  function render() {
    var root = document.getElementById("root");
    root.textContent = "";
    var app = h("div", null, Header(), currentView(), Footer(), MiniPlayer());
    app.setAttribute("data-screen-label", "AB · " + state.page);
    root.appendChild(app);
  }

  render();
})();
