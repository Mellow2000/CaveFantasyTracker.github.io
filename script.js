let sections = [
  { 
    name: "FLY OVER FIVE CONTINENTS",
    slots: ["11:00 น.","11:15 น.","11:30 น.","11:45 น.","14:00 น.","14:15 น.","14:30 น.","14:45 น.","17:00 น.","17:15 น.","17:30 น.","17:45 น.","20:00 น.","20:15 น.","20:30 น.","20:45 น."],
    counts: []
  },
  { 
    name: "THE FURIOUS BEASTS",
    slots: ["12:00 น.","12:15 น.","12:30 น.","12:45 น.","15:00 น.","15:15 น.","15:30 น.","15:45 น.","18:00 น.","18:15 น.","18:30 น.","18:45 น."],
    counts: []
  },
  { 
    name: "NIGHTMARE ROLLERCOASTER",
    slots: ["13:00 น.","13:15 น.","13:30 น.","13:45 น.","16:00 น.","16:15 น.","16:30 น.","16:45 น.","19:00 น.","19:15 น.","19:30 น.","19:45 น.","21:00 น."],
    counts: []
  }
];

let max = 24;

sections.forEach(sec => {
  if(sec.counts.length === 0){
    sec.counts = new Array(sec.slots.length).fill(0);
  }
});


function createUI(){
  let tabHTML = "";
  let contentHTML = "";
  let icons = [
  "images/fly.jpg",
  "images/beast.jpg",
  "images/roller.jpg"
  ];

  sections.forEach((sec, sIndex) => {
    // สร้าง tab รูป
    tabHTML += `
      <button class="tab-btn" id="tab_${sIndex}" onclick="showTab(${sIndex})">
        <img src="${icons[sIndex]}" class="tab-icon">
      </button>
    `;

    // section (ซ่อนไว้ก่อน)
    contentHTML += `<div class="section tab-content" id="section_${sIndex}" style="display:${sIndex===0?'block':'none'}">`;
    contentHTML += `<h1>${sec.name}</h1>`;
    

sec.slots.forEach((slot, i) => {
  contentHTML += `
    <div id="slot_${sIndex}_${i}" class="slot">
      <div id="label_${sIndex}_${i}">
        <span class="time">${slot}</span>
        <span class="count">(0/${max})</span>
      </div>

      <div class="btn-group plus">
        <button onclick="update(${sIndex},${i},1)">+1</button>
        <button onclick="update(${sIndex},${i},5)">+5</button>
        <button onclick="update(${sIndex},${i},10)">+10</button>
      </div>

      <div class="btn-group minus">
        <button onclick="update(${sIndex},${i},-1)">-1</button>
        <button onclick="update(${sIndex},${i},-5)">-5</button>
        <button onclick="update(${sIndex},${i},-10)">-10</button>
      </div>

      <div class="input-add-group">
      <input
        type="number"
        min="0"
        max="99"
        placeholder="จำนวน"
        class="input-count"
        id="input_${sIndex}_${i}"
        onfocus="this.value=''"
        oninput="if(this.value.length > 2) this.value = this.value.slice(0,2)"
      />
        <button class="btn-input-add" onclick="addInputValue(${sIndex}, ${i})">+</button>
      </div>
    </div>
  `;
});

   contentHTML += `
    <div class="action-group">
        <button class="btn-summary" onclick="summary(${sIndex})">สรุป</button>
        <button class="btn-reset" onclick="resetSection(${sIndex})">เคลียร์</button>
        <button id="export_${sIndex}" class="btn-export" onclick="exportExcel(${sIndex})" style="display:none;">
        Export Excel
        </button>
    </div>

    <div id="result_${sIndex}"></div>
    `;

    contentHTML += `</div>`;
  });

  document.getElementById("tabs").innerHTML = tabHTML;
  document.getElementById("app").innerHTML = contentHTML;
  document.getElementById("tab_0").classList.add("active");
}

