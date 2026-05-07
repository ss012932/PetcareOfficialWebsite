// app/utils/alertService.ts

import Swal from "sweetalert2";
import type { SweetAlertIcon } from "sweetalert2";

// =======================
// 成功提示
// =======================
export function showSuccess(message: string = "操作成功") {
  return Swal.fire({
    icon: "success",
    title: "成功",
    text: message,
    timer: 1500,
    timerProgressBar: true,
    confirmButtonText: "確定",
  });
}

// =======================
// 錯誤提示
// =======================
export function showError(message: string = "發生錯誤") {
  return Swal.fire({
    icon: "error",
    title: "錯誤",
    text: message,
    confirmButtonText: "了解",
  });
}

// =======================
// 確認提示
// =======================
export function showConfirm(message: string = "你確定要執行此操作嗎？") {
  return Swal.fire({
    icon: "warning",
    title: "請確認",
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  });
}

// =======================
// Prompt
// =======================
export function showPrompt(title = "請輸入資料", inputType: any = "text") {
  return Swal.fire({
    title,
    input: inputType,
    inputPlaceholder: "請輸入內容",
    showCancelButton: true,
    confirmButtonText: "送出",
    cancelButtonText: "取消",
  });
}

// =======================
// Toast
// =======================
export function showToast(
  message = "操作成功",
  icon: SweetAlertIcon = "success",
) {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}

// =======================
// Loading
// =======================
export function showLoading(title = "處理中，請稍候...") {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function hideLoading() {
  Swal.close();
}

// =======================
// 自訂彈窗
// =======================
export function showCustom(
  title: string,
  text: string,
  icon: SweetAlertIcon = "info",
) {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "確定",
    didOpen: () => {
      // ===== 設定 SweetAlert2 所有層級的 z-index，確保在 modal 上方 =====
      const container = Swal.getContainer();
      const popup = Swal.getPopup();
      
      if (container) {
        container.style.zIndex = "99999";
      }
      if (popup) {
        popup.style.zIndex = "99999";
      }
      
      // ===== 設定 backdrop（背景遮罩）的 z-index =====
      const backdrop = document.querySelector('.swal2-container');
      if (backdrop instanceof HTMLElement) {
        backdrop.style.zIndex = "99999";
      }
    },
  });
}

// =======================
// HTML popup
// =======================
export function showHtmlPopup(title: string, html: string, width = 450) {
  return Swal.fire({
    title,
    html,
    width,
    showConfirmButton: false,
  });
}

// =======================
// 商品數量選擇
// =======================
export async function showQuantitySelector(
  productName: string,
  stock = 1,
  meter = 1,
  currentQty = 0,
) {
  let quantity = currentQty > 0 ? currentQty : 1;

  const maxQuantity = meter === 1 ? stock : Infinity;
  const stockText = meter === 0 && stock > 0 ? "有庫存" : `${stock} 件`;

  return Swal.fire({
    title: productName,

    html: `
      <div style="text-align:center">
        <p>${currentQty > 0 ? "調整購買數量：" : "選擇購買數量："}</p>
        <div style="display:flex;justify-content:center">
          <button id="decrease">-</button>
          <span id="qty">${quantity}</span>
          <button id="increase">+</button>
        </div>
        <p>庫存：${stockText}</p>
      </div>
    `,

    showCancelButton: true,
    confirmButtonText: currentQty > 0 ? "更新數量" : "加入購物車",
    cancelButtonText: "取消",

    didOpen: () => {
      const popup = Swal.getPopup()!;
      const qtyEl = popup.querySelector("#qty")!;
      const decrease = popup.querySelector("#decrease")!;
      const increase = popup.querySelector("#increase")!;

      decrease.addEventListener("click", () => {
        if (quantity > (currentQty > 0 ? 0 : 1)) {
          quantity--;
          qtyEl.textContent = String(quantity);
        }
      });

      increase.addEventListener("click", () => {
        if (quantity < maxQuantity) {
          quantity++;
          qtyEl.textContent = String(quantity);
        }
      });
    },

    preConfirm: () => quantity,
  });
}

// =======================
// 關閉彈窗
// =======================
export function closePopup() {
  Swal.close();
}
