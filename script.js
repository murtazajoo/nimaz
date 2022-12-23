function popover() {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}
function all() {
  let nextTime = document.getElementById("nex-prayer-time");
  let nextName = document.getElementById("nex-prayer-name");
  let nextLeft = document.getElementById("nex-prayer-left");
  let todayBtn = document.getElementById("today");
  let tommBtn = document.getElementById("tomm");
  let t;
  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hr(s)  " + rminutes + " min(s)";
  }
  let dateAndTime,
    date,
    time,
    k,
    timeMin,
    realTimeMin,
    ap,
    realTime,
    objAll,
    obj;
  function values() {
    dateAndTime = new Date();
    date = dateAndTime.getDate();
    time = dateAndTime.toLocaleTimeString();
    k = time.split(":");
    k.pop();
    realTime = parseInt(k.join(""));

    timeMin = k;
    timeMin[0] *= 60;
    realTimeMin = parseInt(timeMin[0]) + parseInt(timeMin[1]);
    ap = time.split(" ")[1];
    objAll = data[0].prayers[date - 1];
    obj = Object.entries(objAll);
  }
  values();

  let tommorowObj = data[0].prayers[date];
  let objTomm = Object.entries(tommorowObj);

  function timeLeft(l) {
    nextPrayerTime = l.split(":");
    nextPrayerTime[0] *= 60;
    nextPrayerTime = parseInt(nextPrayerTime[0]) + parseInt(nextPrayerTime[1]);
    nextLeft.innerHTML = timeConvert(nextPrayerTime - realTimeMin);
  }

  if (ap == "PM") {
    for (let i = 0; i < obj.length - 3; i++) {
      let last = i > 1 ? 0 : parseInt(obj[i + 1][1].replace(":", ""));
      if (parseInt(obj[i][1].replace(":", "")) > realTime && last < realTime) {
        nextTime.innerHTML = obj[i][1];
        nextName.innerHTML = obj[i][0];

        timeLeft(obj[i][1]);
        break;
      }
      if (
        parseInt(realTime.toString().slice(0, -2)) > 12
        // parseInt(objAll.Dhuhr.replace(":", "")) > realTime
      ) {
        nextTime.innerHTML = objAll.Dhuhr;
        nextName.innerHTML = "Dhuhr";
        timeLeft(objAll.Dhuhr);
      } else {
        t = true;
        nextTime.innerHTML = tommorowObj.Fajr;
        document.getElementById("tommorrow-left").innerHTML = "Tommorrow Fajr";
      }
    }
  } else if (ap == "AM") {
    if (parseInt(objAll.Fajr.replace(":", "")) > realTime) {
      nextTime.innerHTML = objAll.Fajr;
      nextName.innerHTML = "Fajr";
      timeLeft(objAll.Fajr);
    } else {
      nextTime.innerHTML = objAll.Dhuhr;
      nextName.innerHTML = "Dhuhr";
      timeLeft(objAll.Dhuhr);
    }
  }
  let nimazTime = {
    Fajr: "30min",
    Dhuhr: "15min",
    Ashar: "15min",
    Maghrib: "7min",
    Ishaa: "10min",
  };
  let prayersEle = document.getElementById("all-prayers");
  function allPrayerMaker(obj) {
    let finalHtml = "";
    for (let j = obj.length - 2; j >= 0; j--) {
      e = obj[j];
      finalHtml += ` <div class="row py-2">
            <div class="col-2 opacity-50">
              <img src="images/${e[0].toLowerCase()}.png" alt="" />
            </div>
            <div class="col-8 poppins">${
              e[0]
            } <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="${
        nimazTime[e[0]]
      } gap">
  <button class=" rounded-5 p-0 border d-flex justify-content-center align-items-center text-center" style="height:15px;width:15px;font-size:10px;" type="button" >i</button>
</span></div>
            <div class="col-2 text-center kanit">${e[1]}</div>
          </div>`;
    }
    return finalHtml;
  }

  prayersEle.innerHTML = allPrayerMaker(obj);

  let dayEle = document.getElementById("day");
  let day;
  switch (new Date().getDay()) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }

  dayEle.innerHTML = day;

  let dateEle = document.getElementById("date");

  dateEle.innerHTML =
    dateAndTime.getDate() +
    "/" +
    dateAndTime.getMonth() +
    "/" +
    dateAndTime.getFullYear();

  var now = new Date();
  var dayOfYear = Math.floor(
    (new Date() - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  var hijriDate =
    ((now.getFullYear() - 621.5643) * 365.24225 + dayOfYear) / 354.36707;
  var hijriYear = Math.floor(hijriDate);
  var hijriMonth = Math.ceil(
    ((hijriDate - Math.floor(hijriDate)) * 354.36707) / 29.530589
  );
  var hijriDay = Math.floor(
    ((hijriDate - Math.floor(hijriDate)) * 354.36707) % 29.530589
  );

  let islamicDate = document.getElementById("islamic-date");
  islamicDate.innerHTML = `${hijriYear}/${hijriMonth}/${hijriDay}`;

  todayBtn.onclick = () => {
    todayBtn.classList.add("border", "border-secondary");
    tommBtn.classList.remove("border", "border-secondary");
    prayersEle.innerHTML = allPrayerMaker(obj);
    popover();
  };

  tommBtn.onclick = () => {
    todayBtn.classList.remove("border", "border-secondary");
    tommBtn.classList.add("border", "border-secondary");
    prayersEle.innerHTML = allPrayerMaker(objTomm);
    popover();
  };
  if (t) {
    tommBtn.click();
  }
  popover();
}
all();

setInterval(() => {
  all();
}, 30000);

let deferredPrompt;
const addBtn = document.querySelector(".add-button");
addBtn.style.display = "none";
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = "block";

  addBtn.addEventListener("click", (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = "none";
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  });
});