function updateUI(){
  sections.forEach((sec, sIndex) => {

    sec.counts.forEach((count, i) => {
      let label = document.getElementById(`label_${sIndex}_${i}`);
      let box = document.getElementById(`slot_${sIndex}_${i}`);
      let time = sec.slots[i];

      let isSpecial = time.endsWith(":15 น.") || time.endsWith(":45 น.");
      let icon = isSpecial ? " ✦" : "";

      box.classList.remove("special-slot", "warning", "full");

      // 🔴 เต็ม
      if(count >= max){
        box.classList.add("full");

        label.innerHTML = `
          <div class="status-text full-text">เต็ม</div>
          
          <div class="time-row">
            <span class="time">${time}${icon}</span>
            <span class="count">(${count}/${max})</span>
          </div>
        `;
      }
      else if(count >= 20){
        box.classList.add("warning");

        label.innerHTML = `
          <div class="status-text available">ว่าง</div>

          <div class="time-row">
            <span class="time">${time}${icon}</span>
            <span class="count">(${count}/${max})</span>
          </div>
        `;
      }
      else {
        label.innerHTML = `
          <div class="status-text available">ว่าง</div>

          <div class="time-row">
            <span class="time">${time}${icon}</span>
            <span class="count">(${count}/${max})</span>
          </div>
        `;
      }

      // special slot logic
      if(isSpecial){
        box.classList.add("special-slot");
      }

      // disable +
      let plusBtns = box.querySelectorAll(".plus button");
      plusBtns.forEach(btn => {
        btn.disabled = (count >= max);
      });

      // disable -
      let minusBtns = box.querySelectorAll(".minus button");
      minusBtns.forEach(btn => {
        btn.disabled = (count <= 0);
      });

    });
  });
}

function summary(sIndex){
  let sec = sections[sIndex];
  let total = 0;
  let text = `<div class="summary-box">`;

  sec.counts.forEach((c,i)=>{
    let fullClass = (c >= max) ? "full-slot" : "";

    text += `
      <div class="summary-item ${fullClass}">
        <span class="time">${sec.slots[i]}</span>
        <span class="count">${c}/${max}</span>
      </div>
    `;
    total += c;
  });

  text += `
    <div class="summary-total">
      รวมทั้งหมด: ${total} คน
    </div>
  </div>`;

  document.getElementById("result_"+sIndex).innerHTML = text;

  // 👉 แสดงปุ่ม export
  document.getElementById(`export_${sIndex}`).style.display = "inline-block";
}

function showTab(index){
  // 👉 บันทึก tab ล่าสุด
  localStorage.setItem("activeTab", index);

  // เปลี่ยนหน้า
  document.querySelectorAll(".tab-content").forEach((el,i)=>{
    el.style.display = (i === index) ? "block" : "none";
  });

  // active tab
  document.querySelectorAll(".tab-btn").forEach((btn,i)=>{
    btn.classList.toggle("active", i === index);
  });
}

function exportExcel(sIndex){
  let sec = sections[sIndex];

  let nowDate = new Date();

  let date =
    nowDate.getDate() + "/" +
    (nowDate.getMonth() + 1) + "/" +
    nowDate.getFullYear();

  let time =
    nowDate.getHours().toString().padStart(2, "0") + ":" +
    nowDate.getMinutes().toString().padStart(2, "0") + ":" +
    nowDate.getSeconds().toString().padStart(2, "0");

  let now = date + " " + time;

  let rows = [];
  rows.push([sec.name]);
  rows.push(["DateTime", now]);
  rows.push(["Time slot", "Attendance"]);

  sec.counts.forEach((c,i)=>{
    rows.push([sec.slots[i], c]);
  });

  let total = sec.counts.reduce((a,b)=>a+b,0);
  rows.push(["Total", total]);

  let csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");

  let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  let link = document.createElement("a");

  let today =
    nowDate.getDate() + "-" +
    (nowDate.getMonth() + 1) + "-" +
    nowDate.getFullYear();

  let fileName = sec.name.replace(/\s/g, "_") + "_" + today + ".csv";

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  alert("ดาวน์โหลดไฟล์เรียบร้อย");
}

