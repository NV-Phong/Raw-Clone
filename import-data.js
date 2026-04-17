/**
 * ===== IMPORT DATA FROM data.json & UPDATE HTML =====
 * Fetch dữ liệu từ data.json và cập nhật nội dung trang
 * Chỉ cập nhật khi trang load
 */

let MAPPING = [];

// Fetch dữ liệu từ data.json
async function loadDataFromJSON() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
    
    const data = await response.json();
    console.log('✅ Dữ liệu từ data.json:', data);
    
    // Xây dựng MAPPING từ dữ liệu
    MAPPING = [
      { id: "w-kb6stlwe", text: `${data.groom?.firstName || ''} & ${data.bride?.firstName || ''}` },
      { id: "w-mz04c43b", text: data.groom?.name || '' },
      { id: "w-0vqn3fzh", text: data.bride?.name || '' },
      { id: "w-vq47tj4t", text: `${data.groom?.parents?.father || ''}\n${data.groom?.parents?.mother || ''} ` },
      { id: "w-fynwgspj", text: `${data.bride?.parents?.father || ''}\n${data.bride?.parents?.mother || ''} ` },
      { id: "w-y1s24e6p", text: data.groom?.hometown || '' },
      { id: "w-2wvcu7z3", text: data.bride?.hometown || '' },
      { id: "w-wi89g5us", text: data.wedding_ceremony?.name || '' },
      { id: "w-jkm0ioqy", text: data.wedding_ceremony?.time || '' },
      { id: "w-tzt5ncnt", text: data.wedding_ceremony?.day || '' },
      { id: "w-2eldzvuo", text: (data.wedding_ceremony?.date || '').split('.')[0] },
      { id: "w-y3b9j696", text: `Tháng ${(data.wedding_ceremony?.date || '').split('.')[1]}` },
      { id: "w-ajw71iaq", text: `Năm ${(data.wedding_ceremony?.date || '').split('.')[2]}` },
      { id: "w-akmf0jjg", text: data.reception_1?.name || '' },
      { id: "w-xk7m9u1p", text: `${data.reception_1?.time} - ${data.reception_1?.day}` },
      { id: "w-2bfvf872", text: data.reception_1?.date || '' },
      { id: "w-n49s9ljy", text: `Tại ${data.reception_1?.venue || ''}` },
      { id: "w-m1u3o3mx", text: data.reception_1?.venue || '' },
      { id: "w-oq2hoi54", text: data.reception_1?.address || '' },
      { id: "w-vg6knxma", text: `Tại ${data.wedding_ceremony?.location || ''}` }
    ];
    
    // Áp dụng mapping ngay
    applyMapping();
    
    // Cập nhật ảnh từ mảng images
    updateImages(data.images || []);
  } catch (error) {
    console.error('❌ Lỗi khi load data:', error);
  }
}

// Function: Giữ markup, chỉ đổi nodeValue của text node
function setTextPreserve(el, newText) {
  if (!el) return;
  
  const tag = el.tagName?.toLowerCase?.();
  if (tag === "input" || tag === "textarea") {
    el.value = newText;
    return;
  }
  
  // Nếu có xuống dòng, bật pre-line cục bộ
  if (newText.includes("\n")) {
    const ws = (el instanceof Element) ? getComputedStyle(el).whiteSpace : "normal";
    if (ws === "normal") el.style.whiteSpace = "pre-line";
  }
  
  // 1) ưu tiên text node trực tiếp
  const directText = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
  if (directText) { 
    directText.nodeValue = newText; 
    return; 
  }
  
  // 2) nếu text nằm sâu trong các span wrapper (animation)
  const walker = document.createTreeWalker(
    el,
    NodeFilter.SHOW_TEXT,
    { acceptNode: n => n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
  );
  const firstText = walker.nextNode();
  if (firstText) firstText.nodeValue = newText;
}

// Áp dụng MAPPING vào trang
function applyMapping() {
  for (const { id, text } of MAPPING) {
    const el = document.getElementById(id);
    if (el) setTextPreserve(el, text);
  }
}

// Cập nhật ảnh từ mảng data.json
function updateImages(imageArray) {
  if (!imageArray || imageArray.length === 0) return;
  
  // Danh sách ID ảnh trong trang (ánh xạ với images array)
  const imageIds = [
    "naxe79ho",  // 0
    "au7t3ww6",  // 1
    "dyyqc44u",  // 2
    "p5zt0rep",  // 3
    "to8ewwrh",  // 4
    "6lu0wbie",  // 5
    "72dy145n",  // 6
    "xwi8ol3i",  // 7
    "cmhlzttx",  // 8
    "ckr5z4rp",  // 9
    "o7ncho16",  // 10
    "u4yp1226",  // 11
    "bamvvrik"   // 12
  ];
  
  imageIds.forEach((id, index) => {
    if (imageArray[index]) {
      const container = document.getElementById("w-" + id);
      if (container) {
        const bgEl = container.querySelector('.image-background');
        if (bgEl) {
          // Cập nhật background-image CSS
          bgEl.style.backgroundImage = `url('${imageArray[index]}')`;
        }
      }
    }
  });
}

// Đợi DOM sẵn sàng
function onReady(cb) {
  const run = () => requestAnimationFrame(() => setTimeout(cb, 0));
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}

// Chạy ngay khi script load
onReady(loadDataFromJSON);
