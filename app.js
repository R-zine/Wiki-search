// Browser check

browserCheck = () => {
  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  var isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  if (isOpera || isFirefox || isEdge)
    alert(
      "Speech recognition is not supported on your browser. The site will run with limited functionality"
    );
};

browserCheck();

// End of browser check

const search = document.querySelector(".search");
const results = document.querySelector(".results");
const clearBtn = document.querySelector(".clear");
const btn = document.querySelector(".mic");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

var value = "";

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  search.value = "";
  value = "";
  searchWiki(value);
  clearBtn.classList.remove("visible");
});

searchWiki = async (value) => {
  if (!value) {
    results.innerHTML = "<h4>List cleared!</h4>";
    setTimeout(() => {
      results.innerHTML = "";
    }, 1000);
  } else {
    let list = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=10&gsrsearch=${value}&gsrprop=snippet`
    );
    let result = await list.json();
    console.log(result);
    if (!result.query) results.innerHTML = "<h4>No results found.</h4>";
    else {
      let pages = result.query.pages;

      let ids = Object.keys(pages);

      results.innerHTML = ids.reduce(
        (acc, el) =>
          (acc += `<article>
        <a href="https://en.wikipedia.org/?curid=${el}" target="_blank"><h3>${pages[el].title}</h3>
        <p>${pages[el].snippet}...</p></a>
      </article>`),
        ""
      );
    }
  }
};

btn.onclick = () => {
  recognition.start();
  btn.classList.add("active");
  setTimeout(() => {
    recognition.stop();
    btn.classList.remove("active");
  }, 2000);
};

recognition.onresult = (e) => {
  search.value = e.results[0][0].transcript;
  value = search.value;
  searchWiki(value);
};

search.addEventListener("keyup", () => {
  value = search.value;
  searchWiki(value);
  if (value) clearBtn.classList.add("visible");
  if (!value) clearBtn.classList.remove("visible");
});