function resetSection(sIndex){
  if(confirm("รีเซ็ต section นี้?")){
    sections[sIndex].counts = new Array(sections[sIndex].slots.length).fill(0);
    document.getElementById("result_"+sIndex).innerHTML = "";

    document.getElementById(`export_${sIndex}`).style.display = "none";

    localStorage.removeItem("counterData"); // 👈 เพิ่มตรงนี้

    updateUI();
  }
}

function update(sIndex, i, value){
  let box = document.getElementById(`slot_${sIndex}_${i}`);
  
  box.style.transform = "scale(1.1)";
  setTimeout(() => {
    box.style.transform = "";
  }, 100);

  let count = sections[sIndex].counts[i];

  if(value > 0 && count + value > max){
    alert("เกินไม่ได้ เหลืออีก " + (max - count));
    return;
  }

  if(value < 0 && count + value < 0){
    return;
  }

  sections[sIndex].counts[i] += value;

  saveData();   // ✅ ต้องมีบรรทัดนี้
  updateUI();
}

function saveData(){
  let data = {
    sections: sections,
    lastSaved: Date.now()
  };
  localStorage.setItem("counterData", JSON.stringify(data));
}

function loadData(){
  let saved = localStorage.getItem("counterData");

  if(!saved) return;

  let parsed = JSON.parse(saved);

  let now = Date.now();
  let diff = (now - parsed.lastSaved) / 1000 / 60; // นาที

  // 👉 ถ้าเกิน 15 นาที → ล้าง
  if(diff > 15){
    localStorage.removeItem("counterData");
    return;
  }

  // 👉 ถ้ายังไม่เกิน → โหลดกลับ
  sections.forEach((sec, i) => {
    if(parsed.sections[i]){
      sec.counts = parsed.sections[i].counts;
    }
  });
}

function toggleTheme(){
  let body = document.body;
  let btn = document.getElementById("themeToggle");

  if(body.classList.contains("light")){
    body.classList.remove("light");
    btn.innerText = "☀️ Light";   // 👉 จะสลับไป Light
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.add("light");
    btn.innerText = "🌙 Dark";   // 👉 จะสลับไป Dark
    localStorage.setItem("theme", "light");
  }
}

function applyTheme(theme){
  const body = document.body;
  const btn = document.getElementById("themeToggle");

  if(theme === "light"){
    body.classList.add("light");
    btn.innerText = "🌙 Dark";   // 👉 กดแล้วจะไป Dark
  } else {
    body.classList.remove("light");
    btn.innerText = "☀️ Light"; // 👉 กดแล้วจะไป Light
  }
}

function toggleTheme(){
  const isLight = document.body.classList.contains("light");
  const newTheme = isLight ? "dark" : "light";

  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
}

function resetAllConfirm(){
  document.getElementById("confirmModal").style.display = "block";
}

function closeModal(){
  document.getElementById("confirmModal").style.display = "none";
}

function resetAll(){
  // ล้างค่าทุก section
  sections.forEach(sec => {
    sec.counts = new Array(sec.slots.length).fill(0);
  });

  // ล้าง localStorage
  localStorage.removeItem("counterData");

  // ปิด popup
  closeModal();

  // update UI
  updateUI();
}

function addInputValue(sIndex, i){
  const input = document.getElementById(`input_${sIndex}_${i}`);
  let value = parseInt(input.value, 10);

  if (isNaN(value) || value <= 0) {
    return;
  }

  let current = sections[sIndex].counts[i];

  if (current + value > max) {
    alert("เกินไม่ได้ เหลืออีก " + (max - current));
    return;
  }

  sections[sIndex].counts[i] += value;

  saveData();
  updateUI();

  if (typeof summaryVisible !== "undefined" && summaryVisible[sIndex]) {
    renderSummary(sIndex);
  }

  input.value = 0;
}

window.onclick = function(e){
  let modal = document.getElementById("confirmModal");
  if(e.target === modal){
    modal.style.display = "none";
  }
}

loadData();
createUI();
updateUI();

// ✅ ค่อย apply theme หลัง UI ถูกสร้างแล้ว
let savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

// 👉 tab
let savedTab = parseInt(localStorage.getItem("activeTab"));

if(!isNaN(savedTab) && savedTab < sections.length){
  showTab(savedTab);
} else {
  showTab(0);
}

