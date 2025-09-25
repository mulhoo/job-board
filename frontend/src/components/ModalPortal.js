import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
  const target = document.getElementById("modal-root") || document.body;
  return createPortal(children, target);
}
