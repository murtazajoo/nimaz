function all() {
  //some functions
  function timeToMin(time) {
    //time format = 12:12
    givenHours = time.split(":")[0] * 60;
    givenMin = time.split(":")[1];
    return parseInt(givenHours) + parseInt(givenMin);
  }
  function minToTime(min) {
    num = min;
    hours = num / 60;
    rhours = Math.floor(hours);
    minutes = (hours - rhours) * 60;
    rminutes = Math.round(minutes);
    return rhours + " hr(s)  " + rminutes + " min(s)";
  }
  function popover() {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
  }

  let dateTime,
    dateToday,
    todayPrayerObj,
    todayPrayerArr,
    localTime,
    shortLocalTime,
    localTimeMin,
    meridiem,
    helper;
  // setting values to variables
  dateTime = new Date();
  dateToday = dateTime.getDate();
  localTime = dateTime.toLocaleTimeString();
  // localTime = "3:30:46 PM"; //manual
  helper = localTime.split(" ")[0].split(":");
  helper.pop();
  shortLocalTime = helper.join(":");
  meridiem = localTime.split(" ")[1];
  todayPrayerObj = data[0].prayers[dateToday - 1];
  todayPrayerArr = Object.entries(todayPrayerObj);
  localTimeMin = timeToMin(shortLocalTime);
  let nextPrayerArr = [];

  if (meridiem === "PM") {
    count = todayPrayerArr.length - 3;
    for (i = count; i >= 0; i--) {
      prayer = todayPrayerArr[i]; //array of the prayer name and time
      prayerTimeMin = timeToMin(prayer[1]);
      lowerPrayer = todayPrayerArr[i + 1][1];
      lowerPrayerTimeMin = timeToMin(lowerPrayer); // prayer below the selected prayer

      if (
        (shortLocalTime.split(":")[0] === "12" && i == count) ||
        (lowerPrayer.split(":")[0] === "12" && i == 1)
      ) {
        if (prayerTimeMin > localTimeMin && lowerPrayerTimeMin < localTimeMin) {
          nextPrayerArr = prayer;
        } else {
          nextPrayerArr = todayPrayerArr[2];
        }

        break;
      } else if (prayerTimeMin > localTimeMin) {
        if (prayer[1].split(":")[0] === "12" && i === count) {
          continue;
        } else {
          nextPrayerArr = prayer;
        }
        break;
      } else if (i === 0) {
        nextPrayerArr = ["tommorow"];
      }
    }
  }
  if (meridiem === "AM") {
    if (
      shortLocalTime.split(":")[0] === "12" ||
      localTimeMin < timeToMin(todayPrayerObj.Fajr)
    ) {
      nextPrayerArr = todayPrayerArr[4];
    } else {
      nextPrayerArr = todayPrayerArr[3];
    }
  }

  function render(arr) {
    let eleNextPrayer = document.getElementById("nex-prayer-time");
    let eleMessage = document.getElementById("message");
    if (arr[0] == "tommorow") {
      eleNextPrayer.innerHTML = "All Done";
      eleMessage.innerHTML = "all prayers prayed today";
      tommBtn.click();
      return;
    }
    nextPrayerName = arr[0];
    nextPrayerTime = arr[1];
    message =
      minToTime(timeToMin(nextPrayerTime) - localTimeMin) +
      " left until " +
      nextPrayerName;
    eleNextPrayer.innerHTML = nextPrayerTime;
    eleMessage.innerHTML = message;
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

  prayersEle.innerHTML = allPrayerMaker(todayPrayerArr);
  popover();
  let todayBtn = document.getElementById("today");
  let tommBtn = document.getElementById("tomm");
  let tommorowPrayerArr = Object.entries(data[0].prayers[dateToday]);
  todayBtn.onclick = () => {
    todayBtn.classList.add("border", "border-secondary");
    tommBtn.classList.remove("border", "border-secondary");
    prayersEle.innerHTML = allPrayerMaker(todayPrayerArr);
    popover();
  };

  tommBtn.onclick = () => {
    todayBtn.classList.remove("border", "border-secondary");
    tommBtn.classList.add("border", "border-secondary");
    prayersEle.innerHTML = allPrayerMaker(tommorowPrayerArr);
    popover();
  };
  render(nextPrayerArr);

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
    dateTime.getDate() +
    "/" +
    dateTime.getMonth() +
    "/" +
    dateTime.getFullYear();

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
}
all();
setInterval(() => {
  all();
}, 15000);
let deferredPrompt;
const addBtn = document.querySelector(".add-button");
addBtn.style.visibility = "hidden";
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.visibility = "visible";

  addBtn.addEventListener("click", (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.visibility = "hidden";
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      deferredPrompt = null;
    });
  });
});
